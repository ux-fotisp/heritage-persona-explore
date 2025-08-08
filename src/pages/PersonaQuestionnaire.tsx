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
    id: "archaeologist",
    title: "Archaeologist",
    description: "Seeks depth, not just sights. Fascinated by ancient civilizations, layered histories, and the stories buried beneath the surface.",
    likes: [
      "Ancient ruins",
      "Museums and archives",
      "Cultural preservation",
      "Historical Depth",
      "Hidden Trails",
      "Meanings in artifacts"
    ],
    dislikes: [
      "Leisure tourism",
      "Overly staged photo ops",
      "Trendy food spots",
      "Shoping Hubs",
      "Party Scenes",
      "Sports Activites"
    ],
    icon: "🏛️",
    value: 0
  },
  {
    id: "religious-seeker",
    title: "Religious Seeker",
    description: "Travels with purpose—seeking spiritual insight, sacred spaces, and deeper understanding of self through religious and cultural traditions.",
    likes: [
      "Pilgrimage paths",
      "Rituals & symbolism",
      "Quiet reflection",
      "Religious history",
      "Sacred sites",
      "Tranquil settings"
    ],
    dislikes: [
      "Crowded places",
      "Tourist spectacle zones",
      "Modern pop culture",
      "Party environments",
      "Sports tourism",
      "Fine dining trends"
    ],
    icon: "🙏",
    value: 0
  },
  {
    id: "art-seeker",
    title: "Art Seeker",
    description: "Travels to be inspired—drawn to galleries, exhibitions, and the beauty of human expression across time and cultures.",
    likes: [
      "Art exhibitions",
      "Fine arts & performances",
      "Learning from travel",
      "Local art scenes",
      "Cultural institutions",
      "Creative Spirit"
    ],
    dislikes: [
      "Sports Events",
      "Archaeological hotspots",
      "Culinary Tourism",
      "Party culture",
      "Shopping Malls",
      "Sea & sun tourism"
    ],
    icon: "🎨",
    value: 0
  },
  {
    id: "naturalist",
    title: "Naturalist",
    description: "Seeks peace in nature—drawn to quiet landscapes, fresh air, and moments of stillness that restore balance between body and spirit.",
    likes: [
      "Natural silence",
      "Fresh air & open skies",
      "Slow-paced walks",
      "Tranquil settings",
      "Scenic views",
      "Mindful solitude"
    ],
    dislikes: [
      "Loud environments",
      "Popular Malls",
      "Overcrowded landmarks",
      "Industrial areas",
      "Large cities",
      "Mass tourism spots"
    ],
    icon: "🌿",
    value: 0
  },
  {
    id: "gourmand",
    title: "Gourmand",
    description: "Travels to indulge—drawn to refined tastes, exclusive experiences, and the joy of savoring life through food, drink, and high-end social scenes.",
    likes: [
      "Fine Dining",
      "Elite destinations",
      "Wine tastings",
      "Yacht parties",
      "Culinary artistry",
      "Celebrity events"
    ],
    dislikes: [
      "Quiet retreats",
      "Traditional folk events",
      "Last-minute deals",
      "Take-away meals",
      "Budget travel",
      "Rustic simplicity"
    ],
    icon: "🍷",
    value: 0
  },
  {
    id: "traditionalist",
    title: "Traditionalist",
    description: "Travels to live like a local—drawn to authentic experiences, native customs, and the everyday rhythms of real communities.",
    likes: [
      "Living like native",
      "Meeting Locals",
      "Local Cuisine",
      "Speaking the language",
      "Off-map villages",
      "Cultural Immersion"
    ],
    dislikes: [
      "Tourist routes",
      "Over-curated experiences",
      "Modern Entertainment",
      "Big Club Venues",
      "VIP Parties",
      "Branded shopping areas"
    ],
    icon: "🏘️",
    value: 0
  },
  {
    id: "viral-seeker",
    title: "Viral Seeker",
    description: "Travels for the thrill and the spotlight—drawn to iconic landmarks, nightlife, and the kind of moments that light up social feeds.",
    likes: [
      "City highlights",
      "Nightlife & parties",
      "Trendy clubs",
      "Famous landmarks",
      "Viral moments",
      "Social events"
    ],
    dislikes: [
      "Nature Trails",
      "Heritage Immersion",
      "Cultural deep dives",
      "Quiet retreats",
      "Traditional Events",
      "Rural escapes"
    ],
    icon: "📱",
    value: 0
  },
  {
    id: "leisure-seeker",
    title: "Leisure Seeker",
    description: "Travels to unwind—drawn to warm places, peaceful settings, and activities that nourish the body and calm the mind.",
    likes: [
      "Sunbathing",
      "Warm Destinations",
      "Relaxation Spots",
      "Fitness & Wellness",
      "Outdoor Sports",
      "Beach Time"
    ],
    dislikes: [
      "Cultural events",
      "Knowledge travel",
      "Educational tours",
      "Urban sightseeing",
      "Packed itineraries",
      "Museums & galleries"
    ],
    icon: "🏖️",
    value: 0
  }
];

export default function PersonaQuestionnaire() {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<PersonaData[]>(initialPersonas);
  const [hasInteracted, setHasInteracted] = useState<Set<string>>(new Set());
  
  const progress = (hasInteracted.size / personas.length) * 100;
  const allCompleted = hasInteracted.size === personas.length;

  const updatePersonaValue = (id: string, value: number) => {
    setPersonas(prev => prev.map(persona => 
      persona.id === id ? { ...persona, value } : persona
    ));
    setHasInteracted(prev => new Set([...prev, id]));
  };

  const handleComplete = () => {
    const sortedPersonas = [...personas].sort((a, b) => b.value - a.value);
    const topPersonas = sortedPersonas.slice(0, 3); // Show top 3 for better selection
    
    navigate("/persona-selection", { 
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
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
              Let's shape your travel persona so we can match you with heritage sites that truly fit your style. Take a moment to reflect on each travel persona. Which ones feel most like you—and which don't? Your ratings will help us fine-tune your cultural journey to match what truly resonates with you.
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Your Progress</span>
            <span className="text-sm font-medium text-primary">
              {hasInteracted.size}/{personas.length}
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
      <div className={`${allCompleted ? 'fixed bottom-8' : 'fixed bottom-0'} left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4`}>
        <Button
          onClick={handleComplete}
          disabled={!allCompleted}
          className="w-full py-4 text-base font-semibold rounded-full h-auto transition-smooth"
          variant={allCompleted ? "default" : "secondary"}
        >
          {allCompleted 
            ? "Create My Travel Persona" 
            : `Complete ${personas.length - hasInteracted.size} more to continue`
          }
        </Button>
      </div>
    </div>
  );
}