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
      description: "Discover cultural sites that align with your unique persona and interests"
    },
    {
      icon: <MapPin className="h-8 w-8 text-sage" />,
      title: "Curated Recommendations", 
      description: "Explore handpicked heritage sites based on your cultural preferences"
    },
    {
      icon: <Calendar className="h-8 w-8 text-coral" />,
      title: "Smart Trip Planning",
      description: "Plan meaningful cultural journeys with intelligent scheduling"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Experience Evaluation",
      description: "Reflect on and rate your cultural experiences for better recommendations"
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="text-lg px-8 py-6"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/discover")}
                className="text-lg px-8 py-6"
              >
                Explore Sites
                <MapPin className="h-5 w-5" />
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
          <Card className="bg-gradient-primary text-primary-foreground">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Ready to Begin Your Cultural Journey?
              </h2>
              <p className="text-primary-foreground/90 max-w-md mx-auto">
                Take our personality assessment to get personalized heritage site recommendations.
              </p>
              <Button 
                variant="secondary"
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="mt-4"
              >
                Get Started Now
                <Sparkles className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
