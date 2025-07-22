import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, Target } from "lucide-react";
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

export default function PersonaConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPersonas, allPersonas } = location.state || { selectedPersonas: [], allPersonas: [] };

  const getAccuracyPercentage = (persona: PersonaData) => {
    const maxValue = 5;
    const normalizedValue = (persona.value + maxValue) / (maxValue * 2);
    return Math.round(normalizedValue * 100);
  };

  const handleContinue = () => {
    navigate("/persona-results", { 
      state: { 
        selectedPersonas,
        allPersonas 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background font-manrope">
      <AppHeader backPath="/persona-selection" />
      
      {/* Festive Header Section */}
      <div className="px-4 pt-8 pb-8 space-y-8 text-center">
        {/* Celebration Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-primary to-primary/70 rounded-full p-6 shadow-lg">
            <Sparkles className="h-12 w-12 text-primary-foreground animate-pulse" />
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-success/20 border border-primary/30">
            <Heart className="h-4 w-4 text-primary mr-2" />
            <span className="text-primary font-semibold text-sm">Persona Complete!</span>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              🎉 Your Travel{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Persona is Ready!
              </span>
            </h1>
            
            <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
              Perfect! We've captured your unique travel personality. All your future recommendations will be tailored to match your selected personas.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Personas Display */}
      <div className="px-4 space-y-6 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
            <Target className="h-4 w-4 text-success mr-2" />
            <span className="text-success font-medium text-sm">
              Your Selected Persona{selectedPersonas.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {selectedPersonas.map((persona: PersonaData, index: number) => (
          <Card 
            key={persona.id}
            className={cn(
              "transition-all duration-500 border-2 bg-gradient-to-br shadow-lg hover:shadow-xl animate-fade-in",
              index === 0 && "from-primary/5 to-primary/10 border-primary/30",
              index === 1 && "from-success/5 to-success/10 border-success/30"
            )}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <div className="text-4xl" role="img" aria-label={persona.title}>
                    {persona.icon}
                  </div>
                  <div className={cn(
                    "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    index === 0 ? "bg-primary" : "bg-success"
                  )}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-base px-3 py-1 font-semibold mb-2",
                        index === 0 ? "bg-primary/10 text-primary border-primary/20" : "bg-success/10 text-success border-success/20"
                      )}
                    >
                      {getAccuracyPercentage(persona)}% Match
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-xl text-foreground leading-tight mb-2">
                    {persona.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              </div>

              {/* Likes and Dislikes Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top Likes */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Heart className="h-3 w-3 text-green-600" />
                    Your Preferences
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.likes.slice(0, 3).map((like, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: '#31543F' }}
                      >
                        {like}
                      </span>
                    ))}
                    {persona.likes.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        +{persona.likes.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Dislikes */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">What You Avoid</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.dislikes.slice(0, 2).map((dislike, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: '#744444' }}
                      >
                        {dislike}
                      </span>
                    ))}
                    {persona.dislikes.length > 2 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        +{persona.dislikes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Success Message */}
      <div className="px-4 pb-8">
        <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mb-2">
                <Target className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-bold text-foreground text-lg">All Set!</h4>
              <p className="text-muted-foreground text-sm">
                Your personalized heritage site recommendations are now ready. Let's explore destinations that match your unique travel style!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom CTA - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <Button
          onClick={handleContinue}
          className="w-full py-4 text-base font-semibold rounded-full h-auto transition-smooth bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Start Exploring Heritage Sites
        </Button>
      </div>
    </div>
  );
}