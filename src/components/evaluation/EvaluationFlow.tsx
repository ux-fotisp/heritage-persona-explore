import { useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PhaseQuestions } from "./PhaseQuestions";
import { EmotionWheel } from "./EmotionWheel";
import { UEQSForm } from "./UEQSForm";
import { 
  EvaluationEntry, 
  EmotionWheelData, 
  UEQSResponse, 
  saveEvaluationEntry,
  hasCompletedPhase 
} from "@/lib/evaluationStorage";
import { getScheduledVisits } from "@/lib/visitStorage";
import { HERITAGE_SITES } from "@/data/heritageSites";

export default function EvaluationFlow() {
  const navigate = useNavigate();
  const { visitId } = useParams<{ visitId: string }>();
  const [searchParams] = useSearchParams();
  const phase = (searchParams.get("phase") || "pre-visit") as EvaluationEntry['phase'];

  const visit = useMemo(() => 
    getScheduledVisits().find(v => v.id === visitId), [visitId]
  );

  const site = useMemo(() => 
    visit ? HERITAGE_SITES.find(s => s.id === visit.destinationId) : null, [visit]
  );

  const [questionResponses, setQuestionResponses] = useState({
    feeling: '',
    behavior: ''
  });
  const [emotionWheel, setEmotionWheel] = useState<EmotionWheelData | null>(null);
  const [ueqsResponses, setUEQSResponses] = useState<UEQSResponse>({});
  const [comments, setComments] = useState('');

  const requiresUEQS = phase === 'post-visit' || phase === '24h-after';
  const allQuestionsAnswered = questionResponses.feeling.trim() && questionResponses.behavior.trim();
  const ueqsComplete = !requiresUEQS || Object.keys(ueqsResponses).length === 8;
  const canSubmit = allQuestionsAnswered && emotionWheel && ueqsComplete;

  const handleSubmit = async () => {
    if (!visit || !site || !canSubmit) {
      toast.error("Please complete all required fields");
      return;
    }

    // Check if this phase was already completed
    if (hasCompletedPhase(visitId!, phase)) {
      toast.error("You have already completed this evaluation phase");
      return;
    }

    const entry: EvaluationEntry = {
      id: `${visitId}-${phase}-${Date.now()}`,
      visitId: visitId!,
      siteId: site.id,
      phase,
      questionResponses,
      emotionWheel,
      ueqsResponses: requiresUEQS ? ueqsResponses : undefined,
      comments: comments.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    const success = saveEvaluationEntry(entry);
    if (success) {
      toast.success("Evaluation submitted successfully!");
      navigate(-1);
    } else {
      toast.error("Failed to save evaluation. Please try again.");
    }
  };

  if (!visit || !site) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader backPath="/profile" />
        <div className="p-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Visit not found. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'pre-visit': return 'bg-sage text-sage-foreground';
      case 'post-visit': return 'bg-coral text-coral-foreground';
      case '24h-after': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader backPath="/profile" />
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{site.name}</h1>
            <Badge className={getPhaseColor()}>{phase}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {visit.destinationCity}, {visit.destinationCountry}
          </p>
        </div>

        {/* Phase Questions */}
        <PhaseQuestions
          phase={phase}
          responses={questionResponses}
          onChange={setQuestionResponses}
        />

        {/* Emotion Wheel */}
        <EmotionWheel
          value={emotionWheel}
          onChange={setEmotionWheel}
        />

        {/* UEQ-S Form (only for post-visit and 24h-after) */}
        {requiresUEQS && (
          <>
            <Separator />
            <UEQSForm
              responses={ueqsResponses}
              onChange={setUEQSResponses}
            />
          </>
        )}

        {/* Additional Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="comments" className="text-sm">
              Anything else you'd like to share? (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Share any additional thoughts..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="flex-1"
          >
            Submit Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
}