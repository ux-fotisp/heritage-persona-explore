import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Plus, Check, Loader2 } from "lucide-react";
import { getAllTrips, addSiteToTrip, isSiteInTrip, Trip } from "@/lib/tripStorage";
import { HERITAGE_SITES } from "@/data/heritageSites";
import { toast } from "sonner";
import { format } from "date-fns";

interface AddToTripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  siteName?: string;
}

export function AddToTripModal({ open, onOpenChange, siteId, siteName }: AddToTripModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const trips = getAllTrips();
  
  // Get site info
  const site = HERITAGE_SITES.find(s => s.id === siteId);
  const displayName = siteName || site?.name || "this site";

  const handleAddToTrip = async (tripId: string) => {
    setLoading(tripId);
    
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const success = addSiteToTrip(tripId, siteId);
    
    if (success) {
      const trip = trips.find(t => t.id === tripId);
      toast.success(`Added to ${trip?.name || "trip"}`, {
        description: `${displayName} has been added to your itinerary`,
        action: {
          label: "View Trip",
          onClick: () => navigate("/trip-creation", { state: { tripId } })
        }
      });
      onOpenChange(false);
    } else {
      toast.error("Site already in trip", {
        description: `${displayName} is already part of this trip`
      });
    }
    
    setLoading(null);
  };

  const handleCreateNewTrip = () => {
    onOpenChange(false);
    navigate("/trip-creation", { state: { preSelectedSiteId: siteId } });
  };

  const formatTripDates = (trip: Trip) => {
    try {
      const start = format(new Date(trip.startDate), "MMM d");
      const end = format(new Date(trip.endDate), "MMM d, yyyy");
      return `${start} - ${end}`;
    } catch {
      return `${trip.numberOfDays} days`;
    }
  };

  const getSiteCount = (trip: Trip) => {
    return trip.selectedSites?.length || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Trip</DialogTitle>
          <DialogDescription>
            Choose a trip to add <span className="font-medium text-foreground">{displayName}</span> to your itinerary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {trips.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="text-4xl">🗺️</div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">No trips yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first trip to start adding sites
                </p>
              </div>
              <Button onClick={handleCreateNewTrip} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            </div>
          ) : (
            <>
              {/* Existing Trips */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {trips.map((trip) => {
                  const alreadyInTrip = isSiteInTrip(trip.id, siteId);
                  const siteCount = getSiteCount(trip);
                  
                  return (
                    <Card
                      key={trip.id}
                      className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                        alreadyInTrip 
                          ? "bg-sage/10 border-sage/30" 
                          : "hover:border-primary/30"
                      }`}
                      onClick={() => !alreadyInTrip && !loading && handleAddToTrip(trip.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground truncate">
                              {trip.name}
                            </h4>
                            {alreadyInTrip && (
                              <Badge variant="secondary" className="bg-sage/20 text-sage text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Added
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{trip.destination}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatTripDates(trip)}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {siteCount} {siteCount === 1 ? "site" : "sites"} added
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0">
                          {loading === trip.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          ) : alreadyInTrip ? (
                            <Check className="h-5 w-5 text-sage" />
                          ) : (
                            <Plus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Separator />

              {/* Create New Trip */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCreateNewTrip}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Trip
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
