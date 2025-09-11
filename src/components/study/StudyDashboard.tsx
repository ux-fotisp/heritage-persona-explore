import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, BarChart3, Award, TrendingUp } from 'lucide-react';
import { getStudyParticipant, StudyParticipant } from '@/lib/studyStorage';
import { getStudyVisits, getVisitsWithPendingEvaluations, updateAllVisitPhases } from '@/lib/studyVisitHelpers';
import { generateStudyAnalytics, StudyAnalytics } from '@/lib/studyAnalytics';
import { generatePersonalizedRecommendations } from '@/lib/personalizedRecommendations';
import { StudyVisitCard } from './StudyVisitCard';
import { StudyAnalyticsDisplay } from './StudyAnalyticsDisplay';
import { PersonalizedRecommendations } from '../planner/PersonalizedRecommendations';

export function StudyDashboard() {
  const [participant, setParticipant] = useState<StudyParticipant | null>(null);
  const [studyVisits, setStudyVisits] = useState<any[]>([]);
  const [pendingEvaluations, setPendingEvaluations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<StudyAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const loadStudyData = () => {
      const currentParticipant = getStudyParticipant();
      setParticipant(currentParticipant);
      
      if (currentParticipant?.consentGiven) {
        // Update all visit phases to current state
        updateAllVisitPhases();
        
        const visits = getStudyVisits();
        const pending = getVisitsWithPendingEvaluations();
        const studyAnalytics = generateStudyAnalytics(visits);
        
        setStudyVisits(visits);
        setPendingEvaluations(pending);
        setAnalytics(studyAnalytics);
        
        // Generate recommendations if we have analytics
        if (studyAnalytics) {
          const personalizedRecs = generatePersonalizedRecommendations(studyAnalytics);
          setRecommendations(personalizedRecs);
        }
      }
    };

    loadStudyData();
    
    // Update every minute to catch new evaluation windows
    const interval = setInterval(loadStudyData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!participant?.consentGiven) {
    return (
      <Card className="border-parchment/30 bg-parchment/5">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            You are not currently enrolled in the study.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalEvaluations = studyVisits.reduce((total, visit) => {
    return total + Object.values(visit.studyPhases).filter((phase: any) => phase.completed).length;
  }, 0);

  const totalPossibleEvaluations = studyVisits.length * 3;
  const overallProgress = totalPossibleEvaluations > 0 ? (totalEvaluations / totalPossibleEvaluations) * 100 : 0;

  const getPersonalityBadge = () => {
    if (!participant.acuxPersonality) return null;
    
    const type = participant.acuxPersonality.dominantType;
    const colors = {
      aesthetic: 'bg-rose-100 text-rose-800 border-rose-200',
      cognitive: 'bg-blue-100 text-blue-800 border-blue-200', 
      behavioral: 'bg-green-100 text-green-800 border-green-200',
      affective: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <Badge variant="outline" className={`${colors[type]} capitalize`}>
        {type} Type
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Study Overview */}
      <Card className="border-parchment/30 bg-parchment/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terracotta-foreground">
            <User className="h-5 w-5" />
            Study Participation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Participant ID</p>
              <p className="font-mono text-sm">{participant.id.slice(0, 8)}...</p>
            </div>
            {getPersonalityBadge()}
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Visits
              </div>
              <p className="text-2xl font-bold text-terracotta-foreground">{studyVisits.length}</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <BarChart3 className="h-4 w-4" />
                Evaluations
              </div>
              <p className="text-2xl font-bold text-terracotta-foreground">
                {totalEvaluations}/{totalPossibleEvaluations}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
                <Award className="h-4 w-4" />
                Progress
              </div>
              <p className="text-2xl font-bold text-terracotta-foreground">
                {Math.round(overallProgress)}%
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-terracotta-foreground font-medium">
                {totalEvaluations} of {totalPossibleEvaluations} completed
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="visits">All Visits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Pending Evaluations */}
          {pendingEvaluations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-terracotta-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ready for Evaluation ({pendingEvaluations.length})
              </h3>
              {pendingEvaluations.map((visit) => (
                <StudyVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          )}

          {pendingEvaluations.length === 0 && studyVisits.length > 0 && (
            <Card className="border-parchment/30 bg-parchment/5">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No evaluations are currently pending. Check back when your visit time approaches.
                </p>
              </CardContent>
            </Card>
          )}

          {studyVisits.length === 0 && (
            <Card className="border-parchment/30 bg-parchment/5">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No study visits scheduled yet. Schedule a visit from your profile to begin participating.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <StudyAnalyticsDisplay analytics={analytics} />
          ) : (
            <Card className="border-parchment/30 bg-parchment/5">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Complete some evaluations to see your analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          {studyVisits.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-terracotta-foreground">
                All Study Visits ({studyVisits.length})
              </h3>
              {studyVisits.map((visit) => (
                <StudyVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          ) : (
            <Card className="border-parchment/30 bg-parchment/5">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No study visits scheduled yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <PersonalizedRecommendations 
            recommendations={recommendations}
            onSiteSelect={(siteId) => {
              // Navigate to site details or add to planner
              console.log('Selected site:', siteId);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}