export interface EvaluationQuestion {
  id: string;
  text: string;
  type: 'feeling' | 'behavior';
  placeholder?: string;
}

export interface EmotionWheelData {
  [emotionPair: string]: number; // -5 to +5 for each emotion pair
}

export interface UEQSResponse {
  [itemId: string]: number; // 1-7 scale
}

export interface EvaluationEntry {
  id: string;
  visitId: string;
  siteId: string;
  phase: 'pre-visit' | 'post-visit' | '24h-after';
  questionResponses: {
    feeling: string;
    behavior: string;
  };
  emotionWheel?: EmotionWheelData;
  ueqsResponses?: UEQSResponse;
  comments?: string;
  createdAt: string;
}

// Universal questions for all cultural heritage sites - Micro-Diary Studies
export const PHASE_QUESTIONS: Record<string, EvaluationQuestion[]> = {
  'pre-visit': [
    {
      id: 'behavior',
      type: 'behavior',
      text: 'Can you walk us through what you did before your visit to the site? What influenced your decision? How did you arrive at this action?',
      placeholder: 'Describe the steps, research, or influences that led to your visit...'
    },
    {
      id: 'feeling',
      type: 'feeling',
      text: 'What was on your mind/heart before the visit?',
      placeholder: 'Share your thoughts, emotions, and expectations...'
    }
  ],
  'post-visit': [
    {
      id: 'behavior',
      type: 'behavior',
      text: 'Can you describe a memorable event during your visit that you remember clearly? What happened?',
      placeholder: 'Share a specific moment, interaction, or experience that stood out...'
    },
    {
      id: 'feeling',
      type: 'feeling',
      text: 'After leaving the site, what thoughts or impressions stayed with you?',
      placeholder: 'Describe the lasting emotional impact or thoughts...'
    }
  ],
  '24h-after': [
    {
      id: 'behavior',
      type: 'behavior',
      text: 'Since your last diary, have you done anything related to the experience (e.g., talked about it, given more thought)? If so, what stood out in your mind?',
      placeholder: 'Share any conversations, reflections, or actions related to your visit...'
    },
    {
      id: 'feeling',
      type: 'feeling',
      text: 'Thinking back over these events, what stands out most for you?',
      placeholder: 'Reflect on the most significant aspects of your experience...'
    }
  ]
};

// Geneva Emotion Wheel - Bipolar scales from -5 to +5
export const GENEVA_EMOTION_WHEEL = [
  { negative: 'Hate', positive: 'Love', color: 'hsl(var(--coral))' },
  { negative: 'Anger', positive: 'Admiration', color: 'hsl(var(--destructive))' },
  { negative: 'Fear', positive: 'Belief', color: 'hsl(var(--terracotta))' },
  { negative: 'Disgust', positive: 'Pleasure', color: 'hsl(var(--olive))' },
  { negative: 'Shame', positive: 'Pride', color: 'hsl(var(--warning))' },
  { negative: 'Guilt', positive: 'Compassion', color: 'hsl(var(--sage))' },
  { negative: 'Sadness', positive: 'Joy', color: 'hsl(var(--success))' },
  { negative: 'Regret', positive: 'Contentment', color: 'hsl(var(--parchment))' },
  { negative: 'Contempt', positive: 'Respect', color: 'hsl(var(--primary))' },
  { negative: 'Anxiety', positive: 'Interest', color: 'hsl(var(--accent))' }
];

const EVALUATIONS_STORAGE_KEY = 'evaluationEntries';

export const saveEvaluationEntry = (entry: EvaluationEntry): boolean => {
  try {
    const existing = getEvaluationEntries();
    const updated = [...existing, entry];
    localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving evaluation entry:', error);
    return false;
  }
};

export const getEvaluationEntries = (): EvaluationEntry[] => {
  try {
    const stored = localStorage.getItem(EVALUATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading evaluation entries:', error);
    return [];
  }
};

export const getEvaluationsByVisit = (visitId: string): EvaluationEntry[] => {
  return getEvaluationEntries().filter(entry => entry.visitId === visitId);
};

export const getEvaluationByPhase = (visitId: string, phase: EvaluationEntry['phase']): EvaluationEntry | null => {
  const entries = getEvaluationsByVisit(visitId);
  return entries.find(entry => entry.phase === phase) || null;
};

export const hasCompletedPhase = (visitId: string, phase: EvaluationEntry['phase']): boolean => {
  return getEvaluationByPhase(visitId, phase) !== null;
};