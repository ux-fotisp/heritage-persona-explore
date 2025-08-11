export interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits?: string[];
  likes?: string[];
  dislikes?: string[];
  icon: string; // emoji or icon name
  value: number; // 0-10
}

export interface PersonaAssessment {
  topPersonas: PersonaData[];
  allPersonas: PersonaData[];
  completedAt: string; // ISO date
}

const STORAGE_KEY = "personaAssessment";

export function savePersonaAssessment(data: PersonaAssessment): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save persona assessment", e);
  }
}

export function loadPersonaAssessment(): PersonaAssessment | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersonaAssessment;
  } catch (e) {
    console.error("Failed to load persona assessment", e);
    return null;
  }
}

export function clearPersonaAssessment(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear persona assessment", e);
  }
}
