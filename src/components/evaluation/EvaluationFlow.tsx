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
import { FileText } from "lucide-react";
import { PhaseQuestions } from "./PhaseQuestions";
import { GenevaEmotionWheel } from "./GenevaEmotionWheel";
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
  const requiresEmotionWheel = phase === 'post-visit' || phase === '24h-after';
  const allQuestionsAnswered = questionResponses.feeling.trim() && questionResponses.behavior.trim();
  const ueqsComplete = !requiresUEQS || Object.keys(ueqsResponses).length === 8;
  const emotionWheelComplete = !requiresEmotionWheel || (emotionWheel && Object.keys(emotionWheel).length > 0);
  const canSubmit = allQuestionsAnswered && emotionWheelComplete && ueqsComplete;

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
      case 'pre-visit': return 'bg-olive text-olive-foreground';
      case 'post-visit': return 'bg-terracotta text-terracotta-foreground';
      case '24h-after': return 'bg-sage text-sage-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'pre-visit': return 'Share your thoughts and preparations before visiting';
      case 'post-visit': return 'Reflect on your immediate experience and feelings';
      case '24h-after': return 'Consider the lasting impact of your cultural experience';
      default: return 'Complete your evaluation';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment/10 via-background to-parchment/5">
      <AppHeader backPath="/profile" />
      <div className="px-4 py-6 space-y-8">
        {/* Infographic Header */}
        <div className="text-center space-y-4 bg-parchment/20 rounded-2xl p-6 border border-parchment/30">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-2xl font-bold text-terracotta-foreground">{site.name}</h1>
            <Badge className={`${getPhaseColor()} text-sm px-4 py-2`}>
              {phase.replace('-', ' ').replace('24h', '24 Hours')}
            </Badge>
          </div>
          <p className="text-terracotta-foreground/80 font-medium">
            {visit.destinationCity}, {visit.destinationCountry}
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {getPhaseDescription()}
          </p>
        </div>

        {/* Phase Questions */}
        <PhaseQuestions
          phase={phase}
          responses={questionResponses}
          onChange={setQuestionResponses}
        />

        {/* Geneva Emotion Wheel (only for post-visit and 24h-after) */}
        {requiresEmotionWheel && (
          <GenevaEmotionWheel
            value={emotionWheel}
            onChange={setEmotionWheel}
          />
        )}

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
        <Card className="border-parchment/30 bg-parchment/5">
          <CardHeader>
            <CardTitle className="text-lg text-terracotta-foreground flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Reflections
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Share any other thoughts or observations (Optional)
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              id="comments"
              placeholder="Any additional insights, feelings, or observations you'd like to share..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[100px] border-parchment/30 focus:border-terracotta/50"
              rows={4}
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