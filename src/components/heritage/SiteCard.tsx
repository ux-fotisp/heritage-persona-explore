import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  duration: string;
  category: string;
  accessibility: "High" | "Medium" | "Low";
  rating: number;
  matchScore: number;
  matchedPersonas?: string[];
  onAddToTrip: () => void;
  onRate?: () => void;
  className?: string;
}

export function SiteCard({
  id,
  name,
  description,
  image,
  location,
  duration,
  category,
  accessibility,
  rating,
  matchScore,
  matchedPersonas,
  onAddToTrip,
  onRate,
  className
}: SiteCardProps) {
  const getAccessibilityColor = (level: string) => {
    switch (level) {
      case "High": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Low": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className={cn("overflow-hidden transition-smooth hover:shadow-card", className)}>
      <div className="relative">
        <div 
          className="h-48 bg-gradient-hero bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {matchScore}% Match
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={getAccessibilityColor(accessibility)}>
              {accessibility} Access
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {category}
          </Badge>
          
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-warning" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        {matchedPersonas && matchedPersonas.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Matched personas: {matchedPersonas.join(", ")}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="secondary"
            className="w-full"
            onClick={onRate}
            disabled={!onRate}
          >
            <Star className="h-4 w-4 mr-2" />
            Rate
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onAddToTrip}
          >
            <Plus className="h-4 w-4" />
            Add to Trip
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}