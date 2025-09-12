import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppHeader } from "@/components/navigation/AppHeader";
import { MapPin, Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { createTrip } from "@/lib/tripStorage";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DESTINATIONS = [
  "Athens, Greece",
  "Rome, Italy", 
  "Paris, France",
  "London, UK",
  "Barcelona, Spain",
  "Prague, Czech Republic",
  "Istanbul, Turkey",
  "Cairo, Egypt",
  "Kyoto, Japan",
  "Cusco, Peru"
];

export default function TripCreation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [numberOfDays, setNumberOfDays] = useState([3]);
  const [startDate, setStartDate] = useState<Date>();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTrip = async () => {
    if (!tripName.trim()) {
      toast({
        title: "Trip name required",
        description: "Please enter a name for your trip",
        variant: "destructive"
      });
      return;
    }

    if (!destination) {
      toast({
        title: "Destination required", 
        description: "Please select a destination",
        variant: "destructive"
      });
      return;
    }

    if (!startDate) {
      toast({
        title: "Start date required",
        description: "Please select when your trip starts",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const endDate = addDays(startDate, numberOfDays[0] - 1);
      
      const trip = createTrip({
        name: tripName.trim(),
        destination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfDays: numberOfDays[0],
        selectedPersonas: [],
        guestMode: true // For now, all trips are guest mode
      });

      toast({
        title: "Trip created!",
        description: `${trip.name} is ready for persona selection`
      });

      // Navigate to trip persona selection
      navigate(`/trip/${trip.id}/personas`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error creating trip",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Plan Your Cultural Journey
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Create Your Trip
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Let's set up your cultural heritage adventure with personalized recommendations
            </p>
          </div>

          {/* Trip Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trip Name */}
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  placeholder="e.g., Mediterranean Heritage Tour"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 rounded-md border border-input bg-background text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a destination</option>
                  {DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Days */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Number of Days
                  </Label>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {numberOfDays[0]} {numberOfDays[0] === 1 ? 'day' : 'days'}
                  </div>
                </div>
                <Slider
                  value={numberOfDays}
                  onValueChange={setNumberOfDays}
                  max={14}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>14 days</span>
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-lg h-12",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Create Trip Button */}
          <Button
            onClick={handleCreateTrip}
            disabled={isCreating || !tripName.trim() || !destination || !startDate}
            size="lg"
            className="w-full text-lg py-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full"
          >
            {isCreating ? (
              "Creating Trip..."
            ) : (
              <>
                Create Trip & Select Personas
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          {/* Trip Summary Preview */}
          {(tripName || destination || startDate) && (
            <Card className="bg-accent/20 border-accent">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-2">Trip Preview</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {tripName && <p><strong>Name:</strong> {tripName}</p>}
                  {destination && <p><strong>Destination:</strong> {destination}</p>}
                  {startDate && (
                    <p><strong>Duration:</strong> {format(startDate, "MMM d")} - {format(addDays(startDate, numberOfDays[0] - 1), "MMM d, yyyy")} ({numberOfDays[0]} days)</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}