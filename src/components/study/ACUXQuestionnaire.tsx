import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Palette, Brain, Activity, Heart } from 'lucide-react';
import { saveACUXPersonality, ACUXPersonality } from '@/lib/studyStorage';
import { useToast } from '@/hooks/use-toast';

interface ACUXQuestionnaireProps {
  onComplete: (personality: ACUXPersonality) => void;
}

// ACUX Typology Questions based on aesthetic, cognitive, behavioral, and affective dimensions
const ACUX_QUESTIONS = [
  // Aesthetic Dimension
  {
    id: 'aesthetic_1',
    category: 'aesthetic',
    text: 'I am drawn to the visual beauty and artistic elements of cultural sites',
    icon: Palette
  },
  {
    id: 'aesthetic_2',
    category: 'aesthetic',
    text: 'The architectural design and artistic details are very important to me when visiting heritage sites',
    icon: Palette
  },
  {
    id: 'aesthetic_3',
    category: 'aesthetic',
    text: 'I spend considerable time photographing and appreciating the visual aspects of cultural places',
    icon: Palette
  },
  {
    id: 'aesthetic_4',
    category: 'aesthetic',
    text: 'The aesthetic harmony and visual appeal of a place significantly influence my experience',
    icon: Palette
  },

  // Cognitive Dimension
  {
    id: 'cognitive_1',
    category: 'cognitive',
    text: 'I enjoy learning about the historical facts and context behind cultural heritage sites',
    icon: Brain
  },
  {
    id: 'cognitive_2',
    category: 'cognitive',
    text: 'Understanding the cultural significance and meaning of places is essential for my visit',
    icon: Brain
  },
  {
    id: 'cognitive_3',
    category: 'cognitive',
    text: 'I prefer guided tours or detailed information to fully comprehend what I am experiencing',
    icon: Brain
  },
  {
    id: 'cognitive_4',
    category: 'cognitive',
    text: 'I research extensively about a place before visiting to maximize my learning experience',
    icon: Brain
  },

  // Behavioral Dimension
  {
    id: 'behavioral_1',
    category: 'behavioral',
    text: 'I like to actively participate in cultural activities and hands-on experiences',
    icon: Activity
  },
  {
    id: 'behavioral_2',
    category: 'behavioral',
    text: 'I prefer interactive exhibits and activities over passive observation',
    icon: Activity
  },
  {
    id: 'behavioral_3',
    category: 'behavioral',
    text: 'I enjoy engaging with local people and participating in cultural practices',
    icon: Activity
  },
  {
    id: 'behavioral_4',
    category: 'behavioral',
    text: 'Physical exploration and movement through spaces enhance my cultural experience',
    icon: Activity
  },

  // Affective Dimension
  {
    id: 'affective_1',
    category: 'affective',
    text: 'I seek emotional connections and personal meaning in cultural heritage experiences',
    icon: Heart
  },
  {
    id: 'affective_2',
    category: 'affective',
    text: 'The atmosphere and emotional impact of a place are more important than facts or activities',
    icon: Heart
  },
  {
    id: 'affective_3',
    category: 'affective',
    text: 'I value the spiritual or emotional resonance I feel in cultural and heritage spaces',
    icon: Heart
  },
  {
    id: 'affective_4',
    category: 'affective',
    text: 'Personal reflection and emotional response are central to my cultural experiences',
    icon: Heart
  }
];

const CATEGORY_DESCRIPTIONS = {
  aesthetic: {
    title: 'Aesthetic Orientation',
    description: 'Focus on visual beauty, artistic elements, and aesthetic experience',
    color: 'text-purple-600'
  },
  cognitive: {
    title: 'Cognitive Orientation', 
    description: 'Emphasis on learning, understanding, and knowledge acquisition',
    color: 'text-blue-600'
  },
  behavioral: {
    title: 'Behavioral Orientation',
    description: 'Preference for active participation and hands-on experiences',
    color: 'text-green-600'
  },
  affective: {
    title: 'Affective Orientation',
    description: 'Focus on emotional connections and personal meaning-making',
    color: 'text-red-600'
  }
};

export function ACUXQuestionnaire({ onComplete }: ACUXQuestionnaireProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const currentQuestion = ACUX_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / ACUX_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === ACUX_QUESTIONS.length - 1;
  const canProceed = responses[currentQuestion.id] !== undefined;

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const personality = saveACUXPersonality(responses);
    if (personality) {
      toast({
        title: "Personality assessment complete!",
        description: `Your dominant type is: ${personality.dominantType}`
      });
      onComplete(personality);
    } else {
      toast({
        title: "Error saving assessment",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCategoryInfo = (category: string) => CATEGORY_DESCRIPTIONS[category as keyof typeof CATEGORY_DESCRIPTIONS];
  const categoryInfo = getCategoryInfo(currentQuestion.category);
  const IconComponent = currentQuestion.icon;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${categoryInfo.color}`} />
            ACUX Personality Assessment
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {ACUX_QUESTIONS.length}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className={`text-sm font-medium ${categoryInfo.color}`}>
            {categoryInfo.title}
          </div>
          <div className="text-sm text-muted-foreground">
            {categoryInfo.description}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQuestion.text}
          </h3>
          
          <RadioGroup
            value={responses[currentQuestion.id]?.toString() || ''}
            onValueChange={handleResponseChange}
            className="space-y-3"
          >
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <div key={value} className="flex flex-col items-center gap-2">
                  <RadioGroupItem 
                    value={value.toString()} 
                    id={`${currentQuestion.id}_${value}`}
                    className="w-6 h-6"
                  />
                  <Label 
                    htmlFor={`${currentQuestion.id}_${value}`}
                    className="text-xs cursor-pointer"
                  >
                    {value}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!canProceed}
            className="flex-1"
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}