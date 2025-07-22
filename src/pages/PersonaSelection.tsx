import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  likes: string[];
  dislikes: string[];
  icon: string;
  value: number;
}

export default function PersonaSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topPersonas, allPersonas } = location.state || { topPersonas: [], allPersonas: [] };
  
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);

  // Calculate accuracy percentages based on persona values
  const getAccuracyPercentage = (persona: PersonaData) => {
    const maxValue = 5;
    const normalizedValue = (persona.value + maxValue) / (maxValue * 2); // Convert -5 to 5 range to 0 to 1
    return Math.round(normalizedValue * 100);
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersonas(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else if (prev.length < 2) {
        return [...prev, personaId];
      } else {
        return [prev[1], personaId]; // Replace first selection
      }
    });
  };

  const handleContinue = () => {
    const selected = allPersonas.filter((p: PersonaData) => selectedPersonas.includes(p.id));
    navigate("/persona-confirmation", { 
      state: { 
        selectedPersonas: selected,
        allPersonas 
      }
    });
  };

  const getSelectedPersonas = () => {
    return allPersonas.filter((p: PersonaData) => selectedPersonas.includes(p.id));
  };

  return (
    <div className="min-h-screen bg-background font-manrope">
      <AppHeader backPath="/persona-questionnaire" />
      
      {/* Header Section */}
      <div className="px-4 pt-4 pb-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-medium text-sm">Persona Match</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Your Best{" "}
              <span className="text-primary">Matches</span>
            </h1>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              Based on your ratings, here are your top persona matches. Select up to 2 personas that best represent you.
            </p>
            
            {selectedPersonas.length > 0 && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mt-2">
                <span className="text-success font-medium text-xs">
                  {selectedPersonas.length}/2 personas selected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Personas */}
      <div className="px-4 space-y-4 pb-6">
        {topPersonas.map((persona: PersonaData) => (
          <Card 
            key={persona.id}
            className={cn(
              "transition-all duration-300 border border-border bg-card hover:shadow-card cursor-pointer",
              selectedPersonas.includes(persona.id) && "ring-2 ring-primary/50 border-primary/30 bg-primary/[0.02]"
            )}
            onClick={() => handlePersonaSelect(persona.id)}
          >
            <CardContent className="p-5">
              {/* Header with Selection */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl flex-shrink-0" role="img" aria-label={persona.title}>
                  {persona.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Accuracy Badge - Moved above title and made bigger */}
                      <div className="mb-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-primary/10 text-primary border-primary/20 text-base px-3 py-1 font-semibold"
                        >
                          {getAccuracyPercentage(persona)}% Match
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">
                        {persona.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {persona.description}
                      </p>
                    </div>
                    
                    {/* Selection Indicator with Number */}
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors font-semibold text-sm",
                      selectedPersonas.includes(persona.id) 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground/30"
                    )}>
                      {selectedPersonas.includes(persona.id) ? (
                        selectedPersonas.indexOf(persona.id) + 1
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Likes and Dislikes */}
              <div className="space-y-4">
                {/* Likes */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Likes</h4>
                  <div className="flex flex-wrap gap-2">
                    {persona.likes.map((like, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: '#31543F' }}
                      >
                        {like}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dislikes */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Dislikes</h4>
                  <div className="flex flex-wrap gap-2">
                    {persona.dislikes.map((dislike, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: '#744444' }}
                      >
                        {dislike}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Summary */}
      {selectedPersonas.length > 0 && (
        <div className="px-4 pb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h4 className="font-medium text-foreground mb-2">Selected Personas:</h4>
              <div className="space-y-1">
                {getSelectedPersonas().map((persona: PersonaData) => (
                  <div key={persona.id} className="flex items-center gap-3">
                    <span className="text-lg">{persona.icon}</span>
                    <span className="text-sm font-medium text-foreground">{persona.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {getAccuracyPercentage(persona)}% Match
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom CTA - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <Button
          onClick={handleContinue}
          disabled={selectedPersonas.length === 0}
          className="w-full py-4 text-base font-semibold rounded-full h-auto transition-smooth"
          variant={selectedPersonas.length > 0 ? "default" : "secondary"}
        >
          {selectedPersonas.length === 0 
            ? "Select at least one persona" 
            : `Continue with ${selectedPersonas.length} persona${selectedPersonas.length > 1 ? 's' : ''}`
          }
        </Button>
      </div>
    </div>
  );
}