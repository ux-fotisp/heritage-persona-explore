import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { PersonaData } from "@/lib/personaStorage";
import { getPersonaFromCookie, migratePersonaToCookies } from "@/lib/cookieStorage";

export function MyPersonaTile() {
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPersonaData();
  }, []);

  const loadPersonaData = () => {
    setLoading(true);
    try {
      // Try migration first
      migratePersonaToCookies();
      
      // Load persona from cookie
      const savedPersona = getPersonaFromCookie();
      setPersona(savedPersona);
    } catch (error) {
      console.error('Error loading persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalibrate = () => {
    navigate('/persona-questionnaire');
  };

  const handleViewDetails = () => {
    navigate('/persona-results');
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-24">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!persona) {
    return (
      <Card className="border-primary/20 bg-gradient-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            My Travel Persona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              Discover your unique travel personality
            </p>
            <Button onClick={() => navigate('/onboarding')} className="w-full">
              Take Persona Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPersonaTraits = () => {
    const traits = [
      ...(persona.traits || []),
      ...(persona.likes || [])
    ];
    return traits.slice(0, 4); // Show max 4 traits
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            My Travel Persona
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl" role="img" aria-label={persona.title}>
            {persona.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {persona.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {persona.description}
            </p>
          </div>
        </div>

        {getPersonaTraits().length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {getPersonaTraits().map((trait) => (
              <Badge key={trait} variant="outline" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        )}

        {persona.completedAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Completed {formatDate(persona.completedAt)}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRecalibrate}
            className="flex-1"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Recalibrate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}