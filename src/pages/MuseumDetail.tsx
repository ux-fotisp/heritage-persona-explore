import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, MapPin, Ticket, Share2, Heart, Navigation, 
  Calendar, Users, Camera, Book, Sparkles, Instagram,
  Facebook, Twitter, Globe, ExternalLink, Star
} from "lucide-react";
import { getPersona } from "@/lib/personaStorage";
import { toast } from "sonner";
import { AddToTripModal } from "@/components/trip/AddToTripModal";

// ACUX Typology Personas for Cultural Heritage
const ACUX_PERSONAS = {
  "art-lover": {
    id: "art-lover",
    title: "Art Lover",
    icon: "🎨",
    traits: ["Visual aesthetics", "Artistic expression", "Creativity"],
    recommendations: [
      {
        title: "Sculpture Collection Tour",
        description: "Explore masterpieces of ancient Greek sculpture including the Poseidon of Artemision",
        duration: "90 minutes",
        highlight: "Perfect for visual appreciation"
      },
      {
        title: "Pottery & Ceramics Workshop",
        description: "Nearby: Ancient Agora Museum - hands-on experience with traditional pottery",
        location: "2.5 km away"
      }
    ]
  },
  "history-enthusiast": {
    id: "history-enthusiast",
    title: "History Enthusiast",
    icon: "📚",
    traits: ["Historical context", "Storytelling", "Deep knowledge"],
    recommendations: [
      {
        title: "Chronological Journey",
        description: "Follow the comprehensive timeline from prehistory through late antiquity",
        duration: "2-3 hours",
        highlight: "Rich historical narratives"
      },
      {
        title: "Acropolis Museum",
        description: "Complete your journey at this complementary site showcasing Classical Athens",
        location: "2.8 km away"
      }
    ]
  },
  "experience-seeker": {
    id: "experience-seeker",
    title: "Experience Seeker",
    icon: "✨",
    traits: ["Immersive experiences", "Interactive engagement", "Memorable moments"],
    recommendations: [
      {
        title: "Virtual Reality Tour",
        description: "Experience ancient Greece in VR with interactive reconstructions",
        duration: "45 minutes",
        highlight: "Cutting-edge technology"
      },
      {
        title: "Guided Theatrical Tour",
        description: "Actors bring historical figures to life in this unique performance tour",
        duration: "2 hours"
      }
    ]
  },
  "social-explorer": {
    id: "social-explorer",
    title: "Social Explorer",
    icon: "👥",
    traits: ["Social connections", "Group experiences", "Sharing moments"],
    recommendations: [
      {
        title: "Group Discovery Tour",
        description: "Join fellow explorers for a collaborative learning experience",
        duration: "2 hours",
        highlight: "Make new connections"
      },
      {
        title: "Photo Walk Experience",
        description: "Instagram-worthy spots and professional photography tips",
        duration: "90 minutes"
      }
    ]
  },
  "knowledge-collector": {
    id: "knowledge-collector",
    title: "Knowledge Collector",
    icon: "🔍",
    traits: ["Deep learning", "Documentation", "Research"],
    recommendations: [
      {
        title: "Curator-Led Deep Dive",
        description: "Expert-guided tour with exclusive insights and recent discoveries",
        duration: "3 hours",
        highlight: "Expert knowledge"
      },
      {
        title: "Archaeological Research Library",
        description: "Access to scholarly resources and research materials",
        duration: "By appointment"
      }
    ]
  }
};

