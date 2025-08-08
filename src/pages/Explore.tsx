import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AppHeader } from "@/components/navigation/AppHeader";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  value: number;
}

interface TripData {
  country: string;
  city: string;
  dateFrom: string;
  dateTo: string;
  travelers: string;
  personas: PersonaData[];
}

interface HeritageSite {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  duration: string;
  coordinates: [number, number];
  image: string;
  matchScore: number;
  isPersonaMatch: boolean;
  personas: string[];
  country: string;
  city: string;
}

import { HERITAGE_SITES } from "@/data/heritageSites";

const generateRecommendations = (tripData: TripData): HeritageSite[] => {
  const userPersonaIds = tripData.personas.map((p) => p.id);

  const filtered = HERITAGE_SITES.filter((s) =>
    s.country === tripData.country && (!tripData.city || s.city === tripData.city)
  );

  const scored: HeritageSite[] = filtered.map((s) => {
    const overlap = s.personas.filter((pid) => userPersonaIds.includes(pid)).length;
    const isPersonaMatch = overlap > 0;
    const base = isPersonaMatch ? 70 : 50;
    const cityBoost = s.city === tripData.city ? 20 : 0;
    const matchScore = Math.min(99, base + overlap * 8 + cityBoost);
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      rating: s.rating,
      duration: s.duration,
      coordinates: s.coordinates,
      image: s.image,
      matchScore,
      isPersonaMatch,
      personas: s.personas,
      country: s.country,
      city: s.city,
    } as HeritageSite;
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
};

export default function Explore() {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [recommendations, setRecommendations] = useState<HeritageSite[]>([]);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    // Check for trip data and personas
    const storedTrip = localStorage.getItem('currentTrip');
    const storedPersonas = localStorage.getItem('selectedPersonas');
    
    if (!storedTrip || !storedPersonas) {
      toast.error("Please complete your trip planning first");
      navigate("/planner");
      return;
    }

    try {
      const trip = JSON.parse(storedTrip);
      const personas = JSON.parse(storedPersonas);
      
      if (!personas || personas.length === 0) {
        toast.error("Please complete your travel persona first");
        navigate("/onboarding");
        return;
      }

      trip.personas = personas;
      setTripData(trip);
      setRecommendations(generateRecommendations(trip));
    } catch (error) {
      console.error('Error parsing stored data:', error);
      navigate("/planner");
    }
  }, [navigate]);

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });
      
      const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
      setUserLocation(coords);
      setLocationPermissionGranted(true);
      toast.success("Location accessed successfully!");
    } catch (error) {
      console.error('Geolocation error:', error);
      toast.error("Location access denied or unavailable");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !recommendations.length) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE'; // TODO: Provide your Mapbox public token

    const mapCenter = userLocation || recommendations[0]?.coordinates || [23.7275, 37.9755];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: mapCenter,
      zoom: userLocation ? 14 : 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if available
    if (userLocation) {
      const userMarker = document.createElement('div');
      userMarker.className = 'user-location-marker';
      userMarker.style.width = '20px';
      userMarker.style.height = '20px';
      userMarker.style.borderRadius = '50%';
      userMarker.style.backgroundColor = '#ef4444';
      userMarker.style.border = '3px solid white';
      userMarker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      userMarker.style.position = 'relative';
      
      // Add pulsing animation
      const pulse = document.createElement('div');
      pulse.style.position = 'absolute';
      pulse.style.top = '-10px';
      pulse.style.left = '-10px';
      pulse.style.width = '40px';
      pulse.style.height = '40px';
      pulse.style.borderRadius = '50%';
      pulse.style.backgroundColor = '#ef4444';
      pulse.style.opacity = '0.3';
      pulse.style.animation = 'pulse 2s infinite';
      userMarker.appendChild(pulse);

      new mapboxgl.Marker(userMarker)
        .setLngLat(userLocation)
        .addTo(map.current!);
    }

    // Add markers for each site
    recommendations.forEach((site) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      
      if (site.isPersonaMatch) {
        el.style.backgroundColor = '#3b82f6'; // Primary blue for matches
        el.style.transform = 'scale(1.2)';
      } else {
        el.style.backgroundColor = '#9ca3af'; // Gray for non-matches
        el.style.opacity = '0.6';
      }

      // Add marker click event
      el.addEventListener('click', () => {
        setSelectedSite(site);
        setActiveTab("list");
      });

      new mapboxgl.Marker(el)
        .setLngLat(site.coordinates)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [recommendations, userLocation]);

  const handleAddToFavorites = (siteId: string) => {
    toast.success("Added to favorites!");
  };

  const handleGetDirections = (site: HeritageSite) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${site.coordinates[1]},${site.coordinates[0]}`;
    window.open(url, "_blank");
  };

  const scheduleUEQSReminders = (site: HeritageSite) => {
    const trip = tripData;
    if (!trip) return;
    const whenStr = (d: Date) => d.toLocaleString();

    const start = new Date(trip.dateFrom);
    const after = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const after24 = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    const reminders = JSON.parse(localStorage.getItem("ueqsReminders") || "[]");
    const toAdd = [
      {
        id: `${site.id}-before`,
        title: `Before visiting ${site.name}`,
        message: "Share your expectations (UEQ-S)",
        when: whenStr(start),
      },
      {
        id: `${site.id}-after`,
        title: `Right after ${site.name}`,
        message: "Rate your experience (UEQ-S)",
        when: whenStr(after),
      },
      {
        id: `${site.id}-24h`,
        title: `24h after ${site.name}`,
        message: "Reflect on your visit (UEQ-S)",
        when: whenStr(after24),
      },
    ];
    const merged = [...reminders.filter((r: any) => !r.id.startsWith(site.id)), ...toAdd];
    localStorage.setItem("ueqsReminders", JSON.stringify(merged));
    toast.success("UEQ-S reminders scheduled (in-app)");
  };

  if (!tripData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader backPath="/planner" />

      <div className="flex-1 flex flex-col pb-16">
        {/* Trip Info Header */}
        <div className="px-4 py-4 bg-card border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {tripData.city}, {tripData.country}
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date(tripData.dateFrom).toLocaleDateString()} - {new Date(tripData.dateTo).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{recommendations.length} sites</p>
              <p className="text-xs text-muted-foreground">
                {recommendations.filter(s => s.isPersonaMatch).length} persona matches
              </p>
            </div>
          </div>
        </div>

        {/* Map and List Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 mb-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex-1 mt-0">
            <div className="relative h-full">
              <div ref={mapContainer} className="absolute inset-0" />
              
              {/* Location Permission Button */}
              {!locationPermissionGranted && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    onClick={requestLocationPermission}
                    disabled={locationLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  >
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {locationLoading ? "Getting Location..." : "Use My Location"}
                  </Button>
                </div>
              )}
              
              {/* Map Legend */}
              <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                    <span>Matches your persona</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-muted border-2 border-white opacity-60"></div>
                    <span>Other heritage sites</span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                      <span>Your location</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="flex-1 mt-0 px-4 space-y-4 overflow-y-auto">
            {recommendations.map((site) => (
              <Card 
                key={site.id} 
                className={cn(
                  "transition-all duration-300 cursor-pointer hover:shadow-lg",
                  site.isPersonaMatch && "ring-2 ring-primary/20 border-primary/30",
                  selectedSite?.id === site.id && "ring-2 ring-primary border-primary"
                )}
                onClick={() => setSelectedSite(site)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{site.name}</CardTitle>
                        {site.isPersonaMatch && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {site.matchScore}% match
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {site.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFavorites(site.id);
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4">
                    {site.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{site.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{site.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(site);
                        }}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          scheduleUEQSReminders(site);
                        }}
                      >
                        Schedule UEQ-S
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/rate/${site.id}?timeframe=before`);
                        }}
                      >
                        Rate experience
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}