import { ScheduledVisit, getScheduledVisits, updateVisitStatus } from './visitStorage';
import { getStudyParticipant } from './studyStorage';
import { hasCompletedPhase } from './evaluationStorage';

export type StudyPhase = 'pre-visit' | 'post-visit' | '24h-after';

// Calculate which evaluation phase is currently appropriate for a visit
export const getCurrentEvaluationPhase = (visit: ScheduledVisit): StudyPhase | null => {
  if (!visit.enrolledInStudy) return null;
  
  const now = new Date();
  const visitDate = new Date(visit.visitDate);
  const hoursUntilVisit = (visitDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const hoursAfterVisit = (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60);

  // Pre-visit: available from 7 days before until visit time
  if (hoursUntilVisit <= 168 && hoursUntilVisit > 0) {
    return !visit.studyPhases['pre-visit'].completed ? 'pre-visit' : null;
  }
  
  // Post-visit: available immediately after visit until 24 hours later
  if (hoursAfterVisit >= 0 && hoursAfterVisit <= 24) {
    return !visit.studyPhases['post-visit'].completed ? 'post-visit' : null;
  }
  
  // 24h-after: available from 24 hours after visit for 48 hours
  if (hoursAfterVisit > 24 && hoursAfterVisit <= 72) {
    return !visit.studyPhases['24h-after'].completed ? '24h-after' : null;
  }

  return null;
};

// Update visit phases when an evaluation is completed
export const markVisitPhaseCompleted = (visitId: string, phase: StudyPhase, evaluationId: string): boolean => {
  const visits = getScheduledVisits();
  const visitIndex = visits.findIndex(v => v.id === visitId);
  
  if (visitIndex === -1) return false;
  
  const visit = visits[visitIndex];
  visit.studyPhases[phase] = {
    completed: true,
    completedAt: new Date().toISOString(),
    evaluationId
  };
  
  // Update next pending phase
  visit.nextPendingPhase = getCurrentEvaluationPhase(visit);
  
  visits[visitIndex] = visit;
  localStorage.setItem('scheduledVisits', JSON.stringify(visits));
  
  return true;
};

// Get all study visits for the current participant
export const getStudyVisits = (): ScheduledVisit[] => {
  const participant = getStudyParticipant();
  if (!participant || !participant.consentGiven) return [];
  
  return getScheduledVisits().filter(visit => 
    visit.enrolledInStudy && visit.studyParticipantId === participant.id
  );
};

// Get visits with pending evaluations
export const getVisitsWithPendingEvaluations = (): ScheduledVisit[] => {
  return getStudyVisits().filter(visit => 
    getCurrentEvaluationPhase(visit) !== null
  );
};

// Check if a visit can be evaluated now
export const canEvaluateVisit = (visit: ScheduledVisit): boolean => {
  if (!visit.enrolledInStudy) return false;
  return getCurrentEvaluationPhase(visit) !== null;
};

// Get the evaluation URL for a visit
export const getEvaluationUrl = (visit: ScheduledVisit): string | null => {
  const phase = getCurrentEvaluationPhase(visit);
  if (!phase) return null;
  
  return `/evaluation/${visit.id}?phase=${phase}`;
};

// Update all visits to calculate current phases
export const updateAllVisitPhases = (): void => {
  const visits = getScheduledVisits();
  let hasChanges = false;
  
  visits.forEach((visit, index) => {
    if (visit.enrolledInStudy) {
      const newPhase = getCurrentEvaluationPhase(visit);
      if (visit.nextPendingPhase !== newPhase) {
        visits[index].nextPendingPhase = newPhase;
        hasChanges = true;
      }
    }
  });
  
  if (hasChanges) {
    localStorage.setItem('scheduledVisits', JSON.stringify(visits));
  }
};