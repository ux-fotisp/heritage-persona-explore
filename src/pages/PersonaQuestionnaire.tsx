import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/navigation/AppHeader";
import { PersonaCard } from "@/components/onboarding/PersonaCard";
import { Progress } from "@/components/ui/progress";

interface PersonaData {
  id: string;
  title: string;
  description: string;
  likes: string[];
  dislikes: string[];
  icon: string;
  value: number;
}

const initialPersonas: PersonaData[] = [
  {
    id: "adventurer",
    title: "The Adventurer",
    description: "Seeking thrilling experiences and off-the-beaten-path discoveries in remote heritage sites",
    likes: [
      "Exploring hidden ruins and secret locations",
      "Hiking to remote archaeological sites", 
      "Camping near heritage locations",
      "Adventure sports in historical settings"
    ],
    dislikes: [
      "Crowded tourist spots",
      "Overly guided experiences",
      "Staying in luxury hotels",
      "Following strict itineraries"
    ],
    icon: "🏔️",
    value: 0
  },
  {
    id: "cultural-enthusiast", 
    title: "The Cultural Enthusiast",
    description: "Passionate about art, history, and immersing in local traditions and customs",
    likes: [
      "Museum visits and art galleries",
      "Traditional craft workshops",
      "Historical reenactments",
      "Local festivals and ceremonies"
    ],
    dislikes: [
      "Rushing through sites",
      "Superficial tourist activities",
      "Modern commercialized attractions",
      "Loud, disruptive environments"
    ],
    icon: "🎨",
    value: 0
  },
  {
    id: "social-connector",
    title: "The Social Connector", 
    description: "Enjoys meeting people and sharing meaningful experiences with fellow travelers",
    likes: [
      "Group tours and activities",
      "Meeting local communities",
      "Sharing stories with other travelers",
      "Cultural exchange programs"
    ],
    dislikes: [
      "Solo exploration",
      "Language barriers",
      "Antisocial environments",
      "Isolated locations"
    ],
    icon: "👥",
    value: 0
  },
  {
    id: "mindful-traveler",
    title: "The Mindful Traveler",
    description: "Values sustainable tourism and seeks deep, reflective connections with heritage",
    likes: [
      "Eco-friendly accommodations",
      "Supporting local communities",
      "Meditation and reflection time",
      "Learning about conservation efforts"
    ],
    dislikes: [
      "Environmental damage",
      "Overconsumption and waste",
      "Disrespectful tourists",
      "Mass tourism impacts"
    ],
    icon: "🧘",
    value: 0
  },
  {
    id: "comfort-seeker",
    title: "The Comfort Seeker",
    description: "Prefers well-planned visits to accessible heritage sites with modern amenities",
    likes: [
      "Luxury accommodations",
      "Professional guided tours",
      "Air-conditioned transportation",
      "Fine dining experiences"
    ],
    dislikes: [
      "Rough camping conditions",
      "Long hiking distances",
      "Basic facilities",
      "Unpredictable weather exposure"
    ],
    icon: "💎",
    value: 0
  },
  {
    id: "budget-explorer",
    title: "The Budget Explorer",
    description: "Finds incredible heritage experiences while being mindful of travel costs",
    likes: [
      "Free heritage sites and museums",
      "Public transportation",
      "Local street food",
      "Budget accommodations"
    ],
    dislikes: [
      "Expensive entrance fees",
      "Luxury travel requirements",
      "High-end restaurants",
      "Private tour costs"
    ],
    icon: "💰",
    value: 0
  },
  {
    id: "heritage-hunter",
    title: "The Heritage Hunter",
    description: "Fascinated by UNESCO sites, ancient ruins, and archaeological discoveries",
    likes: [
      "UNESCO World Heritage sites",
      "Archaeological excavations",
      "Ancient civilizations",
      "Historical documentation"
    ],
    dislikes: [
      "Modern reconstructions",
      "Commercialized historical sites",
      "Inaccurate historical information",
      "Rushed historical tours"
    ],
    icon: "🏛️",
    value: 0
  },
  {
    id: "nature-lover",
    title: "The Nature Lover",
    description: "Drawn to natural heritage sites, national parks, and scenic landscapes",
    likes: [
      "Natural World Heritage sites",
      "Wildlife observation",
      "Scenic hiking trails",
      "Environmental conservation"
    ],
    dislikes: [
      "Urban heritage sites",
      "Heavily developed areas",
      "Indoor museums",
      "Artificial attractions"
    ],
    icon: "🌿",
    value: 0
  },
  {
    id: "photo-enthusiast",
    title: "The Photo Enthusiast",
    description: "Seeks photogenic heritage locations and visually stunning architectural sites",
    likes: [
      "Golden hour photography",
      "Architectural details",
      "Panoramic viewpoints",
      "Unique compositions"
    ],
    dislikes: [
      "Photography restrictions",
      "Crowded photo spots",
      "Poor lighting conditions",
      "Rushed photography time"
    ],
    icon: "📸",
    value: 0
  },
  {
    id: "knowledge-seeker",
    title: "The Knowledge Seeker",
    description: "Loves guided tours, museums, and gaining deep insights into cultural significance",
    likes: [
      "Expert-led educational tours",
      "Historical research",
      "Academic discussions",
      "Detailed exhibitions"
    ],
    dislikes: [
      "Surface-level information",
      "Inaccurate historical facts",
      "Rushed explanations",
      "Entertainment over education"
    ],
    icon: "📚",
    value: 0
  }
];

export default function PersonaQuestionnaire() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<PersonaData[]>(initialPersonas);
  
  const progress = (personas.filter(p => p.value !== 0).length / personas.length) * 100;
  const allCompleted = personas.every(p => p.value !== 0);

  const updatePersonaValue = (id: string, value: number) => {
    setPersonas(prev => prev.map(persona => 
      persona.id === id ? { ...persona, value } : persona
    ));
  };

  const handleComplete = () => {
    const sortedPersonas = [...personas].sort((a, b) => b.value - a.value);
    const topPersonas = sortedPersonas.slice(0, 2);
    
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
      
      {/* Header Section with Progress */}
      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary font-medium text-sm">My Travel Persona</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Discover your{" "}
              <span className="text-primary">Travel Style</span>
            </h1>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Let's shape your travel persona so we can match you with heritage sites that truly fit your style.
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Your Progress</span>
            <span className="text-sm font-medium text-primary">
              {personas.filter(p => p.value !== 0).length}/{personas.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
      </div>

      {/* Personas List */}
      <div className="px-4 space-y-4 pb-24">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            id={persona.id}
            title={persona.title}
            description={persona.description}
            likes={persona.likes}
            dislikes={persona.dislikes}
            icon={persona.icon}
            value={persona.value}
            onChange={(value) => updatePersonaValue(persona.id, value)}
          />
        ))}
      </div>

      {/* Bottom CTA - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <Button
          onClick={handleComplete}
          disabled={!allCompleted}
          className="w-full py-4 text-base font-semibold rounded-full h-auto transition-smooth"
          variant={allCompleted ? "default" : "secondary"}
        >
          {allCompleted 
            ? "Create My Travel Persona" 
            : `Complete ${personas.filter(p => p.value === 0).length} more to continue`
          }
        </Button>
      </div>
    </div>
  );
}