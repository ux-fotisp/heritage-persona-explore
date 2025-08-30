import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity } from "lucide-react";
import { PHASE_QUESTIONS, EvaluationQuestion } from "@/lib/evaluationStorage";

interface PhaseQuestionsProps {
  phase: 'pre-visit' | 'post-visit' | '24h-after';
  responses: { feeling: string; behavior: string };
  onChange: (responses: { feeling: string; behavior: string }) => void;
}

export function PhaseQuestions({ phase, responses, onChange }: PhaseQuestionsProps) {
  const questions = PHASE_QUESTIONS[phase];

  const handleResponseChange = (questionId: string, value: string) => {
    onChange({
      ...responses,
      [questionId]: value
    });
  };

  const getPhaseTitle = () => {
    switch (phase) {
      case 'pre-visit': return 'Before Your Visit';
      case 'post-visit': return 'Right After Your Visit';
      case '24h-after': return '24 Hours Later';
      default: return 'Evaluation';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'pre-visit': return 'bg-sage/20 text-sage-foreground border-sage/30';
      case 'post-visit': return 'bg-coral/20 text-coral-foreground border-coral/30';
      case '24h-after': return 'bg-primary/20 text-primary-foreground border-primary/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getPhaseTitle()}</CardTitle>
          <Badge className={getPhaseColor()}>{phase}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Share your thoughts and experiences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-center gap-2">
              {question.type === 'feeling' ? (
                <Heart className="h-4 w-4 text-coral" />
              ) : (
                <Activity className="h-4 w-4 text-sage" />
              )}
              <Label htmlFor={question.id} className="text-sm font-medium">
                {question.text}
              </Label>
            </div>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={responses[question.id as keyof typeof responses] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}