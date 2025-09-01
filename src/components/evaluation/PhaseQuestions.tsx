import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, FileText } from "lucide-react";
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
      case 'pre-visit': return 'Pre-Visit';
      case 'post-visit': return 'Post Visit';
      case '24h-after': return '24 Hours After Visit';
      default: return 'Evaluation';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'pre-visit': return 'bg-olive/20 text-olive-foreground border-olive/30';
      case 'post-visit': return 'bg-terracotta/20 text-terracotta-foreground border-terracotta/30';
      case '24h-after': return 'bg-sage/20 text-sage-foreground border-sage/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case 'pre-visit': return <FileText className="h-5 w-5" />;
      case 'post-visit': return <Activity className="h-5 w-5" />;
      case '24h-after': return <Heart className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Card className="border-parchment/30 bg-parchment/5">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          {getPhaseIcon()}
          <Badge className={`${getPhaseColor()} px-4 py-2`}>
            {getPhaseTitle()}
          </Badge>
        </div>
        <CardTitle className="text-xl text-terracotta-foreground">
          Micro-Diary Study
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please answer both questions thoughtfully based on your experience
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                question.type === 'feeling' 
                  ? 'bg-coral/10 text-coral' 
                  : 'bg-sage/10 text-sage'
              }`}>
                {question.type === 'feeling' ? (
                  <Heart className="h-5 w-5" />
                ) : (
                  <Activity className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {question.type === 'feeling' ? 'Sentimental/Emotional' : 'Behavioral/Interactive'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Question {index + 1}</span>
                </div>
                <Label htmlFor={question.id} className="text-sm font-medium leading-relaxed block">
                  {question.text}
                </Label>
              </div>
            </div>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={responses[question.id as keyof typeof responses] || ''}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className="min-h-[120px] resize-none border-parchment/30 focus:border-terracotta/50"
              rows={4}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}