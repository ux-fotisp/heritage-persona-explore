import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/discover/MatchScoreBadge";
import { getPersonaDefinition } from "@/lib/recommendationEngine";

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
  isRecommended?: boolean;
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
  isRecommended = false,
  onAddToTrip,
  onRate,
  className,
}: SiteCardProps) {
  const getAccessibilityColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-success text-success-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "Low":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get persona icons for matched personas
  const matchedPersonaIcons = matchedPersonas
    ?.map((id) => getPersonaDefinition(id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        "hover:shadow-card hover:scale-[1.01]",
        isRecommended && "glass-glow ring-1 ring-primary/20",
        className
      )}
    >
      <div className="relative">
        <div
          className="h-48 bg-gradient-hero bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* Match Score Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <MatchScoreBadge
              score={matchScore}
              size="sm"
              animated={true}
              showLabel={false}
            />
          </div>

          {/* Accessibility Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <Badge className={getAccessibilityColor(accessibility)}>
              {accessibility} Access
            </Badge>
          </div>

          {/* Recommended glow overlay */}
          {isRecommended && (
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
          )}
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
          <Badge variant="secondary">{category}</Badge>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-warning" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>

        {/* Matched Personas Icons */}
        {matchedPersonaIcons && matchedPersonaIcons.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Matches:</span>
            <div className="flex gap-1">
              {matchedPersonaIcons.map((persona) => (
                <span
                  key={persona!.id}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-sm"
                  title={persona!.name}
                >
                  {persona!.icon}
                </span>
              ))}
            </div>
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
          <Button variant="outline" className="w-full" onClick={onAddToTrip}>
            <Plus className="h-4 w-4" />
            Add to Trip
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
