import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

export function MatchScoreBadge({
  score,
  size = "md",
  animated = true,
  showLabel = true,
  className,
}: MatchScoreBadgeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  // Animate count-up on mount
  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 600;
    const steps = 20;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(score, Math.round(increment * step));
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  // Color based on score
  const getScoreColor = () => {
    if (score >= 85) return "from-sage to-success";
    if (score >= 70) return "from-primary to-sage";
    if (score >= 50) return "from-coral to-primary";
    return "from-muted to-coral";
  };

  const getGlowClass = () => {
    if (score >= 80) return "glass-glow";
    return "";
  };

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-base",
  };

  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 5,
  };

  const radius = {
    sm: 16,
    md: 22,
    lg: 32,
  };

  const circumference = 2 * Math.PI * radius[size];
  const progress = ((100 - displayScore) / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        sizeClasses[size],
        getGlowClass(),
        className
      )}
    >
      {/* Background circle */}
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox={`0 0 ${(radius[size] + strokeWidth[size]) * 2} ${
          (radius[size] + strokeWidth[size]) * 2
        }`}
      >
        {/* Track */}
        <circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          className="text-muted/30"
        />
        {/* Progress */}
        <circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth[size]}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-500 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className={cn("stop-color-current", getScoreColor().split(" ")[0].replace("from-", "text-"))} stopColor="hsl(var(--sage))" />
            <stop offset="100%" className={cn("stop-color-current", getScoreColor().split(" ")[1].replace("to-", "text-"))} stopColor="hsl(var(--success))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="relative flex flex-col items-center justify-center text-center">
        <span className="font-bold text-foreground">{displayScore}%</span>
        {showLabel && size !== "sm" && (
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Match
          </span>
        )}
      </div>
    </div>
  );
}
