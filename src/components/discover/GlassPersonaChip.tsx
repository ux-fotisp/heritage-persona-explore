import { cn } from "@/lib/utils";
import { PersonaDefinition } from "@/lib/recommendationEngine";

interface GlassPersonaChipProps {
  persona: PersonaDefinition;
  isActive: boolean;
  matchCount: number;
  isUserPersona?: boolean;
  onClick: () => void;
}

export function GlassPersonaChip({
  persona,
  isActive,
  matchCount,
  isUserPersona = false,
  onClick,
}: GlassPersonaChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1.5 px-5 py-4 rounded-xl",
        "min-w-[120px] transition-all duration-300 ease-out flex-shrink-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Glass effect base
        "backdrop-blur-xl border",
        isActive
          ? "glass-active bg-primary/15 border-primary/30 shadow-lg scale-105"
          : "glass bg-card/40 border-border/50 hover:bg-card/60 hover:scale-102",
        isActive && "glass-glow",
        isUserPersona && !isActive && "ring-1 ring-primary/20"
      )}
      aria-pressed={isActive}
      aria-label={`Filter by ${persona.name}, ${matchCount} sites`}
    >
      {/* User's persona indicator */}
      {isUserPersona && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
      )}

      {/* Icon */}
      <span className="text-3xl" role="img" aria-hidden="true">
        {persona.icon}
      </span>

      {/* Name */}
      <span
        className={cn(
          "text-xs font-medium whitespace-nowrap",
          isActive ? "text-primary" : "text-foreground"
        )}
      >
        {persona.name}
      </span>

      {/* Match count badge */}
      <span
        className={cn(
          "text-[10px] px-2 py-0.5 rounded-full",
          isActive
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {matchCount} sites
      </span>
    </button>
  );
}
