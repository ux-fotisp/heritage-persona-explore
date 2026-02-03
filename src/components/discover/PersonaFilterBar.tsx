import { cn } from "@/lib/utils";
import { GlassPersonaChip } from "./GlassPersonaChip";
import { PERSONA_DEFINITIONS, PersonaDefinition } from "@/lib/recommendationEngine";
import { PersonaData } from "@/lib/personaStorage";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonaFilterBarProps {
  activeFilters: string[];
  matchCounts: Record<string, number>;
  userPersonas: PersonaData[];
  onToggleFilter: (personaId: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export function PersonaFilterBar({
  activeFilters,
  matchCounts,
  userPersonas,
  onToggleFilter,
  onClearFilters,
  className,
}: PersonaFilterBarProps) {
  const userPersonaIds = userPersonas.map((p) => p.id);

  // Sort personas: user's personas first, then alphabetically
  const sortedPersonas = [...PERSONA_DEFINITIONS].sort((a, b) => {
    const aIsUser = userPersonaIds.includes(a.id);
    const bIsUser = userPersonaIds.includes(b.id);
    if (aIsUser && !bIsUser) return -1;
    if (!aIsUser && bIsUser) return 1;
    return a.name.localeCompare(b.name);
  });

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            🎯 Filter by Persona
          </span>
          {userPersonas.length > 0 && (
            <span className="text-xs text-muted-foreground">
              (Your style highlighted)
            </span>
          )}
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Scrollable persona chips */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {sortedPersonas.map((persona) => (
            <GlassPersonaChip
              key={persona.id}
              persona={persona}
              isActive={activeFilters.includes(persona.id)}
              matchCount={matchCounts[persona.id] || 0}
              isUserPersona={userPersonaIds.includes(persona.id)}
              onClick={() => onToggleFilter(persona.id)}
            />
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
          <span>Showing sites matching:</span>
          <div className="flex gap-1">
            {activeFilters.map((id) => {
              const persona = PERSONA_DEFINITIONS.find((p) => p.id === id);
              return persona ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                >
                  {persona.icon} {persona.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
