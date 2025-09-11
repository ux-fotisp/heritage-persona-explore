import { ScheduledVisit } from './visitStorage';
import { getStudyParticipant, ACUXPersonality } from './studyStorage';
import { getEvaluationEntries, EvaluationEntry } from './evaluationStorage';

export interface StudyAnalytics {
  participant: {
    id: string;
    enrolledAt: string;
    personality?: ACUXPersonality;
    totalVisits: number;
    completedEvaluations: number;
    completionRate: number;
  };
  evaluationData: {
    phaseBreakdown: {
      'pre-visit': number;
      'post-visit': number;
      '24h-after': number;
    };
    averageUEQS: Record<string, number>;
    emotionTrends: Record<string, number>;
    commonThemes: string[];
  };
  visitPatterns: {
    preferredSites: string[];
    visitFrequency: number;
    averageTimeBetweenVisits: number;
  };
  insights: {
    engagementLevel: 'low' | 'medium' | 'high';
    personalityAlignment: number;
    recommendationScore: number;
  };
}

export const generateStudyAnalytics = (studyVisits: ScheduledVisit[]): StudyAnalytics | null => {
  const participant = getStudyParticipant();
  if (!participant || !participant.consentGiven) return null;

  const evaluations = getEvaluationEntries();
  const userEvaluations = evaluations.filter(evaluation => 
    studyVisits.some(visit => visit.id === evaluation.visitId)
  );

  // Phase breakdown
  const phaseBreakdown = {
    'pre-visit': userEvaluations.filter(evaluation => evaluation.phase === 'pre-visit').length,
    'post-visit': userEvaluations.filter(evaluation => evaluation.phase === 'post-visit').length,
    '24h-after': userEvaluations.filter(evaluation => evaluation.phase === '24h-after').length,
  };

  // UEQS averages
  const ueqsEvaluations = userEvaluations.filter(evaluation => evaluation.ueqsResponses);
  const averageUEQS: Record<string, number> = {};
  
  if (ueqsEvaluations.length > 0) {
    const allUEQSKeys = new Set<string>();
    ueqsEvaluations.forEach(evaluation => {
      if (evaluation.ueqsResponses) {
        Object.keys(evaluation.ueqsResponses).forEach(key => allUEQSKeys.add(key));
      }
    });

    allUEQSKeys.forEach(key => {
      const values = ueqsEvaluations
        .map(evaluation => evaluation.ueqsResponses?.[key])
        .filter(val => val !== undefined) as number[];
      
      if (values.length > 0) {
        averageUEQS[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });
  }

  // Emotion trends
  const emotionEvaluations = userEvaluations.filter(evaluation => evaluation.emotionWheel);
  const emotionTrends: Record<string, number> = {};
  
  if (emotionEvaluations.length > 0) {
    const allEmotionKeys = new Set<string>();
    emotionEvaluations.forEach(evaluation => {
      if (evaluation.emotionWheel) {
        Object.keys(evaluation.emotionWheel).forEach(key => allEmotionKeys.add(key));
      }
    });

    allEmotionKeys.forEach(key => {
      const values = emotionEvaluations
        .map(evaluation => evaluation.emotionWheel?.[key])
        .filter(val => val !== undefined) as number[];
      
      if (values.length > 0) {
        emotionTrends[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });
  }

  // Common themes from comments
  const comments = userEvaluations
    .map(evaluation => evaluation.comments)
    .filter(comment => comment && comment.trim().length > 0) as string[];
  
  const commonThemes = extractThemes(comments);

  // Visit patterns
  const visitDates = studyVisits.map(v => new Date(v.visitDate)).sort();
  const averageTimeBetweenVisits = visitDates.length > 1 
    ? visitDates.slice(1).reduce((sum, date, index) => {
        return sum + (date.getTime() - visitDates[index].getTime());
      }, 0) / (visitDates.length - 1) / (1000 * 60 * 60 * 24) // Convert to days
    : 0;

  const siteFrequency: Record<string, number> = {};
  studyVisits.forEach(visit => {
    siteFrequency[visit.destinationSite] = (siteFrequency[visit.destinationSite] || 0) + 1;
  });
  
  const preferredSites = Object.entries(siteFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([site]) => site);

  // Calculate insights
  const totalPossibleEvaluations = studyVisits.length * 3;
  const completionRate = totalPossibleEvaluations > 0 
    ? userEvaluations.length / totalPossibleEvaluations 
    : 0;

  const engagementLevel: 'low' | 'medium' | 'high' = 
    completionRate >= 0.8 ? 'high' :
    completionRate >= 0.5 ? 'medium' : 'low';

  // Personality alignment based on UEQS scores and personality type
  const personalityAlignment = calculatePersonalityAlignment(participant.acuxPersonality, averageUEQS);
  
  const recommendationScore = Math.min(100, 
    (completionRate * 40) + 
    (personalityAlignment * 30) + 
    (studyVisits.length * 10) + 
    (Object.keys(emotionTrends).length * 5)
  );

  return {
    participant: {
      id: participant.id,
      enrolledAt: participant.enrolledAt,
      personality: participant.acuxPersonality,
      totalVisits: studyVisits.length,
      completedEvaluations: userEvaluations.length,
      completionRate: Math.round(completionRate * 100)
    },
    evaluationData: {
      phaseBreakdown,
      averageUEQS,
      emotionTrends,
      commonThemes
    },
    visitPatterns: {
      preferredSites,
      visitFrequency: studyVisits.length,
      averageTimeBetweenVisits: Math.round(averageTimeBetweenVisits)
    },
    insights: {
      engagementLevel,
      personalityAlignment: Math.round(personalityAlignment),
      recommendationScore: Math.round(recommendationScore)
    }
  };
};

const extractThemes = (comments: string[]): string[] => {
  if (comments.length === 0) return [];
  
  const themeKeywords = [
    'beautiful', 'peaceful', 'crowded', 'historic', 'amazing', 
    'inspiring', 'educational', 'spiritual', 'cultural', 'impressive',
    'overwhelming', 'serene', 'magnificent', 'ancient', 'sacred'
  ];
  
  const themeCount: Record<string, number> = {};
  
  comments.forEach(comment => {
    const lowerComment = comment.toLowerCase();
    themeKeywords.forEach(keyword => {
      if (lowerComment.includes(keyword)) {
        themeCount[keyword] = (themeCount[keyword] || 0) + 1;
      }
    });
  });
  
  return Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([theme]) => theme);
};

const calculatePersonalityAlignment = (personality?: ACUXPersonality, ueqsScores?: Record<string, number>): number => {
  if (!personality || !ueqsScores || Object.keys(ueqsScores).length === 0) return 50;
  
  // Simple alignment calculation based on personality type and UEQS patterns
  const averageScore = Object.values(ueqsScores).reduce((sum, score) => sum + score, 0) / Object.values(ueqsScores).length;
  
  // Higher scores generally indicate better alignment
  return Math.min(100, Math.max(0, (averageScore - 1) * 20)); // Convert 1-7 scale to 0-100
};

export const exportStudyData = (analytics: StudyAnalytics): string => {
  const exportData = {
    exportDate: new Date().toISOString(),
    participantId: analytics.participant.id,
    summary: analytics,
    rawEvaluations: getEvaluationEntries()
  };
  
  return JSON.stringify(exportData, null, 2);
};