export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  selectedPersonas: string[]; // persona IDs
  status: 'planning' | 'active' | 'completed';
  createdAt: string;
  guestMode: boolean;
  selectedSites?: string[]; // site IDs
  itinerary?: ItineraryDay[];
}

export interface ItineraryDay {
  date: string;
  sites: ScheduledSite[];
  travelTime: number;
  freeTime: number;
}

export interface ScheduledSite {
  siteId: string;
  startTime: string;
  endTime: string;
  estimatedDuration: number; // in hours
  transportTime?: number; // time to reach this site
}

const TRIP_STORAGE_KEY = 'culturalTrips';
const CURRENT_TRIP_KEY = 'currentTrip';

export const saveTrip = (trip: Trip): void => {
  try {
    const trips = getAllTrips();
    const existingIndex = trips.findIndex(t => t.id === trip.id);
    
    if (existingIndex >= 0) {
      trips[existingIndex] = trip;
    } else {
      trips.push(trip);
    }
    
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trips));
    console.log('Trip saved successfully:', trip);
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

export const getAllTrips = (): Trip[] => {
  try {
    const stored = localStorage.getItem(TRIP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading trips:', error);
    return [];
  }
};

export const getTripById = (id: string): Trip | null => {
  try {
    const trips = getAllTrips();
    return trips.find(trip => trip.id === id) || null;
  } catch (error) {
    console.error('Error loading trip:', error);
    return null;
  }
};

export const setCurrentTrip = (tripId: string): void => {
  try {
    localStorage.setItem(CURRENT_TRIP_KEY, tripId);
  } catch (error) {
    console.error('Error setting current trip:', error);
  }
};

export const getCurrentTrip = (): Trip | null => {
  try {
    const currentTripId = localStorage.getItem(CURRENT_TRIP_KEY);
    if (!currentTripId) return null;
    
    return getTripById(currentTripId);
  } catch (error) {
    console.error('Error getting current trip:', error);
    return null;
  }
};

export const createTrip = (tripData: Omit<Trip, 'id' | 'createdAt' | 'status'>): Trip => {
  const trip: Trip = {
    id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'planning',
    ...tripData
  };
  
  saveTrip(trip);
  setCurrentTrip(trip.id);
  return trip;
};

export const updateTripStatus = (tripId: string, status: Trip['status']): boolean => {
  try {
    const trip = getTripById(tripId);
    if (!trip) return false;
    
    trip.status = status;
    saveTrip(trip);
    return true;
  } catch (error) {
    console.error('Error updating trip status:', error);
    return false;
  }
};

export const deleteTrip = (tripId: string): boolean => {
  try {
    const trips = getAllTrips();
    const filteredTrips = trips.filter(trip => trip.id !== tripId);
    
    localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(filteredTrips));
    
    // Clear current trip if it was deleted
    const currentTripId = localStorage.getItem(CURRENT_TRIP_KEY);
    if (currentTripId === tripId) {
      localStorage.removeItem(CURRENT_TRIP_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
};

export const clearAllTrips = (): void => {
  try {
    localStorage.removeItem(TRIP_STORAGE_KEY);
    localStorage.removeItem(CURRENT_TRIP_KEY);
  } catch (error) {
    console.error('Error clearing trips:', error);
  }
};

// Site management functions
export const addSiteToTrip = (tripId: string, siteId: string): boolean => {
  try {
    const trip = getTripById(tripId);
    if (!trip) return false;
    
    // Initialize selectedSites if not exists
    if (!trip.selectedSites) {
      trip.selectedSites = [];
    }
    
    // Check if site already exists
    if (trip.selectedSites.includes(siteId)) {
      return false;
    }
    
    trip.selectedSites.push(siteId);
    saveTrip(trip);
    return true;
  } catch (error) {
    console.error('Error adding site to trip:', error);
    return false;
  }
};

export const removeSiteFromTrip = (tripId: string, siteId: string): boolean => {
  try {
    const trip = getTripById(tripId);
    if (!trip || !trip.selectedSites) return false;
    
    const index = trip.selectedSites.indexOf(siteId);
    if (index === -1) return false;
    
    trip.selectedSites.splice(index, 1);
    saveTrip(trip);
    return true;
  } catch (error) {
    console.error('Error removing site from trip:', error);
    return false;
  }
};

export const isSiteInTrip = (tripId: string, siteId: string): boolean => {
  try {
    const trip = getTripById(tripId);
    if (!trip || !trip.selectedSites) return false;
    
    return trip.selectedSites.includes(siteId);
  } catch (error) {
    console.error('Error checking site in trip:', error);
    return false;
  }
};

export const getSiteCountForTrip = (tripId: string): number => {
  try {
    const trip = getTripById(tripId);
    if (!trip || !trip.selectedSites) return 0;
    
    return trip.selectedSites.length;
  } catch (error) {
    console.error('Error getting site count:', error);
    return 0;
  }
};