export default function MuseumDetail() {
  const navigate = useNavigate();
  const [userPersona, setUserPersona] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  
  // Hardcoded site ID for the National Archaeological Museum
  const siteId = "national-archaeological-museum";

  useEffect(() => {
    const persona = getPersona();
    if (persona) {
      setUserPersona(persona.id);
    }
  }, []);

  const handleAddToTrip = () => {
    setShowTripModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'National Archaeological Museum',
          text: 'Check out this amazing cultural heritage site!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const currentPersona = userPersona ? ACUX_PERSONAS[userPersona as keyof typeof ACUX_PERSONAS] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Museum Branding */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                ←
              </Button>
              <div>
                <h1 className="text-lg font-bold text-foreground">National Archaeological Museum</h1>
                <p className="text-xs text-muted-foreground">Athens, Greece</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFavorite}
                className={isFavorite ? "text-coral" : ""}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-coral" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=2000"
          alt="National Archaeological Museum of Athens"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
          <div className="container mx-auto">
            <Badge className="mb-3 bg-primary/20 text-primary-foreground border-primary/30">
              UNESCO Heritage Site
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              National Archaeological Museum
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The World's Finest Collection of Ancient Greek Artifacts
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-warning text-warning" />
                <span className="font-semibold text-foreground">4.8</span>
                <span className="text-muted-foreground text-sm">(12,450 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Personalization Banner */}
        {currentPersona && (
          <Card className="border-primary/30 bg-gradient-primary p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{currentPersona.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                  <h3 className="text-xl font-bold text-primary-foreground">
                    Personalized for {currentPersona.title}
                  </h3>
                </div>
                <p className="text-primary-foreground/90 mb-4">
                  We've curated special recommendations based on your cultural interests and preferences.
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentPersona.traits.map((trait, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Description */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-4">About This Heritage Site</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-4">
              The National Archaeological Museum in Athens houses some of the most important artifacts from a variety 
              of archaeological locations around Greece from prehistory to late antiquity. It is considered one of the 
              greatest museums in the world and contains the richest collection of Greek Antiquity artifacts globally.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded at the end of the 19th century, the museum was the first purpose-built museum in Greece. Its 
              mission is to preserve, conserve, exhibit, and study the most important archaeological finds from all 
              areas of Greece, thus contributing to the understanding of Greek history and culture from prehistoric 
              times through the Roman period.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The museum's collections include the Prehistoric Collection, the Sculpture Collection, the Vase and 
              Minor Objects Collection, the Metallurgy Collection, and the Egyptian and Near Eastern Antiquities 
              Collection. Highlights include the Mask of Agamemnon, the Antikythera mechanism, and the bronze statue 
              of Poseidon or Zeus.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            size="lg" 
            className="h-14 text-base" 
            variant="hero"
            onClick={handleAddToTrip}
          >
            <Calendar className="mr-2" />
            Add to Trip
          </Button>
          <Button 
            size="lg" 
            className="h-14 text-base" 
            variant="sage"
            onClick={() => window.open('https://maps.google.com/?q=National+Archaeological+Museum+Athens', '_blank')}
          >
            <Navigation className="mr-2" />
            Get Directions
          </Button>
          <Button 
            size="lg" 
            className="h-14 text-base" 
            variant="coral"
            onClick={() => window.open('https://www.namuseum.gr/en/book-ticket/', '_blank')}
          >
            <Ticket className="mr-2" />
            Book Tickets
          </Button>
        </section>

        {/* Visiting Information */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-6">Plan Your Visit</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">Opening Hours</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday</span>
                      <span className="font-medium text-foreground">13:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tuesday - Sunday</span>
                      <span className="font-medium text-foreground">08:00 - 20:00</span>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-xs italic">*Hours may vary on public holidays</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-sage mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">Visit Duration</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Quick Tour</span>
                      <Badge variant="outline">1.5 - 2 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Standard Visit</span>
                      <Badge variant="outline">3 - 4 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">In-depth Exploration</span>
                      <Badge variant="outline">Full day</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-coral mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">Location & Access</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>44 Patission Street</p>
                    <p>Athens 10682, Greece</p>
                    <Separator className="my-2" />
                    <p className="font-medium text-foreground">Metro: Victoria Station (Line 1)</p>
                    <p className="text-xs">5 minute walk from station</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Ticket className="h-6 w-6 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">Admission</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">General Admission</span>
                      <span className="font-bold text-foreground">€12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reduced Admission</span>
                      <span className="font-bold text-foreground">€6</span>
                    </div>
                    <Separator className="my-2" />
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-primary"
                      onClick={() => window.open('https://www.namuseum.gr/en/book-ticket/', '_blank')}
                    >
                      Book online tickets
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Personalized Recommendations */}
        {currentPersona && (
          <section>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Recommended Experiences for You
            </h3>
            <p className="text-muted-foreground mb-6">
              Based on your {currentPersona.title} profile, we suggest these curated experiences
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPersona.recommendations.map((rec, idx) => (
                <Card key={idx} className="p-6 hover:shadow-soft transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {idx === 0 ? <Book className="h-6 w-6 text-primary" /> : <Camera className="h-6 w-6 text-sage" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.duration && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {rec.duration}
                          </Badge>
                        )}
                        {rec.location && (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {rec.location}
                          </Badge>
                        )}
                        {rec.highlight && (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            {rec.highlight}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Connect & Share */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-6">Connect & Stay Updated</h3>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Official Links</h4>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://www.namuseum.gr/en/', '_blank')}
                  >
                    <Globe className="mr-3 h-5 w-5" />
                    Official Website
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('https://www.namuseum.gr/en/book-ticket/', '_blank')}
                  >
                    <Ticket className="mr-3 h-5 w-5" />
                    Book Tickets
                    <ExternalLink className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://www.instagram.com/nationalarchaeologicalmuseum/', '_blank')}
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Instagram
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://www.facebook.com/National-Archaeological-Museum-Athens/', '_blank')}
                  >
                    <Facebook className="mr-2 h-5 w-5" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://twitter.com/', '_blank')}
                  >
                    <Twitter className="mr-2 h-5 w-5" />
                    Twitter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Visitor Tips */}
        <section>
          <h3 className="text-2xl font-bold text-foreground mb-6">Visitor Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-l-4 border-l-primary">
              <h4 className="font-semibold text-foreground mb-2">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">
                Weekday mornings (Tuesday-Thursday) are less crowded. Avoid Sundays when admission is free.
              </p>
            </Card>
            <Card className="p-5 border-l-4 border-l-sage">
              <h4 className="font-semibold text-foreground mb-2">Photography</h4>
              <p className="text-sm text-muted-foreground">
                Photography allowed without flash. Perfect for capturing ancient artifacts in natural museum lighting.
              </p>
            </Card>
            <Card className="p-5 border-l-4 border-l-coral">
              <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
              <p className="text-sm text-muted-foreground">
                Wheelchair accessible with elevators. Audio guides available in multiple languages.
              </p>
            </Card>
          </div>
        </section>
      </div>

      <AddToTripModal
        open={showTripModal}
        onOpenChange={setShowTripModal}
        siteId={siteId}
        siteName="National Archaeological Museum"
      />
    </div>
  );
}
