export interface StudyParticipant {
  id: string;
  enrolledAt: string;
  consentGiven: boolean;
  consentTimestamp: string;
  demographicData?: {
    age?: string;
    gender?: string;
    nationality?: string;
    travelExperience?: string;
  };
  acuxPersonality?: ACUXPersonality;
  completedPhases: string[]; // visitId-phase combinations
}

export interface ACUXPersonality {
  id: string;
  participantId: string;
  responses: Record<string, number>; // 1-7 Likert scale responses
  calculatedScores: {
    aesthetic: number;
    cognitive: number;
    behavioral: number;
    affective: number;
  };
  dominantType: 'aesthetic' | 'cognitive' | 'behavioral' | 'affective';
  completedAt: string;
}

import { ScheduledVisit } from './visitStorage';

export interface StudyVisit extends ScheduledVisit {
  studyParticipantId?: string;
  enrolledInStudy: boolean;
  studyPhases: {
    'pre-visit': {
      completed: boolean;
      completedAt?: string;
      evaluationId?: string;
    };
    'post-visit': {
      completed: boolean;
      completedAt?: string;
      evaluationId?: string;
    };
    '24h-after': {
      completed: boolean;
      completedAt?: string;
      evaluationId?: string;
    };
  };
  nextPendingPhase?: 'pre-visit' | 'post-visit' | '24h-after' | null;
}

export interface StudyConsent {
  participantId: string;
  dataCollection: boolean;
  emotionTracking: boolean;
  followUpContact: boolean;
  dataRetention: boolean;
  timestamp: string;
}

const STUDY_PARTICIPANT_KEY = 'studyParticipant';
const ACUX_RESPONSES_KEY = 'acuxResponses';
const STUDY_CONSENT_KEY = 'studyConsent';

export const enrollInStudy = (demographicData?: StudyParticipant['demographicData']): StudyParticipant => {
  const participant: StudyParticipant = {
    id: crypto.randomUUID(),
    enrolledAt: new Date().toISOString(),
    consentGiven: false,
    consentTimestamp: '',
    demographicData,
    completedPhases: []
  };
  
  localStorage.setItem(STUDY_PARTICIPANT_KEY, JSON.stringify(participant));
  return participant;
};

export const giveStudyConsent = (consent: Omit<StudyConsent, 'participantId' | 'timestamp'>): boolean => {
  try {
    const participant = getStudyParticipant();
    if (!participant) return false;
    
    const consentData: StudyConsent = {
      ...consent,
      participantId: participant.id,
      timestamp: new Date().toISOString()
    };
    
    participant.consentGiven = true;
    participant.consentTimestamp = consentData.timestamp;
    
    localStorage.setItem(STUDY_PARTICIPANT_KEY, JSON.stringify(participant));
    localStorage.setItem(STUDY_CONSENT_KEY, JSON.stringify(consentData));
    return true;
  } catch (error) {
    console.error('Error giving study consent:', error);
    return false;
  }
};

export const getStudyParticipant = (): StudyParticipant | null => {
  try {
    const stored = localStorage.getItem(STUDY_PARTICIPANT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading study participant:', error);
    return null;
  }
};

export const getStudyConsent = (): StudyConsent | null => {
  try {
    const stored = localStorage.getItem(STUDY_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading study consent:', error);
    return null;
  }
};

export const saveACUXPersonality = (responses: Record<string, number>): ACUXPersonality | null => {
  try {
    const participant = getStudyParticipant();
    if (!participant) return null;
    
    // Calculate ACUX scores (simplified calculation for demo)
    const aesthetic = Object.entries(responses)
      .filter(([key]) => key.includes('aesthetic'))
      .reduce((sum, [, value]) => sum + value, 0) / 4;
    
    const cognitive = Object.entries(responses)
      .filter(([key]) => key.includes('cognitive'))
      .reduce((sum, [, value]) => sum + value, 0) / 4;
    
    const behavioral = Object.entries(responses)
      .filter(([key]) => key.includes('behavioral'))
      .reduce((sum, [, value]) => sum + value, 0) / 4;
    
    const affective = Object.entries(responses)
      .filter(([key]) => key.includes('affective'))
      .reduce((sum, [, value]) => sum + value, 0) / 4;
    
    const scores = { aesthetic, cognitive, behavioral, affective };
    const dominantType = Object.entries(scores)
      .reduce((a, b) => scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b)[0] as ACUXPersonality['dominantType'];
    
    const acuxPersonality: ACUXPersonality = {
      id: crypto.randomUUID(),
      participantId: participant.id,
      responses,
      calculatedScores: scores,
      dominantType,
      completedAt: new Date().toISOString()
    };
    
    participant.acuxPersonality = acuxPersonality;
    localStorage.setItem(STUDY_PARTICIPANT_KEY, JSON.stringify(participant));
    
    return acuxPersonality;
  } catch (error) {
    console.error('Error saving ACUX personality:', error);
    return null;
  }
};

export const isEnrolledInStudy = (): boolean => {
  const participant = getStudyParticipant();
  return participant !== null && participant.consentGiven;
};

export const markPhaseCompleted = (visitId: string, phase: 'pre-visit' | 'post-visit' | '24h-after', evaluationId: string): void => {
  const participant = getStudyParticipant();
  if (!participant) return;
  
  const phaseKey = `${visitId}-${phase}`;
  if (!participant.completedPhases.includes(phaseKey)) {
    participant.completedPhases.push(phaseKey);
    localStorage.setItem(STUDY_PARTICIPANT_KEY, JSON.stringify(participant));
  }
};

export const hasCompletedStudyPhase = (visitId: string, phase: 'pre-visit' | 'post-visit' | '24h-after'): boolean => {
  const participant = getStudyParticipant();
  if (!participant) return false;
  
  const phaseKey = `${visitId}-${phase}`;
  return participant.completedPhases.includes(phaseKey);
};