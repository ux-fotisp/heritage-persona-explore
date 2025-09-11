import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { type UserDestination } from '@/lib/destinationStorage';
import { scheduleVisit, type ScheduledVisit } from '@/lib/visitStorage';
import { getStudyParticipant } from '@/lib/studyStorage';

interface ScheduleVisitProps {
  destinations: UserDestination[];
  onVisitScheduled: (visit: ScheduledVisit) => void;
}

export function ScheduleVisit({ destinations, onVisitScheduled }: ScheduleVisitProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [visitDate, setVisitDate] = useState<Date>();
  const { toast } = useToast();

  const handleScheduleVisit = () => {
    if (!selectedDestination) {
      toast({
        title: "No Destination Selected",
        description: "Please select a destination to visit",
        variant: "destructive"
      });
      return;
    }

    if (!visitDate) {
      toast({
        title: "No Date Selected",
        description: "Please select when you're planning to visit",
        variant: "destructive"
      });
      return;
    }

    const destination = destinations.find(dest => dest.id === selectedDestination);
    if (!destination) {
      toast({
        title: "Invalid Destination",
        description: "Please select a valid destination",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if user is enrolled in study
      const participant = getStudyParticipant();
      const studyParticipantId = participant?.consentGiven ? participant.id : undefined;
      
      const scheduledVisit = scheduleVisit(selectedDestination, destination, visitDate, studyParticipantId);
      onVisitScheduled(scheduledVisit);
      
      // Reset form
      setSelectedDestination('');
      setVisitDate(undefined);
      
      toast({
        title: "Visit Scheduled!",
        description: `Your visit to ${destination.destinationSite} has been scheduled for ${format(visitDate, 'PPP')}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule visit",
        variant: "destructive"
      });
    }
  };

  if (destinations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Add destinations first to schedule visits</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Plan Your Visit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select a destination to visit" />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination.id} value={destination.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{destination.destinationSite}</span>
                    <span className="text-sm text-muted-foreground">
                      {destination.destinationCity}, {destination.destinationCountry}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>When are you visiting?</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !visitDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {visitDate ? format(visitDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={visitDate}
                onSelect={setVisitDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleScheduleVisit} className="w-full">
          Schedule Visit
        </Button>
      </CardContent>
    </Card>
  );
}