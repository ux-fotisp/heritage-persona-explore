import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/navigation/AppHeader";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Sparkles, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SiteCard } from "@/components/heritage/SiteCard";
import templeImg from "@/assets/heritage-temple.jpg";
import castleImg from "@/assets/heritage-castle.jpg";
import museumImg from "@/assets/heritage-museum.jpg";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  value: number;
}

import { HERITAGE_SITES } from "@/data/heritageSites";

const countries = Array.from(new Set(HERITAGE_SITES.map((s) => s.country)));

const citiesByCountry: { [key: string]: string[] } = countries.reduce((acc, country) => {
  acc[country] = Array.from(new Set(HERITAGE_SITES.filter((s) => s.country === country).map((s) => s.city))).sort();
  return acc;
}, {} as { [key: string]: string[] });

export default function Planner() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [travelerCount, setTravelerCount] = useState<string>("1");
  const [hasPersona, setHasPersona] = useState<boolean>(false);
  const [userPersonas, setUserPersonas] = useState<PersonaData[]>([]);

  useEffect(() => {
    // Check if user has selected personas in localStorage or sessionStorage
    const storedPersonas = localStorage.getItem('selectedPersonas');
    if (storedPersonas) {
      try {
        const personas = JSON.parse(storedPersonas);
        if (personas && personas.length > 0) {
          setHasPersona(true);
          setUserPersonas(personas);
        }
      } catch (error) {
        console.error('Error parsing stored personas:', error);
      }
    }
  }, []);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedCity(""); // Reset city when country changes
  };

  const handleStartJourney = () => {
    navigate("/onboarding");
  };

  const handleCreateTrip = () => {
    if (!selectedCountry || !selectedCity || !dateFrom || !dateTo) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!hasPersona) {
      toast.error("Please complete your travel persona first");
      handleStartJourney();
      return;
    }

    // Store trip data and navigate to explore
    const tripData = {
      country: selectedCountry,
      city: selectedCity,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      travelers: travelerCount,
      personas: userPersonas
    };
    
    localStorage.setItem('currentTrip', JSON.stringify(tripData));
    navigate("/explore");
  };

const availableCities = selectedCountry ? citiesByCountry[selectedCountry] || [] : [];

// Resolve demo image paths from data to imported assets
const resolveImage = (image: string) => {
  if (image.includes("temple")) return templeImg;
  if (image.includes("castle")) return castleImg;
  if (image.includes("museum")) return museumImg;
  return templeImg;
};

const personaIds = userPersonas.map((p) => p.id);

const sitesForPlanner = HERITAGE_SITES
  .filter((s) => {
    if (selectedCountry && s.country !== selectedCountry) return false;
    if (selectedCity && s.city !== selectedCity) return false;
    return true;
  })
  .map((s) => {
    const overlap = s.personas.filter((pid) => personaIds.includes(pid)).length;
    const isPersonaMatch = overlap > 0;
    const base = isPersonaMatch ? 70 : 50;
    const cityBoost = selectedCity && s.city === selectedCity ? 20 : selectedCountry && s.country === selectedCountry ? 10 : 0;
    const matchScore = Math.min(99, base + overlap * 8 + (cityBoost || 0));
    return {
      ...s,
      image: resolveImage(s.image),
      matchScore,
    } as typeof s & { matchScore: number; image: string };
  })
  .sort((a, b) => b.matchScore - a.matchScore);

const handleAddSite = (siteId: string) => {
  const existing: string[] = JSON.parse(localStorage.getItem("plannedSites") || "[]");
  const merged = Array.from(new Set([...existing, siteId]));
  localStorage.setItem("plannedSites", JSON.stringify(merged));
  toast.success("Added to your plan");
};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <div className="flex-1 px-4 py-6 pb-24">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium text-sm">Trip Planner</span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            Plan Your Cultural{" "}
            <span className="text-primary">Adventure</span>
          </h1>
          
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Create personalized heritage site recommendations based on your travel persona
          </p>
        </div>

        {/* Persona Status Card */}
        {!hasPersona ? (
          <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Complete Your Travel Persona First
                    </h3>
                    <p className="text-amber-700 dark:text-amber-200 text-sm mt-1">
                      To get personalized heritage site recommendations, you need to discover your travel style first.
                    </p>
                  </div>
                  <Button 
                    onClick={handleStartJourney}
                    variant="outline"
                    className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/30"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Your Journey
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Travel Persona Ready
                  </h3>
                  <p className="text-green-700 dark:text-green-200 text-sm">
                    Your recommendations will be based on: {userPersonas.map(p => p.title).join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trip Planning Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Destination Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select 
                  value={selectedCity} 
                  onValueChange={setSelectedCity}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Check-in Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      disabled={(date) => date < new Date() || (dateFrom && date <= dateFrom)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Traveler Count */}
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={travelerCount}
                  onChange={(e) => setTravelerCount(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  {travelerCount === "1" ? "traveler" : "travelers"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Trip Button */}
        <Button
          onClick={handleCreateTrip}
          disabled={!hasPersona || !selectedCountry || !selectedCity || !dateFrom || !dateTo}
          className="w-full py-4 text-lg font-semibold rounded-full h-auto"
          variant={hasPersona ? "default" : "secondary"}
        >
          {!hasPersona 
            ? "Complete Your Persona First" 
            : "Create My Cultural Trip"
          }
        </Button>

        {/* Browse Sites Section */}
        <section aria-labelledby="browse-heading" className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 id="browse-heading" className="text-lg font-semibold">Browse Cultural Heritage Sites</h2>
            <span className="text-sm text-muted-foreground">{sitesForPlanner.length} sites</span>
          </div>

          {!selectedCountry && (
            <p className="text-sm text-muted-foreground mb-3">
              Tip: Select a country and city to narrow the results and improve matching.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sitesForPlanner.map((site) => (
              <SiteCard
                key={site.id}
                id={site.id}
                name={site.name}
                description={site.description}
                image={site.image}
                location={`${site.city}, ${site.country}`}
                duration={site.duration}
                category={site.category}
                accessibility="High"
                rating={site.rating}
                matchScore={(site as any).matchScore ?? 50}
                onAddToTrip={() => handleAddSite(site.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}