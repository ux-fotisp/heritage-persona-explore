import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        "transition-smooth hover:shadow-card cursor-pointer",
        value > 5 && "ring-2 ring-primary/20 bg-primary/5",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl" role="img" aria-label={title}>
            {icon}
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>

            {isExpanded && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {traits.map((trait) => (
                    <Badge 
                      key={trait} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  How much do you relate to this?
                </span>
                <span className={cn(
                  "text-sm font-semibold px-2 py-1 rounded-md",
                  value > 7 ? "bg-success/20 text-success-foreground" :
                  value > 4 ? "bg-primary/20 text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {value}/10
                </span>
              </div>
              
              <Slider
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                max={10}
                min={0}
                step={1}
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}