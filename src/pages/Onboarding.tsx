import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Menu, ArrowLeft, Bell, Play } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <button className="p-3 rounded-full bg-surface/20 backdrop-blur-sm">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
        
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface/20 backdrop-blur-sm border border-border"
        >
          <ArrowLeft className="h-4 w-4 text-foreground" />
          <span className="text-foreground font-medium">Back</span>
        </button>
        
        <button className="p-3 rounded-full bg-surface/20 backdrop-blur-sm">
          <Bell className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center space-y-8 max-w-sm">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Play className="h-10 w-10 text-primary-foreground ml-1" />
          </div>
          
          {/* Badge */}
          <div className="inline-block px-6 py-2 rounded-full bg-surface/20 backdrop-blur-sm border border-border">
            <span className="text-muted-foreground font-medium">My Travel Persona</span>
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Discover your{" "}
              <span className="text-primary">Travel Style</span>
            </h1>
            
            <p className="text-muted-foreground leading-relaxed">
              Let's shape your travel persona so we can match you with heritage sites that truly fit your style.
            </p>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={() => navigate("/discover")}
            className="w-full py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-auto"
          >
            Create My Travel Persona
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}