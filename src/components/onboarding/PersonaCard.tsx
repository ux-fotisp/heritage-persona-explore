import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PersonaCardProps {
  id: string;
  title: string;
  description: string;
  likes: string[];
  dislikes: string[];
  icon: string;
  value: number;
  onChange: (value: number) => void;
  onInteract?: () => void;
  isInteracted?: boolean;
  className?: string;
}

export function PersonaCard({
  id,
  title,
  description,
  likes,
  dislikes,
  icon,
  value,
  onChange,
  onInteract,
  isInteracted = false,
  className
}: PersonaCardProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded

  const getValueLabel = (val: number) => {
    if (val <= -3) return "Strongly Dislike";
    if (val <= -1) return "Dislike";
    if (val === 0) return "Neutral";
    if (val <= 2) return "Like";
    return "Strongly Like";
  };

  const getValueColor = (val: number) => {
    if (val <= -3) return "bg-destructive/20 text-destructive-foreground";
    if (val <= -1) return "bg-coral/20 text-coral-foreground";
    if (val === 0) return "bg-muted/50 text-muted-foreground";
    if (val <= 2) return "bg-primary/20 text-primary-foreground";
    return "bg-success/20 text-success-foreground";
  };

  // Handle clicking on a scale value
  const handleScaleClick = (selectedValue: number) => {
    onChange(selectedValue);
    if (onInteract && !isInteracted) {
      onInteract();
    }
  };

  // Scale values from -5 to 5
  const scaleValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  // Get color for each scale value based on position
  const getScaleValueColor = (val: number, isSelected: boolean) => {
    if (!isSelected) {
      return "bg-muted/50 text-muted-foreground hover:bg-muted";
    }
    if (val <= -3) return "bg-destructive text-destructive-foreground";
    if (val <= -1) return "bg-coral text-white";
    if (val === 0) return "bg-muted text-foreground";
    if (val <= 2) return "bg-primary/80 text-primary-foreground";
    return "bg-sage text-white";
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 border border-border bg-card hover:shadow-card",
        isInteracted && "ring-1 ring-primary/30 border-primary/20 bg-primary/[0.02]",
        className
      )}
    >
      <CardContent className="p-5">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl flex-shrink-0" role="img" aria-label={title}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground leading-tight mb-1">
                  {title}
                </h3>
                {isExpanded && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 p-1 rounded-md hover:bg-accent/50 transition-colors flex-shrink-0"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Likes/Dislikes Section */}
        {isExpanded && (
          <div className="mb-6 space-y-4 animate-accordion-down">
            {/* Likes Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Likes</h4>
              <div className="flex flex-wrap gap-2">
                {likes.map((like, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: '#31543F' }}
                  >
                    {like}
                  </span>
                ))}
              </div>
            </div>

            {/* Dislikes Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Dislikes</h4>
              <div className="flex flex-wrap gap-2">
                {dislikes.map((dislike, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: '#744444' }}
                  >
                    {dislike}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scale Selection Section */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                How much do you relate to this?
              </span>
              <div className={cn(
                "px-2 py-1 rounded-md text-xs font-semibold transition-colors",
                getValueColor(value)
              )}>
                {getValueLabel(value)}
              </div>
            </div>
            
            {/* Numbered Scale Choices */}
            <div className="space-y-2">
              <div className="grid grid-cols-11 gap-1">
                {scaleValues.map((scaleValue) => (
                  <button
                    key={scaleValue}
                    type="button"
                    onClick={() => handleScaleClick(scaleValue)}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-0.5 rounded-lg transition-all duration-200 min-h-[56px]",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1",
                      getScaleValueColor(scaleValue, value === scaleValue),
                      value === scaleValue 
                        ? "ring-2 ring-primary/50 shadow-md scale-105" 
                        : "hover:scale-102"
                    )}
                    aria-label={`Rate ${scaleValue}`}
                    aria-pressed={value === scaleValue}
                  >
                    <span className={cn(
                      "text-xs font-bold",
                      value === scaleValue ? "text-current" : "text-muted-foreground"
                    )}>
                      {scaleValue > 0 ? `+${scaleValue}` : scaleValue}
                    </span>
                    {/* Visual indicator dot */}
                    <span className={cn(
                      "w-2 h-2 rounded-full mt-1 transition-colors",
                      value === scaleValue 
                        ? "bg-current opacity-80" 
                        : "bg-muted-foreground/30"
                    )} />
                  </button>
                ))}
              </div>
              
              {/* Scale labels */}
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-muted-foreground font-medium">
                  Strongly Dislike
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Neutral
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Strongly Like
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}