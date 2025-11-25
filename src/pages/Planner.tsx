import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteCard } from "@/components/heritage/SiteCard";
import { PersonaRecommendations } from "@/components/planner/PersonaRecommendations";
import { AppHeader } from "@/components/navigation/AppHeader";
import { HERITAGE_SITES } from "@/data/heritageSites";
import { Search, MapPin, Filter, Map, List, Navigation, Heart, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Planner() {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [browseView, setBrowseView] = useState<"grid" | "map">("grid");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedSite, setSelectedSite] = useState<typeof HERITAGE_SITES[0] | null>(null);

  // Get unique categories and countries for filters
  const categories = Array.from(new Set(HERITAGE_SITES.map(site => site.category)));
  const countries = Array.from(new Set(HERITAGE_SITES.map(site => site.country)));

  // Filter sites based on search and filters
  const filteredSites = HERITAGE_SITES.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || site.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || site.country === selectedCountry;
    
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const handleAddSite = (siteId: string) => {
    const existing: string[] = JSON.parse(localStorage.getItem("plannedSites") || "[]");
    const merged = Array.from(new Set([...existing, siteId]));
    localStorage.setItem("plannedSites", JSON.stringify(merged));
    toast.success("Added to trip!");
  };

  const requestLocationPermission = async () => {
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
    }
  };

  const handleGetDirections = (site: typeof HERITAGE_SITES[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${site.coordinates[1]},${site.coordinates[0]}`;
    window.open(url, "_blank");
  };

  // Initialize map when browse view is set to map
  useEffect(() => {
    if (browseView !== "map" || !mapContainer.current || !filteredSites.length) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiY3VsdHVyYXBhdGgiLCJhIjoiY2x6ZGV4YW1wbGUifQ.example'; // Demo token

    const mapCenter = userLocation || filteredSites[0]?.coordinates || [23.7275, 37.9755];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: mapCenter,
      zoom: userLocation ? 14 : 12
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker if available
    if (userLocation) {
      const userMarker = document.createElement('div');
      userMarker.className = 'user-location-marker';
      userMarker.style.width = '20px';
      userMarker.style.height = '20px';
      userMarker.style.borderRadius = '50%';
      userMarker.style.backgroundColor = 'hsl(var(--destructive))';
      userMarker.style.border = '3px solid white';
      userMarker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      new mapboxgl.Marker(userMarker)
        .setLngLat(userLocation)
        .addTo(map.current!);
    }

    // Add markers for sites
    filteredSites.forEach((site) => {
      const el = document.createElement('div');
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.backgroundColor = 'hsl(var(--primary))';
      
      el.addEventListener('click', () => {
        setSelectedSite(site);
      });

      new mapboxgl.Marker(el)
        .setLngLat(site.coordinates)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [browseView, filteredSites, userLocation]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader showBackButton={false} title="Trip Planner" />
      
      {/* Global Search Box */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search cultural experiences, museums, sites, restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 text-base"
          />
          {searchTerm && (
            <Badge variant="secondary" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {filteredSites.length} results
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommended">For You</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-4">
            <PersonaRecommendations />
          </TabsContent>
          
          <TabsContent value="browse" className="space-y-4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Explore Heritage Sites</h2>
              <div className="flex gap-2">
                <Button
                  variant={browseView === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseView("grid")}
                >
                  <List className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={browseView === "map" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrowseView("map")}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>

            {browseView === "grid" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full p-2 border border-border rounded-md bg-background"
                        >
                          <option value="all">All Countries</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Sites Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {filteredSites.map((site) => (
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
                          matchScore={75}
                          onAddToTrip={() => handleAddSite(site.id)}
                          onRate={() => navigate(`/rate/${site.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Map View */}
                <div className="relative h-[60vh] rounded-lg overflow-hidden border border-border">
                  <div ref={mapContainer} className="absolute inset-0" />
                  
                  {/* Location Permission Button */}
                  {!locationPermissionGranted && (
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        onClick={requestLocationPermission}
                        className="shadow-lg"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Use My Location
                      </Button>
                    </div>
                  )}
                  
                  {/* Map Legend */}
                  <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                        <span>Heritage Sites</span>
                      </div>
                      {userLocation && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-destructive border-2 border-white"></div>
                          <span>Your Location</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-border">
                        <p className="font-medium">{filteredSites.length} sites</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Site Card */}
                {selectedSite && (
                  <Card className="border-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{selectedSite.name}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-2">
                            {selectedSite.category}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toast.success("Added to favorites!")}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground text-sm mb-4">
                        {selectedSite.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{selectedSite.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedSite.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGetDirections(selectedSite)}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Directions
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddSite(selectedSite.id)}
                          >
                            Add to Trip
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sites List Below Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSites.slice(0, 6).map((site) => (
                    <Card
                      key={site.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        selectedSite?.id === site.id && "ring-2 ring-primary border-primary"
                      )}
                      onClick={() => setSelectedSite(site)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{site.name}</CardTitle>
                          <Badge variant="secondary">{site.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {site.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {site.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {site.duration}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}