import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ScheduledVisit } from '@/lib/visitStorage';
import { getCurrentEvaluationPhase, canEvaluateVisit, getEvaluationUrl } from '@/lib/studyVisitHelpers';

interface StudyVisitCardProps {
  visit: ScheduledVisit;
}

export function StudyVisitCard({ visit }: StudyVisitCardProps) {
  const navigate = useNavigate();
  
  const currentPhase = getCurrentEvaluationPhase(visit);
  const canEvaluate = canEvaluateVisit(visit);
  const evaluationUrl = getEvaluationUrl(visit);
  
  const completedPhases = Object.entries(visit.studyPhases)
    .filter(([_, phase]) => phase.completed).length;
  
  const progress = (completedPhases / 3) * 100;
  
  const getPhaseStatus = (phaseName: keyof typeof visit.studyPhases) => {
    const phase = visit.studyPhases[phaseName];
    if (phase.completed) return 'completed';
    if (currentPhase === phaseName) return 'current';
    return 'pending';
  };
  
  const getPhaseIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-sage" />;
      case 'current': return <AlertCircle className="h-4 w-4 text-terracotta" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getStatusColor = () => {
    if (progress === 100) return 'bg-sage text-sage-foreground';
    if (canEvaluate) return 'bg-terracotta text-terracotta-foreground';
    return 'bg-olive text-olive-foreground';
  };
  
  return (
    <Card className="border-parchment/30 bg-parchment/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-terracotta-foreground">
              {visit.destinationSite}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {visit.destinationCity}, {visit.destinationCountry}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(visit.visitDate), 'PPP')}
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {canEvaluate ? 'Ready to Evaluate' : `${completedPhases}/3 Complete`}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Study Progress</span>
            <span className="text-terracotta-foreground font-medium">
              {completedPhases}/3 phases
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Phase Status */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {(['pre-visit', 'post-visit', '24h-after'] as const).map((phaseName) => {
            const status = getPhaseStatus(phaseName);
            return (
              <div 
                key={phaseName}
                className={`flex items-center gap-1 p-2 rounded border ${
                  status === 'current' ? 'border-terracotta/30 bg-terracotta/10' :
                  status === 'completed' ? 'border-sage/30 bg-sage/10' :
                  'border-muted bg-muted/20'
                }`}
              >
                {getPhaseIcon(status)}
                <span className="capitalize">
                  {phaseName.replace('-', ' ').replace('24h', '24h')}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Action Button */}
        {canEvaluate && evaluationUrl && (
          <Button 
            onClick={() => navigate(evaluationUrl)}
            className="w-full"
          >
            Continue {currentPhase?.replace('-', ' ').replace('24h', '24 Hours')} Evaluation
          </Button>
        )}
        
        {progress === 100 && (
          <div className="text-center text-sm text-sage font-medium">
            ✓ All evaluations completed
          </div>
        )}
      </CardContent>
    </Card>
  );
}