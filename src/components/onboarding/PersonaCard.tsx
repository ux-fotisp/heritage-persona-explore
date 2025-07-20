import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PersonaCardProps {
  id: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function PersonaCard({
  id,
  title,
  description,
  traits,
  icon,
  value,
  onChange,
  className
}: PersonaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={cn(
        "transition-all duration-300 border border-border bg-card hover:shadow-card",
        value > 0 && "ring-1 ring-primary/30 border-primary/20 bg-primary/[0.02]",
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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
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

        {/* Expanded Traits Section */}
        {isExpanded && (
          <div className="mb-4 animate-accordion-down">
            <div className="flex flex-wrap gap-2">
              {traits.map((trait) => (
                <Badge 
                  key={trait} 
                  variant="secondary" 
                  className="text-xs px-2 py-1 bg-secondary/60 text-secondary-foreground"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Slider Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              How much do you relate to this?
            </span>
            <div className={cn(
              "px-2 py-1 rounded-md text-xs font-semibold transition-colors",
              value === 0 ? "bg-muted/50 text-muted-foreground" :
              value <= 3 ? "bg-coral/20 text-coral-foreground" :
              value <= 6 ? "bg-secondary/30 text-secondary-foreground" :
              value <= 8 ? "bg-primary/20 text-primary-foreground" :
              "bg-success/20 text-success-foreground"
            )}>
              {value === 0 ? "Not rated" : `${value}/10`}
            </div>
          </div>
          
          <div className="relative">
            <Slider
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
              max={10}
              min={0}
              step={1}
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Scale markers */}
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-muted-foreground">0</span>
              <span className="text-xs text-muted-foreground">5</span>
              <span className="text-xs text-muted-foreground">10</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}