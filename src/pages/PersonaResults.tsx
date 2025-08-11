import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Share, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { loadPersonaAssessment, savePersonaAssessment } from "@/lib/personaStorage";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  value: number;
}

export default function PersonaResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = (location.state as {
    topPersonas: PersonaData[];
    allPersonas: PersonaData[];
  }) || undefined;

  const [data, setData] = useState<{
    topPersonas: PersonaData[];
    allPersonas: PersonaData[];
  } | null>(stateData ? { topPersonas: stateData.topPersonas, allPersonas: stateData.allPersonas } : null);

  useEffect(() => {
    if (stateData?.topPersonas && stateData?.allPersonas) {
      savePersonaAssessment({
        topPersonas: stateData.topPersonas,
        allPersonas: stateData.allPersonas,
        completedAt: new Date().toISOString(),
      });
      return;
    }
    const stored = loadPersonaAssessment();
    if (stored) {
      setData({ topPersonas: stored.topPersonas, allPersonas: stored.allPersonas });
    } else {
      navigate("/onboarding", { replace: true });
    }
  }, []);

  if (!data) return null;

  const { topPersonas, allPersonas } = data;

  const handleStartExploring = () => {
    navigate("/discover");
  };

  return (
    <div className="min-h-screen bg-background font-manrope">
      <AppHeader backPath="/persona-questionnaire" />
      
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Your Travel Persona
            </h1>
            <p className="text-muted-foreground text-sm">
              Based on your preferences, here's your unique travel style
            </p>
          </div>
        </div>
      </div>

      {/* Top Personas */}
      <div className="px-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Your Primary Personas</h2>
          
          {topPersonas.map((persona, index) => (
            <Card key={persona.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                {index === 0 && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      Primary
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="text-4xl" role="img" aria-label={persona.title}>
                    {persona.icon}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        {persona.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {persona.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {persona.traits.map((trait) => (
                        <Badge 
                          key={trait} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Match Score
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {persona.value}/10
                        </span>
                      </div>
                      <Progress value={(persona.value / 10) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Persona Summary */}
        <Card className="bg-gradient-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <Heart className="h-8 w-8 text-primary mx-auto" />
              <div>
                <h3 className="font-semibold text-foreground">Perfect Matches Await</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll now curate heritage sites that match your {topPersonas[0]?.title.toLowerCase()} and {topPersonas[1]?.title.toLowerCase()} style
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-32">
          <Button
            onClick={handleStartExploring}
            className="w-full py-4 text-lg font-semibold rounded-full h-auto"
          >
            Start Exploring Heritage Sites
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3 rounded-full h-auto"
          >
            <Share className="h-4 w-4 mr-2" />
            Share My Travel Persona
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="w-full py-3 rounded-full h-auto">
                Retake Assessment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Retake the persona assessment?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your current persona matches and recommendations will be updated based on your new answers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => navigate("/persona-questionnaire")}>
                  Retake now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}