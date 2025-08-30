import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { EMOTION_WHEEL, EmotionWheelData } from "@/lib/evaluationStorage";

interface EmotionWheelProps {
  value: EmotionWheelData | null;
  onChange: (data: EmotionWheelData) => void;
}

export function EmotionWheel({ value, onChange }: EmotionWheelProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string>(value?.emotion || '');
  const [intensity, setIntensity] = useState<number[]>([value?.intensity || 5]);

  const handleEmotionSelect = (emotion: string, opposing: string) => {
    setSelectedEmotion(emotion);
    const newData: EmotionWheelData = {
      emotion,
      intensity: intensity[0],
      opposingEmotion: opposing
    };
    onChange(newData);
  };

  const handleIntensityChange = (newIntensity: number[]) => {
    setIntensity(newIntensity);
    if (selectedEmotion) {
      const emotionData = EMOTION_WHEEL.find(e => e.emotion === selectedEmotion);
      if (emotionData) {
        const newData: EmotionWheelData = {
          emotion: selectedEmotion,
          intensity: newIntensity[0],
          opposingEmotion: emotionData.opposing
        };
        onChange(newData);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Emotion Wheel</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select the emotion that best represents your feeling
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Emotion Wheel Grid */}
        <div className="grid grid-cols-2 gap-3">
          {EMOTION_WHEEL.map((emotionPair) => (
            <div key={emotionPair.emotion} className="space-y-2">
              <button
                onClick={() => handleEmotionSelect(emotionPair.emotion, emotionPair.opposing)}
                className={`w-full p-3 rounded-lg border-2 transition-all ${
                  selectedEmotion === emotionPair.emotion
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="text-sm font-medium">{emotionPair.emotion}</div>
                <div className="text-xs text-muted-foreground">vs {emotionPair.opposing}</div>
              </button>
            </div>
          ))}
        </div>

        {/* Selected Emotion Display */}
        {selectedEmotion && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected:</span>
              <Badge variant="secondary">{selectedEmotion}</Badge>
            </div>
            
            {/* Intensity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Intensity</span>
                <span className="font-medium">{intensity[0]}/10</span>
              </div>
              <Slider
                value={intensity}
                onValueChange={handleIntensityChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Intense</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}