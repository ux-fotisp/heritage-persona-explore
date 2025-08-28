export interface ScheduledVisit {
  id: string;
  destinationId: string;
  destinationCountry: string;
  destinationCity: string;
  destinationSite: string;
  visitDate: string;
  dateScheduled: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const VISITS_STORAGE_KEY = 'scheduledVisits';

export const scheduleVisit = (destinationId: string, destination: { destinationCountry: string; destinationCity: string; destinationSite: string }, visitDate: Date): ScheduledVisit => {
  const scheduledVisit: ScheduledVisit = {
    id: crypto.randomUUID(),
    destinationId,
    destinationCountry: destination.destinationCountry,
    destinationCity: destination.destinationCity,
    destinationSite: destination.destinationSite,
    visitDate: visitDate.toISOString(),
    dateScheduled: new Date().toISOString(),
    status: 'scheduled'
  };
  
  const existingVisits = getScheduledVisits();
  const updatedVisits = [...existingVisits, scheduledVisit];
  
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updatedVisits));
  return scheduledVisit;
};

export const getScheduledVisits = (): ScheduledVisit[] => {
  try {
    const stored = localStorage.getItem(VISITS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading scheduled visits:', error);
    return [];
  }
};

export const updateVisitStatus = (id: string, status: ScheduledVisit['status']): boolean => {
  const visits = getScheduledVisits();
  const index = visits.findIndex(visit => visit.id === id);
  
  if (index === -1) return false;
  
  visits[index].status = status;
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(visits));
  return true;
};

export const removeScheduledVisit = (id: string): boolean => {
  const visits = getScheduledVisits();
  const filteredVisits = visits.filter(visit => visit.id !== id);
  
  if (filteredVisits.length === visits.length) return false;
  
  localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(filteredVisits));
  return true;
};

export const getVisitsByDestination = (destinationId: string): ScheduledVisit[] => {
  return getScheduledVisits().filter(visit => visit.destinationId === destinationId);
};