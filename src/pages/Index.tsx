import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Calendar, BarChart3, Sparkles, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Personality Matching",
      description: "Discover cultural sites that align with your unique character and interests"
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Tailor-mode recommendations", 
      description: "From restaurants to museums. And churches to festivals. Your likings define the results."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Trip Planning",
      description: "Choose your destination. Easily, clearly, based on you."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Experience Evaluation",
      description: "Our likings may chase and so do our travel choices. Rate and refine your results."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Globe className="h-4 w-4" />
                Cultural Heritage Explorer
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Discover Your
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Cultural Match
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find cultural heritage sites that resonate with your personality. 
                Plan visits, evaluate experiences, and grow your cultural understanding.
              </p>
            </div>

            <div className="flex flex-col gap-4 justify-center max-w-xs mx-auto">
              <Button 
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="text-lg px-8 py-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full"
              >
                Start your journey
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/discover")}
                className="text-lg px-8 py-4 border-2 border-foreground/20 text-foreground hover:bg-foreground/10 rounded-full"
              >
                Explore sites in your area
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-card transition-smooth cursor-pointer">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-xl group-hover:scale-110 transition-spring">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-card text-card-foreground border-0">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Are you ready to explore?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take a tour to explore what we offer and start today
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="mt-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-4"
              >
                Start your chat
              </Button>
            </CardContent>
          </Card>

          {/* Need Support Section */}
          <Card className="bg-card text-card-foreground border-0">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Need Support?
              </h2>
              <p className="text-muted-foreground">
                Contact us today by starting a chat
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/support")}
                className="mt-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-8 py-4"
              >
                Start your chat
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-8 text-sm text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              <a href="/about" className="hover:text-foreground transition-colors">
                About Us
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms & Services
              </a>
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/add-listings" className="hover:text-foreground transition-colors">
                Add your listings
              </a>
              <a href="/faq" className="hover:text-foreground transition-colors">
                FAQ
              </a>
              <a href="/fotis" className="hover:text-foreground transition-colors">
                FotisP
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
