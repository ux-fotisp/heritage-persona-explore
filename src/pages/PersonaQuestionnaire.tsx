import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/navigation/AppHeader";
import { PersonaCard } from "@/components/onboarding/PersonaCard";
import { Progress } from "@/components/ui/progress";
import { 
  Mountain, 
  Palette, 
  Users, 
  Lightbulb, 
  Heart, 
  Compass, 
  Camera, 
  BookOpen,
  Trophy,
  Gem
} from "lucide-react";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  value: number;
}

const initialPersonas: PersonaData[] = [
  {
    id: "adventurer",
    title: "The Adventurer",
    description: "Seeking thrilling experiences and off-the-beaten-path discoveries",
    traits: ["Bold", "Curious", "Risk-taker", "Explorer"],
    icon: "🏔️",
    value: 0
  },
  {
    id: "cultural-enthusiast", 
    title: "The Cultural Enthusiast",
    description: "Passionate about art, history, and local traditions",
    traits: ["Artistic", "Historical", "Cultured", "Refined"],
    icon: "🎨",
    value: 0
  },
  {
    id: "social-connector",
    title: "The Social Connector", 
    description: "Enjoys meeting people and sharing experiences with others",
    traits: ["Social", "Friendly", "Collaborative", "Outgoing"],
    icon: "👥",
    value: 0
  },
  {
    id: "mindful-traveler",
    title: "The Mindful Traveler",
    description: "Values sustainable and meaningful travel experiences",
    traits: ["Conscious", "Reflective", "Sustainable", "Thoughtful"],
    icon: "🧘",
    value: 0
  },
  {
    id: "comfort-seeker",
    title: "The Comfort Seeker",
    description: "Prefers well-planned, comfortable, and luxurious experiences",
    traits: ["Comfortable", "Planned", "Luxurious", "Relaxed"],
    icon: "💎",
    value: 0
  },
  {
    id: "budget-explorer",
    title: "The Budget Explorer",
    description: "Finds amazing experiences while being mindful of costs",
    traits: ["Economical", "Resourceful", "Smart", "Practical"],
    icon: "💰",
    value: 0
  },
  {
    id: "heritage-hunter",
    title: "The Heritage Hunter",
    description: "Fascinated by historical sites and ancient civilizations",
    traits: ["Historical", "Archaeological", "Educational", "Curious"],
    icon: "🏛️",
    value: 0
  },
  {
    id: "nature-lover",
    title: "The Nature Lover",
    description: "Drawn to natural heritage sites and outdoor experiences",
    traits: ["Outdoorsy", "Environmental", "Peaceful", "Connected"],
    icon: "🌿",
    value: 0
  },
  {
    id: "photo-enthusiast",
    title: "The Photo Enthusiast",
    description: "Seeks picturesque locations and Instagram-worthy moments",
    traits: ["Visual", "Creative", "Aesthetic", "Artistic"],
    icon: "📸",
    value: 0
  },
  {
    id: "knowledge-seeker",
    title: "The Knowledge Seeker",
    description: "Loves learning new things and gaining deep insights",
    traits: ["Intellectual", "Studious", "Analytical", "Questioning"],
    icon: "📚",
    value: 0
  }
];

export default function PersonaQuestionnaire() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<PersonaData[]>(initialPersonas);
  
  const progress = (personas.filter(p => p.value > 0).length / personas.length) * 100;
  const allCompleted = personas.every(p => p.value > 0);

  const updatePersonaValue = (id: string, value: number) => {
    setPersonas(prev => prev.map(persona => 
      persona.id === id ? { ...persona, value } : persona
    ));
  };

  const handleComplete = () => {
    // Get top 2 personas based on highest values
    const sortedPersonas = [...personas].sort((a, b) => b.value - a.value);
    const topPersonas = sortedPersonas.slice(0, 2);
    
    // Navigate to results page with persona data
    navigate("/persona-results", { 
      state: { 
        topPersonas,
        allPersonas: personas 
      }
    });
  };

  return (
    <div className="min-h-screen bg-background font-manrope">
      <AppHeader backPath="/onboarding" />
      
      {/* Header Section */}
      <div className="px-6 pt-6 pb-4">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-medium text-sm">Travel Persona Builder</span>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">
            Discover Your Travel Style
          </h1>
          
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Rate how much each persona resonates with you to create your personalized travel profile
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Personas List */}
      <div className="px-6 space-y-4 pb-32">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            id={persona.id}
            title={persona.title}
            description={persona.description}
            traits={persona.traits}
            icon={persona.icon}
            value={persona.value}
            onChange={(value) => updatePersonaValue(persona.id, value)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-6">
        <Button
          onClick={handleComplete}
          disabled={!allCompleted}
          className="w-full py-4 text-lg font-semibold rounded-full h-auto"
          variant={allCompleted ? "default" : "secondary"}
        >
          {allCompleted ? "Create My Travel Profile" : `Complete ${personas.filter(p => p.value === 0).length} more`}
        </Button>
      </div>
    </div>
  );
}