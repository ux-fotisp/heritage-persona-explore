// Cookie-based storage utilities for persona data
import { PersonaData, PersonaAssessment } from './personaStorage';
import { hasCookieConsent } from '@/components/ui/cookie-notice';

const PERSONA_COOKIE_KEY = 'ccim_user_persona';
const ASSESSMENT_COOKIE_KEY = 'ccim_persona_assessment';
const COOKIE_EXPIRY_DAYS = 365; // 1 year

// Utility functions for cookie management
const setCookie = (name: string, value: string, days: number = COOKIE_EXPIRY_DAYS): void => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Persona cookie storage functions
export const savePersonaToCookie = (persona: PersonaData): boolean => {
  // Check cookie consent before saving
  if (!hasCookieConsent()) {
    console.log('Cookie consent not given, saving to localStorage as fallback');
    try {
      localStorage.setItem('userPersona', JSON.stringify({
        ...persona,
        completedAt: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Error saving persona to localStorage:', error);
      return false;
    }
  }

  try {
    const personaWithTimestamp = {
      ...persona,
      completedAt: new Date().toISOString()
    };
    
    const personaJson = JSON.stringify(personaWithTimestamp);
    setCookie(PERSONA_COOKIE_KEY, personaJson);
    console.log('Persona saved to cookie successfully:', personaWithTimestamp);
    return true;
  } catch (error) {
    console.error('Error saving persona to cookie:', error);
    return false;
  }
};

export const getPersonaFromCookie = (): PersonaData | null => {
  try {
    const stored = getCookie(PERSONA_COOKIE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error loading persona from cookie:', error);
    return null;
  }
};

export const clearPersonaCookie = (): void => {
  try {
    deleteCookie(PERSONA_COOKIE_KEY);
    console.log('Persona cookie cleared successfully');
  } catch (error) {
    console.error('Error clearing persona cookie:', error);
  }
};

export const savePersonaAssessmentToCookie = (assessment: PersonaAssessment): boolean => {
  // Check cookie consent before saving
  if (!hasCookieConsent()) {
    console.log('Cookie consent not given, saving to localStorage as fallback');
    try {
      localStorage.setItem('personaAssessment', JSON.stringify(assessment));
      if (assessment.topPersonas.length > 0) {
        savePersonaToCookie(assessment.topPersonas[0]);
      }
      return true;
    } catch (error) {
      console.error('Error saving persona assessment to localStorage:', error);
      return false;
    }
  }

  try {
    const assessmentJson = JSON.stringify(assessment);
    setCookie(ASSESSMENT_COOKIE_KEY, assessmentJson);
    
    // Also save the main persona for easy access
    if (assessment.topPersonas.length > 0) {
      savePersonaToCookie(assessment.topPersonas[0]);
    }
    
    console.log('Persona assessment saved to cookie successfully');
    return true;
  } catch (error) {
    console.error('Error saving persona assessment to cookie:', error);
    return false;
  }
};

export const getPersonaAssessmentFromCookie = (): PersonaAssessment | null => {
  try {
    const stored = getCookie(ASSESSMENT_COOKIE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error loading persona assessment from cookie:', error);
    return null;
  }
};

export const clearPersonaAssessmentCookie = (): void => {
  try {
    deleteCookie(ASSESSMENT_COOKIE_KEY);
    clearPersonaCookie();
    console.log('Persona assessment cookie cleared successfully');
  } catch (error) {
    console.error('Error clearing persona assessment cookie:', error);
  }
};

// Migration function to move data from localStorage to cookies
export const migratePersonaToCookies = (): boolean => {
  try {
    // Check if we have data in localStorage
    const localStoragePersona = localStorage.getItem('userPersona');
    const localStorageAssessment = localStorage.getItem('personaAssessment');
    
    let migrated = false;
    
    if (localStoragePersona && !getCookie(PERSONA_COOKIE_KEY)) {
      const persona = JSON.parse(localStoragePersona);
      savePersonaToCookie(persona);
      migrated = true;
    }
    
    if (localStorageAssessment && !getCookie(ASSESSMENT_COOKIE_KEY)) {
      const assessment = JSON.parse(localStorageAssessment);
      savePersonaAssessmentToCookie(assessment);
      migrated = true;
    }
    
    // Clean up localStorage after migration
    if (migrated) {
      localStorage.removeItem('userPersona');
      localStorage.removeItem('personaAssessment');
      console.log('Successfully migrated persona data from localStorage to cookies');
    }
    
    return migrated;
  } catch (error) {
    console.error('Error migrating persona data to cookies:', error);
    return false;
  }
};