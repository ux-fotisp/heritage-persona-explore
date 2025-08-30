export interface EvaluationQuestion {
  id: string;
  text: string;
  type: 'feeling' | 'behavior';
  placeholder?: string;
}

export interface EmotionWheelData {
  emotion: string;
  intensity: number; // 1-10
  opposingEmotion: string;
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

// Universal questions for all cultural heritage sites
export const PHASE_QUESTIONS: Record<string, EvaluationQuestion[]> = {
  'pre-visit': [
    {
      id: 'feeling',
      type: 'feeling',
      text: 'How do you feel about visiting this place?',
      placeholder: 'Describe your emotions and expectations...'
    },
    {
      id: 'behavior',
      type: 'behavior',
      text: 'What do you plan to do or experience here?',
      placeholder: 'Describe how you plan to engage with this site...'
    }
  ],
  'post-visit': [
    {
      id: 'feeling',
      type: 'feeling',
      text: 'How did this place make you feel?',
      placeholder: 'Describe the emotions this visit evoked...'
    },
    {
      id: 'behavior',
      type: 'behavior',
      text: 'How did you interact with this place?',
      placeholder: 'Describe what you did, touched, experienced...'
    }
  ],
  '24h-after': [
    {
      id: 'feeling',
      type: 'feeling',
      text: 'Reflecting on your visit, how do you feel now?',
      placeholder: 'Describe how the experience affects you now...'
    },
    {
      id: 'behavior',
      type: 'behavior',
      text: 'What memories or actions from your visit stand out?',
      placeholder: 'Describe the most memorable interactions or moments...'
    }
  ]
};

// Emotion wheel with opposing pairs
export const EMOTION_WHEEL = [
  { emotion: 'Joy', opposing: 'Sadness', color: 'hsl(var(--warning))' },
  { emotion: 'Trust', opposing: 'Disgust', color: 'hsl(var(--success))' },
  { emotion: 'Fear', opposing: 'Anger', color: 'hsl(var(--destructive))' },
  { emotion: 'Surprise', opposing: 'Anticipation', color: 'hsl(var(--coral))' },
  { emotion: 'Sadness', opposing: 'Joy', color: 'hsl(var(--muted))' },
  { emotion: 'Disgust', opposing: 'Trust', color: 'hsl(var(--accent))' },
  { emotion: 'Anger', opposing: 'Fear', color: 'hsl(var(--destructive))' },
  { emotion: 'Anticipation', opposing: 'Surprise', color: 'hsl(var(--primary))' }
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