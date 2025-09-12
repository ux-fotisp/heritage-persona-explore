import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/navigation/AppHeader";
import { SiteCard } from "@/components/heritage/SiteCard";
import { MapPin, Star, Clock, Filter, ArrowRight } from "lucide-react";
import { getTripById, saveTrip } from "@/lib/tripStorage";
import { HERITAGE_SITES } from "@/data/heritageSites";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RecommendedSite {
  id: string;
  name: string;
  category: string;
  rating: number;
  matchReason: string;
  confidence: number;
  estimatedTime: number;
}

export default function PersonaBasedRecommendations() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<RecommendedSite[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [isLoading, setIsLoading] = useState(true);

  // Persona matching keywords
  const personaKeywords: Record<string, string[]> = {
    archaeologist: ["ancient", "archaeological", "historical", "museum", "ruins", "civilization"],
    naturalist: ["natural", "park", "landscape", "garden", "mountain", "forest", "nature"],
    artist: ["architecture", "art", "design", "gallery", "creative", "palace", "cathedral"],
    spiritual: ["temple", "church", "monastery", "sacred", "religious", "spiritual", "shrine"],
    adventurer: ["adventure", "hiking", "remote", "fortress", "castle", "mountain", "cliff"],
    foodie: ["market", "culinary", "food", "traditional", "local", "cuisine", "festival"],
    historian: ["historical", "heritage", "museum", "monument", "war", "battle", "legacy"],
    social: ["festival", "cultural", "community", "event", "celebration", "gathering", "tour"]
  };

  useEffect(() => {
    if (!tripId) {
      navigate('/trip-creation');
      return;
    }

    const tripData = getTripById(tripId);
    if (!tripData) {
      toast({
        title: "Trip not found",
        description: "Please create a new trip",
        variant: "destructive"
      });
      navigate('/trip-creation');
      return;
    }

    setTrip(tripData);
    generateRecommendations(tripData);
    setIsLoading(false);
  }, [tripId, navigate, toast]);

  const generateRecommendations = (tripData: any) => {
    if (!tripData.selectedPersonas || tripData.selectedPersonas.length === 0) {
      setRecommendations([]);
      return;
    }

    // Get keywords for selected personas
    const allKeywords = tripData.selectedPersonas.flatMap((personaId: string) => 
      personaKeywords[personaId] || []
    );

    // Score sites based on persona match
    const scoredSites = HERITAGE_SITES.map(site => {
      let score = 0;
      let matchedKeywords: string[] = [];

      // Check description and category for keyword matches
      const searchText = `${site.name} ${site.description} ${site.category}`.toLowerCase();
      
      allKeywords.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      });

      // Bonus for high ratings
      score += site.rating / 2;

      // Bonus for specific persona matches
      if (tripData.selectedPersonas.includes('archaeologist') && 
          (site.category.includes('Archaeological') || site.category.includes('Historical'))) {
        score += 2;
      }
      
      if (tripData.selectedPersonas.includes('naturalist') && 
          (site.category.includes('Natural') || site.category.includes('Park'))) {
        score += 2;
      }

      if (tripData.selectedPersonas.includes('artist') && 
          (site.category.includes('Architecture') || site.category.includes('Art'))) {
        score += 2;
      }

      if (tripData.selectedPersonas.includes('spiritual') && 
          (site.category.includes('Religious') || site.category.includes('Temple'))) {
        score += 2;
      }

      const confidence = Math.min(Math.round((score / 5) * 100), 100);
      
      return {
        id: site.id,
        name: site.name,
        category: site.category,
        rating: site.rating,
        matchReason: matchedKeywords.length > 0 
          ? `Matches your interest in ${matchedKeywords.slice(0, 2).join(' and ')}`
          : "High-rated cultural heritage site",
        confidence,
        estimatedTime: 3 // Default 3 hours per site
      };
    })
    .filter(site => site.confidence >= 30) // Only show decent matches
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 12); // Top 12 recommendations

    setRecommendations(scoredSites);
  };

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId);
      } else {
        return [...prev, siteId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedSites.length === 0) {
      toast({
        title: "Select some sites",
        description: "Please choose at least one site for your trip",
        variant: "destructive"
      });
      return;
    }

    // Update trip with selected sites
    const updatedTrip = {
      ...trip,
      selectedSites
    };
    
    saveTrip(updatedTrip);
    
    toast({
      title: "Sites selected!",
      description: `Added ${selectedSites.length} site${selectedSites.length > 1 ? 's' : ''} to your trip`
    });
    
    // For now, navigate back to planner or could create itinerary builder
    navigate(`/planner`);
  };

  const totalEstimatedTime = selectedSites.length * 3; // 3 hours per site

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4" />
              {trip.destination} • {trip.numberOfDays} days
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {trip.name} Recommendations
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Based on your selected personas, here are the perfect cultural heritage sites for your trip
            </p>
            
            {selectedSites.length > 0 && (
              <div className="flex items-center justify-center gap-4 text-sm">
                <Badge variant="default" className="px-3 py-1">
                  {selectedSites.length} sites selected
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  ~{totalEstimatedTime} hours total
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="recommended">
                Recommended ({recommendations.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Sites ({HERITAGE_SITES.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-6">
              {recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No recommendations found
                    </h3>
                    <p className="text-muted-foreground">
                      Try selecting different personas or browse all available sites
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => {
                    const site = HERITAGE_SITES.find(s => s.id === rec.id);
                    if (!site) return null;

                    const isSelected = selectedSites.includes(site.id);

                    return (
                      <div key={site.id} className="relative">
                        <div 
                          className={cn(
                            "cursor-pointer transition-all duration-300",
                            isSelected && "ring-2 ring-primary"
                          )}
                          onClick={() => handleSiteToggle(site.id)}
                        >
                          <SiteCard
                            id={site.id}
                            name={site.name}
                            description={site.description}
                            image={site.image}
                            location={`${site.city}, ${site.country}`}
                            duration={site.duration}
                            category={site.category}
                            accessibility="Medium" // Default accessibility
                            rating={site.rating}
                            matchScore={rec.confidence}
                            onAddToTrip={() => handleSiteToggle(site.id)}
                            className={cn(
                              "h-full",
                              isSelected && "bg-primary/5 border-primary/20"
                            )}
                          />
                        </div>
                        
                        {/* Match indicator */}
                        <div className="absolute top-2 right-2 space-y-1">
                          <Badge 
                            variant="secondary" 
                            className="bg-background/90 backdrop-blur-sm"
                          >
                            {rec.confidence}% match
                          </Badge>
                          {isSelected && (
                            <Badge 
                              variant="default"
                              className="bg-primary text-primary-foreground block"
                            >
                              Selected
                            </Badge>
                          )}
                        </div>
                        
                        {/* Match reason */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          {rec.matchReason}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HERITAGE_SITES.map((site) => {
                  const isSelected = selectedSites.includes(site.id);
                  
                  return (
                    <div key={site.id} className="relative">
                      <div 
                        className={cn(
                          "cursor-pointer transition-all duration-300",
                          isSelected && "ring-2 ring-primary"
                        )}
                        onClick={() => handleSiteToggle(site.id)}
                      >
                        <SiteCard
                          id={site.id}
                          name={site.name}
                          description={site.description}
                          image={site.image}
                          location={`${site.city}, ${site.country}`}
                          duration={site.duration}
                          category={site.category}
                          accessibility="Medium" // Default accessibility
                          rating={site.rating}
                          matchScore={75} // Default match score for all sites
                          onAddToTrip={() => handleSiteToggle(site.id)}
                          className={cn(
                            "h-full",
                            isSelected && "bg-primary/5 border-primary/20"
                          )}
                        />
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant="default"
                            className="bg-primary text-primary-foreground"
                          >
                            Selected
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Continue Button */}
          {selectedSites.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {selectedSites.length} sites selected
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimated {totalEstimatedTime} hours
                      </div>
                    </div>
                    <Button
                      onClick={handleContinue}
                      size="lg"
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full"
                    >
                      Create Itinerary
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}