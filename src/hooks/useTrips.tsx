import { useState, useEffect, useCallback } from "react";
import {
  Trip,
  getAllTrips,
  getTripById,
  getCurrentTrip,
  setCurrentTrip,
  saveTrip,
  createTrip,
  deleteTrip,
  addSiteToTrip as addSiteToTripStorage,
  removeSiteFromTrip as removeSiteFromTripStorage,
  isSiteInTrip as isSiteInTripStorage,
  getSiteCountForTrip,
} from "@/lib/tripStorage";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTripState] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  // Load trips from storage
  const loadTrips = useCallback(() => {
    setLoading(true);
    try {
      const allTrips = getAllTrips();
      setTrips(allTrips);
      
      const current = getCurrentTrip();
      setCurrentTripState(current);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Add a site to a trip
  const addSiteToTrip = useCallback((tripId: string, siteId: string): boolean => {
    const success = addSiteToTripStorage(tripId, siteId);
    if (success) {
      loadTrips(); // Refresh state
    }
    return success;
  }, [loadTrips]);

  // Remove a site from a trip
  const removeSiteFromTrip = useCallback((tripId: string, siteId: string): boolean => {
    const success = removeSiteFromTripStorage(tripId, siteId);
    if (success) {
      loadTrips(); // Refresh state
    }
    return success;
  }, [loadTrips]);

  // Check if site is in trip
  const isSiteInTrip = useCallback((tripId: string, siteId: string): boolean => {
    return isSiteInTripStorage(tripId, siteId);
  }, []);

  // Get sites for a trip
  const getSitesForTrip = useCallback((tripId: string): string[] => {
    const trip = getTripById(tripId);
    return trip?.selectedSites || [];
  }, []);

  // Get site count for a trip
  const getSiteCount = useCallback((tripId: string): number => {
    return getSiteCountForTrip(tripId);
  }, []);

  // Set active/current trip
  const setActiveTrip = useCallback((tripId: string) => {
    setCurrentTrip(tripId);
    const trip = getTripById(tripId);
    setCurrentTripState(trip);
  }, []);

  // Create a new trip
  const createNewTrip = useCallback((tripData: Omit<Trip, 'id' | 'createdAt' | 'status'>): Trip => {
    const trip = createTrip(tripData);
    loadTrips();
    return trip;
  }, [loadTrips]);

  // Delete a trip
  const removeTrip = useCallback((tripId: string): boolean => {
    const success = deleteTrip(tripId);
    if (success) {
      loadTrips();
    }
    return success;
  }, [loadTrips]);

  // Update a trip
  const updateTrip = useCallback((trip: Trip) => {
    saveTrip(trip);
    loadTrips();
  }, [loadTrips]);

  return {
    trips,
    currentTrip,
    loading,
    addSiteToTrip,
    removeSiteFromTrip,
    isSiteInTrip,
    getSitesForTrip,
    getSiteCount,
    setActiveTrip,
    createNewTrip,
    removeTrip,
    updateTrip,
    refresh: loadTrips,
  };
}
