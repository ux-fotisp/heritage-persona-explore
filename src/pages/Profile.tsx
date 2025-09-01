import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/navigation/AppHeader";
import { DestinationForm } from "@/components/profile/DestinationForm";
import { DestinationList } from "@/components/profile/DestinationList";
import { ScheduleVisit } from "@/components/profile/ScheduleVisit";
import { ScheduledVisitsList } from "@/components/profile/ScheduledVisitsList";
import { getUserDestinations, type UserDestination } from "@/lib/destinationStorage";
import { getScheduledVisits, type ScheduledVisit } from "@/lib/visitStorage";
import { MyPersonaTile } from "@/components/profile/MyPersonaTile";
import { Settings, MapPin, Calendar, Heart, Share } from "lucide-react";

export default function Profile() {
  const [userDestinations, setUserDestinations] = useState<UserDestination[]>([]);
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);

  useEffect(() => {
    setUserDestinations(getUserDestinations());
    setScheduledVisits(getScheduledVisits());
  }, []);

  const handleDestinationAdded = (destination: UserDestination) => {
    setUserDestinations(prev => [...prev, destination]);
  };

  const handleDestinationUpdated = (updatedDestination: UserDestination) => {
    setUserDestinations(prev => 
      prev.map(dest => dest.id === updatedDestination.id ? updatedDestination : dest)
    );
  };

  const handleDestinationRemoved = (id: string) => {
    setUserDestinations(prev => prev.filter(dest => dest.id !== id));
  };

  const handleVisitScheduled = (visit: ScheduledVisit) => {
    setScheduledVisits(prev => [...prev, visit]);
  };

  const handleVisitUpdated = (visitId: string, status: ScheduledVisit['status']) => {
    setScheduledVisits(prev => 
      prev.map(visit => visit.id === visitId ? { ...visit, status } : visit)
    );
  };

  const handleVisitRemoved = (visitId: string) => {
    setScheduledVisits(prev => prev.filter(visit => visit.id !== visitId));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader showBackButton={false} title="Profile" />
      <div className="p-4">

      {/* Profile Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-muted-foreground">Cultural Heritage Explorer</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Heritage Enthusiast</Badge>
                <Badge variant="secondary">Local Guide</Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Sites Visited</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Trips Planned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-red-500 mt-1" />
            <div>
              <p className="font-medium">Liked Shwedagon Pagoda</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <p className="font-medium">Visited Bagan Archaeological Zone</p>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Share className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <p className="font-medium">Shared Ancient Temple Complex</p>
              <p className="text-sm text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cultural Destinations */}
      <div className="space-y-6 mb-6">
        <DestinationForm onDestinationAdded={handleDestinationAdded} />
        <DestinationList 
          destinations={userDestinations}
          onDestinationUpdated={handleDestinationUpdated}
          onDestinationRemoved={handleDestinationRemoved}
        />
      </div>

      {/* Schedule Visits */}
      <div className="space-y-6 mb-6">
        <ScheduleVisit 
          destinations={userDestinations}
          onVisitScheduled={handleVisitScheduled}
        />
        <ScheduledVisitsList 
          visits={scheduledVisits}
          onVisitUpdated={handleVisitUpdated}
          onVisitRemoved={handleVisitRemoved}
        />
      </div>

      {/* Travel Persona */}
      <MyPersonaTile />
      </div>
    </div>
  );
}