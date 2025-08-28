export interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits?: string[];
  likes?: string[];
  dislikes?: string[];
  icon: string; // emoji or icon name
  value: number; // 0-10
  completedAt?: string; // timestamp when assessment was completed
  matchedPersonalities?: string[]; // personality types this persona matches
}

export interface PersonaAssessment {
  topPersonas: PersonaData[];
  allPersonas: PersonaData[];
  completedAt: string; // ISO date
}

const PERSONA_STORAGE_KEY = 'userPersona';
const ASSESSMENT_STORAGE_KEY = 'personaAssessment';

export const savePersona = (persona: PersonaData): void => {
  const personaWithTimestamp = {
    ...persona,
    completedAt: new Date().toISOString()
  };
  
  try {
    localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(personaWithTimestamp));
    console.log('Persona saved successfully:', personaWithTimestamp);
  } catch (error) {
    console.error('Error saving persona:', error);
    throw error;
  }
};

export const getPersona = (): PersonaData | null => {
  try {
    const stored = localStorage.getItem(PERSONA_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Fallback: check if we have assessment data and extract main persona
    const assessment = loadPersonaAssessment();
    if (assessment && assessment.topPersonas.length > 0) {
      return assessment.topPersonas[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error loading persona:', error);
    return null;
  }
};

export const clearPersona = (): void => {
  try {
    localStorage.removeItem(PERSONA_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing persona:', error);
  }
};

export function savePersonaAssessment(data: PersonaAssessment): void {
  try {
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(data));
    
    // Also save the main persona for easy access
    if (data.topPersonas.length > 0) {
      savePersona(data.topPersonas[0]);
    }
  } catch (e) {
    console.error("Failed to save persona assessment", e);
  }
}

export function loadPersonaAssessment(): PersonaAssessment | null {
  try {
    const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersonaAssessment;
  } catch (e) {
    console.error("Failed to load persona assessment", e);
    return null;
  }
}

export function clearPersonaAssessment(): void {
  try {
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    clearPersona();
  } catch (e) {
    console.error("Failed to clear persona assessment", e);
  }
}
