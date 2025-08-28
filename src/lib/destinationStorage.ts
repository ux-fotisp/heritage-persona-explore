export interface UserDestination {
  id: string;
  destinationCountry: string;
  destinationCity: string;
  destinationSite: string;
  dateAdded: string;
}

const DESTINATIONS_STORAGE_KEY = 'userDestinations';

export const saveDestination = (destination: Omit<UserDestination, 'id' | 'dateAdded'>): UserDestination => {
  const newDestination: UserDestination = {
    ...destination,
    id: crypto.randomUUID(),
    dateAdded: new Date().toISOString(),
  };
  
  const existingDestinations = getUserDestinations();
  const updatedDestinations = [...existingDestinations, newDestination];
  
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(updatedDestinations));
  return newDestination;
};

export const getUserDestinations = (): UserDestination[] => {
  try {
    const stored = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading destinations:', error);
    return [];
  }
};

export const updateDestination = (id: string, updates: Partial<UserDestination>): UserDestination | null => {
  const destinations = getUserDestinations();
  const index = destinations.findIndex(dest => dest.id === id);
  
  if (index === -1) return null;
  
  const updatedDestination = { ...destinations[index], ...updates };
  destinations[index] = updatedDestination;
  
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(destinations));
  return updatedDestination;
};

export const removeDestination = (id: string): boolean => {
  const destinations = getUserDestinations();
  const filteredDestinations = destinations.filter(dest => dest.id !== id);
  
  if (filteredDestinations.length === destinations.length) return false;
  
  localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(filteredDestinations));
  return true;
};

export const clearAllDestinations = (): void => {
  localStorage.removeItem(DESTINATIONS_STORAGE_KEY);
};