import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Heart, Brain } from "lucide-react";
import { GENEVA_EMOTION_WHEEL, EmotionWheelData } from "@/lib/evaluationStorage";

interface GenevaEmotionWheelProps {
  value: EmotionWheelData | null;
  onChange: (data: EmotionWheelData) => void;
}

export function GenevaEmotionWheel({ value, onChange }: GenevaEmotionWheelProps) {
  const currentValues = value || {};

  const handleEmotionChange = (emotionPair: string, newValue: number[]) => {
    const updatedData = {
      ...currentValues,
      [emotionPair]: newValue[0]
    };
    onChange(updatedData);
  };

  const getEmotionKey = (negative: string, positive: string) => 
    `${negative.toLowerCase()}_${positive.toLowerCase()}`;

  const getValueLabel = (value: number) => {
    if (value === 0) return "Neutral";
    if (value > 0) return `+${value}`;
    return `${value}`;
  };

  const getSliderColor = (value: number) => {
    if (value === 0) return "bg-muted";
    if (value > 0) return "bg-sage";
    return "bg-coral";
  };

  return (
    <Card className="border-terracotta/20 bg-parchment/5">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-coral" />
          <Brain className="h-5 w-5 text-sage" />
        </div>
        <CardTitle className="text-xl text-terracotta-foreground">
          Geneva Emotion Wheel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Rate your emotions on a scale from -5 (negative) to +5 (positive)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {GENEVA_EMOTION_WHEEL.map((emotionPair, index) => {
            const emotionKey = getEmotionKey(emotionPair.negative, emotionPair.positive);
            const currentValue = currentValues[emotionKey] || 0;
            
            return (
              <div 
                key={emotionKey}
                className="space-y-3 p-4 rounded-lg border border-border/50 bg-card/50"
              >
                {/* Emotion Labels */}
                <div className="flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-coral/10 text-coral-foreground border-coral/30"
                  >
                    {emotionPair.negative}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-sage/10 text-sage-foreground border-sage/30"
                  >
                    {emotionPair.positive}
                  </Badge>
                </div>

                {/* Horizontal Bipolar Scale */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-5</span>
                    <span className={`font-medium ${
                      currentValue === 0 ? 'text-muted-foreground' :
                      currentValue > 0 ? 'text-sage-foreground' : 'text-coral-foreground'
                    }`}>
                      {getValueLabel(currentValue)}
                    </span>
                    <span>+5</span>
                  </div>
                  
                  <Slider
                    value={[currentValue]}
                    onValueChange={(newValue) => handleEmotionChange(emotionKey, newValue)}
                    min={-5}
                    max={5}
                    step={1}
                    className="w-full"
                  />

                  {/* Scale markers */}
                  <div className="flex justify-between text-xs text-muted-foreground/60">
                    {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((marker) => (
                      <span 
                        key={marker} 
                        className={`w-1 ${currentValue === marker ? 'text-foreground font-bold' : ''}`}
                      >
                        {marker === 0 ? '0' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {Object.keys(currentValues).length} of {GENEVA_EMOTION_WHEEL.length} emotion pairs rated
          </p>
        </div>
      </CardContent>
    </Card>
  );
}