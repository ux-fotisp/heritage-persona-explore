import { StudyAnalytics } from './studyAnalytics';
import { HERITAGE_SITES } from '@/data/heritageSites';

export interface PersonalizedRecommendation {
  id: string;
  siteId: string;
  title: string;
  description: string;
  reason: string;
  confidence: number;
  tags: string[];
  estimatedExperience: {
    duration: string;
    bestTime: string;
    crowdLevel: 'low' | 'medium' | 'high';
  };
}

export const generatePersonalizedRecommendations = (analytics: StudyAnalytics): PersonalizedRecommendation[] => {
  const recommendations: PersonalizedRecommendation[] = [];
  
  // Get user's personality type and preferences
  const personality = analytics.participant.personality;
  const visitedSites = analytics.visitPatterns.preferredSites;
  const emotionTrends = analytics.evaluationData.emotionTrends;
  const ueqsScores = analytics.evaluationData.averageUEQS;
  
  // Filter out already visited sites
  const unvisitedSites = HERITAGE_SITES.filter(site => 
    !visitedSites.includes(site.name)
  );
  
  unvisitedSites.forEach(site => {
    const recommendation = createRecommendation(site, analytics);
    if (recommendation.confidence >= 50) {
      recommendations.push(recommendation);
    }
  });
  
  // Sort by confidence and return top 5
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
};

const createRecommendation = (site: any, analytics: StudyAnalytics): PersonalizedRecommendation => {
  const personality = analytics.participant.personality;
  const emotionTrends = analytics.evaluationData.emotionTrends;
  const ueqsScores = analytics.evaluationData.averageUEQS;
  const themes = analytics.evaluationData.commonThemes;
  
  let confidence = 60; // Base confidence
  let reason = '';
  const tags: string[] = [];
  
  // Personality-based recommendations
  if (personality) {
    switch (personality.dominantType) {
      case 'aesthetic':
        if (site.category === 'architecture' || site.category === 'art') {
          confidence += 20;
          reason = 'Matches your aesthetic appreciation style';
          tags.push('visually stunning');
        }
        break;
        
      case 'cognitive':
        if (site.category === 'historical' || site.category === 'museum') {
          confidence += 20;
          reason = 'Rich in historical and educational content';
          tags.push('educational');
        }
        break;
        
      case 'behavioral':
        if (site.category === 'interactive' || site.category === 'cultural') {
          confidence += 20;
          reason = 'Offers hands-on cultural experiences';
          tags.push('interactive');
        }
        break;
        
      case 'affective':
        if (site.category === 'spiritual' || site.category === 'memorial') {
          confidence += 20;
          reason = 'Provides meaningful emotional connections';
          tags.push('moving experience');
        }
        break;
    }
  }
  
  // Emotion-based recommendations
  if (Object.keys(emotionTrends).length > 0) {
    const topEmotions = Object.entries(emotionTrends)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
    
    topEmotions.forEach(([emotion, intensity]) => {
      if (intensity > 4) { // Strong emotional response
        if (emotion.includes('peaceful') || emotion.includes('serene')) {
          if (site.category === 'nature' || site.category === 'garden') {
            confidence += 15;
            reason = reason || 'Aligns with your preference for peaceful environments';
            tags.push('tranquil');
          }
        }
        
        if (emotion.includes('inspiring') || emotion.includes('amazed')) {
          if (site.category === 'monument' || site.category === 'architecture') {
            confidence += 15;
            reason = reason || 'Likely to inspire and amaze you';
            tags.push('inspiring');
          }
        }
      }
    });
  }
  
  // UEQ-S score based recommendations
  if (Object.keys(ueqsScores).length > 0) {
    const avgScore = Object.values(ueqsScores).reduce((sum, score) => sum + score, 0) / Object.values(ueqsScores).length;
    
    if (avgScore > 5) { // High satisfaction
      confidence += 10;
      tags.push('high quality experience');
    }
  }
  
  // Theme-based recommendations
  themes.forEach(theme => {
    if (theme === 'beautiful' && site.category === 'architecture') {
      confidence += 10;
      tags.push('beautiful');
    }
    if (theme === 'peaceful' && site.category === 'nature') {
      confidence += 10;
      tags.push('peaceful');
    }
    if (theme === 'historic' && site.category === 'historical') {
      confidence += 10;
      tags.push('historic significance');
    }
  });
  
  // Estimate experience details
  const estimatedExperience = estimateVisitExperience(site, analytics);
  
  return {
    id: `rec-${site.id}-${Date.now()}`,
    siteId: site.id,
    title: site.name,
    description: site.description || `Discover this ${site.category} heritage site`,
    reason: reason || 'Based on your cultural preferences and visit patterns',
    confidence: Math.min(100, confidence),
    tags: [...new Set(tags)], // Remove duplicates
    estimatedExperience
  };
};

const estimateVisitExperience = (site: any, analytics: StudyAnalytics): PersonalizedRecommendation['estimatedExperience'] => {
  // Simple estimation based on site type and user patterns
  const avgTimeBetween = analytics.visitPatterns.averageTimeBetweenVisits;
  
  let duration = '2-3 hours';
  let bestTime = 'Morning';
  let crowdLevel: 'low' | 'medium' | 'high' = 'medium';
  
  // Adjust based on site category
  switch (site.category) {
    case 'museum':
      duration = '3-4 hours';
      bestTime = 'Afternoon';
      crowdLevel = 'medium';
      break;
    case 'nature':
    case 'garden':
      duration = '1-2 hours';
      bestTime = 'Early morning';
      crowdLevel = 'low';
      break;
    case 'monument':
    case 'architecture':
      duration = '1-2 hours';
      bestTime = 'Golden hour';
      crowdLevel = 'high';
      break;
    case 'spiritual':
      duration = '1-3 hours';
      bestTime = 'Morning';
      crowdLevel = 'low';
      break;
  }
  
  // Adjust based on user patterns
  if (avgTimeBetween > 30) { // User takes time between visits
    crowdLevel = 'low'; // Suggest less crowded times
  }
  
  return { duration, bestTime, crowdLevel };
};