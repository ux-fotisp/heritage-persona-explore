import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonaCard } from "@/components/onboarding/PersonaCard";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Sparkles } from "lucide-react";

// 8 ACUX Personas with cultural heritage focus
const personas = [
  {
    id: "explorer",
    title: "The Cultural Explorer",
    description: "Curious about diverse cultures and authentic experiences",
    traits: ["Adventurous", "Open-minded", "Culturally curious"],
    icon: "🗺️"
  },
  {
    id: "historian",
    title: "The History Enthusiast", 
    description: "Fascinated by historical narratives and ancient civilizations",
    traits: ["Detail-oriented", "Analytical", "Knowledge-seeking"],
    icon: "📚"
  },
  {
    id: "artist",
    title: "The Art Connoisseur",
    description: "Appreciates artistic expression and creative heritage",
    traits: ["Creative", "Aesthetic", "Expressive"],
    icon: "🎨"
  },
  {
    id: "spiritual",
    title: "The Spiritual Seeker",
    description: "Values meaningful experiences and spiritual connections",
    traits: ["Reflective", "Mindful", "Purpose-driven"],
    icon: "🕯️"
  },
  {
    id: "social",
    title: "The Social Connector",
    description: "Enjoys shared experiences and cultural exchange",
    traits: ["Social", "Collaborative", "Community-oriented"],
    icon: "👥"
  },
  {
    id: "nature",
    title: "The Nature Lover",
    description: "Drawn to natural heritage sites and outdoor experiences",
    traits: ["Outdoor-oriented", "Environmental", "Peaceful"],
    icon: "🌿"
  },
  {
    id: "photographer",
    title: "The Visual Storyteller",
    description: "Documents experiences through visual narratives",
    traits: ["Visual", "Storytelling", "Moment-capturing"],
    icon: "📷"
  },
  {
    id: "learner",
    title: "The Lifelong Learner",
    description: "Seeks educational value in cultural experiences",
    traits: ["Intellectual", "Educational", "Growth-oriented"],
    icon: "🎓"
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRatingChange = (personaId: string, value: number) => {
    setRatings(prev => ({ ...prev, [personaId]: value }));
  };

  const topMatches = useMemo(() => {
    const sorted = Object.entries(ratings)
      .filter(([_, rating]) => rating > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    
    return sorted.map(([id, rating]) => ({
      persona: personas.find(p => p.id === id)!,
      score: rating
    }));
  }, [ratings]);

  const completedRatings = Object.values(ratings).filter(r => r > 0).length;
  const progress = (completedRatings / personas.length) * 100;

  const steps = [
    {
      title: "Welcome to CCIM",
      subtitle: "Cultural Heritage Explorer",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center text-6xl">
            🏛️
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Your Cultural Match
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Let's find cultural heritage sites that resonate with your personality and interests.
            </p>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => setCurrentStep(1)}
            className="mt-8"
          >
            Begin Journey
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )
    },
    {
      title: "Discover Your Cultural Persona",
      subtitle: `Rate how much you relate to each persona (${completedRatings}/${personas.length} completed)`,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="space-y-4">
            {personas.map((persona) => (
              <PersonaCard
                key={persona.id}
                {...persona}
                value={ratings[persona.id] || 0}
                onChange={(value) => handleRatingChange(persona.id, value)}
              />
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => setCurrentStep(2)}
              disabled={completedRatings < 4}
              className="min-w-48"
            >
              View My Matches
              <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Your Cultural Persona Matches",
      subtitle: "Based on your preferences, here are your top cultural personas",
      content: (
        <div className="space-y-6">
          {topMatches.length > 0 ? (
            <div className="space-y-4">
              {topMatches.map(({ persona, score }, index) => (
                <Card key={persona.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-primary text-primary-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{persona.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{persona.title}</CardTitle>
                          <p className="text-primary-foreground/90 text-sm">
                            #{index + 1} Match • {score}/10 Rating
                          </p>
                        </div>
                      </div>
                      <div className="text-4xl font-bold">
                        {Math.round((score / 10) * 100)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">{persona.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.traits.map((trait) => (
                        <span 
                          key={trait}
                          className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please complete more persona ratings to see your matches.</p>
            </div>
          )}
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              We'll use these insights to recommend cultural heritage sites that match your interests.
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/discover")}
              disabled={topMatches.length === 0}
            >
              Start Exploring
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep].subtitle}
            </p>
          </div>
          
          {steps[currentStep].content}
        </div>
      </div>
    </div>
  );
}