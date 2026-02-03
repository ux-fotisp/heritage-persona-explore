import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showSteps?: boolean;
  totalSteps?: number;
  currentStep?: number;
  variant?: 'default' | 'enhanced';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, showSteps, totalSteps = 8, currentStep, variant = 'default', ...props }, ref) => {
  const isEnhanced = variant === 'enhanced';
  
  // Calculate gradient color based on progress
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'from-coral via-coral to-coral';
    if (progress < 50) return 'from-coral via-terracotta to-terracotta';
    if (progress < 75) return 'from-terracotta via-olive to-olive';
    return 'from-olive via-sage to-sage';
  };
  
  return (
    <div className={cn("relative", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full",
          isEnhanced ? "h-3 bg-muted/50 shadow-inner" : "h-2 bg-secondary"
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out",
            isEnhanced 
              ? `bg-gradient-to-r ${getProgressColor(value || 0)} shadow-sm` 
              : "bg-primary"
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {/* Step indicators for enhanced variant */}
      {isEnhanced && showSteps && (
        <div className="absolute inset-0 flex justify-between items-center px-0.5 pointer-events-none">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepProgress = ((i + 1) / totalSteps) * 100;
            const isCompleted = (value || 0) >= stepProgress;
            const isCurrent = currentStep === i + 1;
            
            return (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 z-10",
                  isCompleted 
                    ? "bg-primary-foreground/90 shadow-sm" 
                    : "bg-muted-foreground/30",
                  isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
