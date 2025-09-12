import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Check, Users, ArrowRight } from "lucide-react";
import { getTripById, saveTrip } from "@/lib/tripStorage";
import { loadPersonaAssessment, PersonaData } from "@/lib/personaStorage";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AVAILABLE_PERSONAS: PersonaData[] = [
  {
    id: "archaeologist",
    title: "The Archaeologist",
    description: "Fascinated by ancient civilizations and historical artifacts",
    icon: "🏺",
    value: 0,
    traits: ["Ancient history", "Archaeological sites", "Museums"],
    likes: ["Historical accuracy", "Expert guides", "Educational content"],
    dislikes: ["Crowded tourist spots", "Commercialized sites"]
  },
  {
    id: "naturalist", 
    title: "The Naturalist",
    description: "Drawn to natural heritage sites and landscapes",
    icon: "🌿",
    value: 0,
    traits: ["Natural heritage", "Landscapes", "Conservation"],
    likes: ["National parks", "Scenic views", "Wildlife"],
    dislikes: ["Urban environments", "Artificial attractions"]
  },
  {
    id: "artist",
    title: "The Artist",
    description: "Inspired by architecture, design, and creative expression",
    icon: "🎨",
    value: 0,
    traits: ["Architecture", "Art galleries", "Creative spaces"],
    likes: ["Unique designs", "Photo opportunities", "Artistic heritage"],
    dislikes: ["Generic buildings", "Restrictive photo policies"]
  },
  {
    id: "spiritual",
    title: "The Spiritual Seeker",
    description: "Seeks meaningful and contemplative experiences",
    icon: "🕯️",
    value: 0,
    traits: ["Religious sites", "Meditation", "Spiritual heritage"],
    likes: ["Sacred spaces", "Quiet contemplation", "Cultural rituals"],
    dislikes: ["Noisy environments", "Rushed visits"]
  },
  {
    id: "adventurer",
    title: "The Adventurer",
    description: "Loves exploring off-the-beaten-path locations",
    icon: "🏃‍♂️",
    value: 0,
    traits: ["Adventure", "Hidden gems", "Physical challenges"],
    likes: ["Hiking trails", "Remote locations", "Unique experiences"],
    dislikes: ["Tourist crowds", "Easy accessibility"]
  },
  {
    id: "foodie",
    title: "The Culinary Explorer",
    description: "Interested in food culture and local cuisine",
    icon: "🍽️",
    value: 0,
    traits: ["Food culture", "Local cuisine", "Culinary heritage"],
    likes: ["Traditional recipes", "Local markets", "Food festivals"],
    dislikes: ["Generic restaurants", "Fast food"]
  },
  {
    id: "historian",
    title: "The Historian",
    description: "Passionate about understanding historical context",
    icon: "📚",
    value: 0,
    traits: ["Historical events", "Timeline understanding", "Context"],
    likes: ["Detailed narratives", "Primary sources", "Expert interpretation"],
    dislikes: ["Superficial information", "Inaccurate portrayals"]
  },
  {
    id: "social",
    title: "The Social Connector",
    description: "Enjoys shared experiences and meeting people",
    icon: "👥",
    value: 0,
    traits: ["Social interaction", "Group activities", "Community"],
    likes: ["Group tours", "Cultural events", "Meeting locals"],
    dislikes: ["Isolated experiences", "Solitary activities"]
  }
];

export default function TripPersonaSelection() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<any>(null);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [personas, setPersonas] = useState<PersonaData[]>(AVAILABLE_PERSONAS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tripId) {
      navigate('/trip-creation');
      return;
    }

    // Load trip data
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
    
    // Load existing persona assessment if available
    const assessment = loadPersonaAssessment();
    if (assessment && assessment.allPersonas.length > 0) {
      // Use user's actual persona data
      const sortedPersonas = [...assessment.allPersonas].sort((a, b) => b.value - a.value);
      setPersonas(sortedPersonas);
      
      // Pre-select top 2 personas if available
      if (sortedPersonas.length >= 2) {
        setSelectedPersonas([sortedPersonas[0].id, sortedPersonas[1].id]);
      } else if (sortedPersonas.length === 1) {
        setSelectedPersonas([sortedPersonas[0].id]);
      }
    }
    
    setIsLoading(false);
  }, [tripId, navigate, toast]);

  const handlePersonaToggle = (personaId: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else if (prev.length < 2) {
        return [...prev, personaId];
      } else {
        // Replace the first selected persona if already at max
        return [prev[1], personaId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedPersonas.length === 0) {
      toast({
        title: "Select at least one persona",
        description: "Please choose 1-2 personas that match your travel style",
        variant: "destructive"
      });
      return;
    }

    // Update trip with selected personas
    const updatedTrip = {
      ...trip,
      selectedPersonas
    };
    
    saveTrip(updatedTrip);
    
    toast({
      title: "Personas selected!",
      description: `Selected ${selectedPersonas.length} persona${selectedPersonas.length > 1 ? 's' : ''} for your trip`
    });
    
    // Navigate to recommendations
    navigate(`/trip/${tripId}/recommendations`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your trip...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Users className="h-4 w-4" />
              {trip.name}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Choose Your Travel Personas
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select 1-2 personas that best match your travel style for {trip.destination}. 
              This helps us recommend the perfect cultural sites for you.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline" className="px-3 py-1">
                {selectedPersonas.length}/2 selected
              </Badge>
              <span>Maximum 2 personas</span>
            </div>
          </div>

          {/* Persona Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona) => {
              const isSelected = selectedPersonas.includes(persona.id);
              const selectionIndex = selectedPersonas.indexOf(persona.id);
              
              return (
                <Card 
                  key={persona.id}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-card",
                    isSelected && "ring-2 ring-primary bg-primary/5 border-primary/20"
                  )}
                  onClick={() => handlePersonaToggle(persona.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{persona.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{persona.title}</CardTitle>
                          {isSelected && (
                            <Badge variant="default" className="mt-1">
                              {selectionIndex === 0 ? "Primary" : "Secondary"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {isSelected && (
                        <div className="p-1 rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{persona.description}</p>
                    
                    {persona.traits && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {persona.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {persona.value > 0 && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Your match</span>
                          <span className="text-sm font-semibold text-primary">
                            {Math.round((persona.value / 5) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={selectedPersonas.length === 0}
              size="lg"
              className="px-8 py-4 text-lg bg-primary hover:bg-primary-hover text-primary-foreground rounded-full"
            >
              Continue to Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}