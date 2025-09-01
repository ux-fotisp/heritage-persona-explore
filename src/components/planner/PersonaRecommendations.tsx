import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SiteCard } from '@/components/heritage/SiteCard';
import { User, RefreshCw, CheckCircle } from 'lucide-react';
import { getPersona, type PersonaData } from '@/lib/personaStorage';
import { getPersonaFromCookie, migratePersonaToCookies } from '@/lib/cookieStorage';
import { HERITAGE_SITES } from '@/data/heritageSites';
import { useToast } from '@/hooks/use-toast';

export function PersonaRecommendations() {
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Try migration first, then load from cookie
    migratePersonaToCookies();
    const savedPersona = getPersonaFromCookie() || getPersona(); // fallback to localStorage
    setPersona(savedPersona);
  }, []);

  const getPersonaTraits = (persona: PersonaData): string[] => {
    const allTraits = [
      ...(persona.traits || []),
      ...(persona.likes || []),
      ...(persona.matchedPersonalities || [])
    ];
    return Array.from(new Set(allTraits.map(trait => trait.toLowerCase())));
  };

  const getRecommendedSites = () => {
    if (!persona) return [];

    const personaTraits = getPersonaTraits(persona);
    
    // Filter sites based on persona ID matching (more accurate than trait matching)
    const matchedSites = HERITAGE_SITES.filter(site => {
      // Check if persona ID is in the site's personas array
      const hasPersonaMatch = site.personas.includes(persona.id);
      
      // Also check trait-based matching as fallback
      const hasTraitMatch = personaTraits.some(trait => 
        site.category.toLowerCase().includes(trait) ||
        site.description.toLowerCase().includes(trait)
      );
      
      return hasPersonaMatch || hasTraitMatch;
    });

    // Sort by rating and limit to top recommendations
    return matchedSites
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  };

  const handleRefreshRecommendations = () => {
    migratePersonaToCookies();
    const savedPersona = getPersonaFromCookie() || getPersona(); // fallback to localStorage
    setPersona(savedPersona);
    toast({
      title: "Recommendations Updated",
      description: "Refreshed based on your current persona"
    });
  };

  const recommendedSites = getRecommendedSites();

  if (!persona) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">
            Complete your persona assessment to get personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Persona Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Recommendations based on your persona: {persona.title}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefreshRecommendations}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{persona.description}</p>
            <div className="flex flex-wrap gap-2">
              {getPersonaTraits(persona).slice(0, 6).map((trait) => (
                <Badge key={trait} variant="secondary" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Persona saved to your profile
              {persona.completedAt && (
                <span>• Completed {new Date(persona.completedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Mode Toggle (for testing) */}
      <div className="flex justify-end">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => setDebugMode(!debugMode)}
        >
          {debugMode ? 'Hide Debug' : 'Show Debug'}
        </Button>
      </div>

      {/* Debug Information */}
      {debugMode && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">🧪 Debug: Check Saved Persona</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {JSON.stringify(persona, null, 2)}
            </pre>
            <p className="mt-2 text-muted-foreground">
              Found {recommendedSites.length} matching sites out of {HERITAGE_SITES.length} total
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recommended Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Recommended Destinations for You ({recommendedSites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedSites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedSites.map((site) => (
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
                  matchScore={85}
                  matchedPersonas={getPersonaTraits(persona)}
                  onAddToTrip={() => {
                    const existing: string[] = JSON.parse(localStorage.getItem("plannedSites") || "[]");
                    const merged = Array.from(new Set([...existing, site.id]));
                    localStorage.setItem("plannedSites", JSON.stringify(merged));
                    toast({ title: "Added to Plan", description: "Site added to your trip plan" });
                  }}
                  onRate={() => window.location.href = `/rate/${site.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No specific matches found for your persona traits.</p>
              <p className="text-sm mt-2">
                Try completing the persona assessment again or browse all destinations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}