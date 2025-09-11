import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart3, TrendingUp, Heart, MessageSquare, Download, Target } from 'lucide-react';
import { StudyAnalytics, exportStudyData } from '@/lib/studyAnalytics';

interface StudyAnalyticsDisplayProps {
  analytics: StudyAnalytics;
}

export function StudyAnalyticsDisplay({ analytics }: StudyAnalyticsDisplayProps) {
  const handleExport = () => {
    const data = exportStudyData(analytics);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-data-${analytics.participant.id.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-sage text-sage-foreground';
      case 'medium': return 'bg-terracotta text-terracotta-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-parchment/30 bg-parchment/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-terracotta-foreground">
                  {analytics.participant.completionRate}%
                </p>
              </div>
              <Target className="h-8 w-8 text-terracotta opacity-60" />
            </div>
            <Progress value={analytics.participant.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-parchment/30 bg-parchment/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Evaluations</p>
                <p className="text-2xl font-bold text-terracotta-foreground">
                  {analytics.participant.completedEvaluations}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-olive opacity-60" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {analytics.participant.totalVisits} visits
            </p>
          </CardContent>
        </Card>

        <Card className="border-parchment/30 bg-parchment/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <Badge className={getEngagementColor(analytics.insights.engagementLevel)}>
                  {analytics.insights.engagementLevel}
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-sage opacity-60" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Score: {analytics.insights.recommendationScore}/100
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Breakdown */}
      <Card className="border-parchment/30 bg-parchment/5">
        <CardHeader>
          <CardTitle className="text-lg text-terracotta-foreground">
            Evaluation Phase Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.evaluationData.phaseBreakdown).map(([phase, count]) => {
              const total = Object.values(analytics.evaluationData.phaseBreakdown).reduce((sum, val) => sum + val, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={phase} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{phase.replace('-', ' ')}</span>
                    <span className="text-muted-foreground">{count} evaluations</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* UEQS Insights */}
      {Object.keys(analytics.evaluationData.averageUEQS).length > 0 && (
        <Card className="border-parchment/30 bg-parchment/5">
          <CardHeader>
            <CardTitle className="text-lg text-terracotta-foreground">
              Experience Quality Scores (UEQ-S)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.evaluationData.averageUEQS).map(([item, score]) => (
                <div key={item} className="text-center p-3 rounded-lg bg-parchment/10">
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xl font-bold text-terracotta-foreground">
                    {score.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">/7.0</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emotional Patterns */}
      {Object.keys(analytics.evaluationData.emotionTrends).length > 0 && (
        <Card className="border-parchment/30 bg-parchment/5">
          <CardHeader>
            <CardTitle className="text-lg text-terracotta-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Emotional Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(analytics.evaluationData.emotionTrends)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([emotion, intensity]) => (
                <div key={emotion} className="flex items-center justify-between p-2 rounded bg-parchment/10">
                  <span className="text-sm capitalize">{emotion}</span>
                  <Badge variant="outline" className="text-xs">
                    {intensity.toFixed(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Themes */}
      {analytics.evaluationData.commonThemes.length > 0 && (
        <Card className="border-parchment/30 bg-parchment/5">
          <CardHeader>
            <CardTitle className="text-lg text-terracotta-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Common Themes in Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.evaluationData.commonThemes.map((theme) => (
                <Badge key={theme} variant="secondary" className="capitalize">
                  {theme}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visit Patterns */}
      <Card className="border-parchment/30 bg-parchment/5">
        <CardHeader>
          <CardTitle className="text-lg text-terracotta-foreground">
            Visit Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Preferred Sites</p>
            <div className="flex flex-wrap gap-2">
              {analytics.visitPatterns.preferredSites.map((site, index) => (
                <Badge key={site} variant={index === 0 ? "default" : "outline"}>
                  {site}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <p className="text-xl font-bold text-terracotta-foreground">
                {analytics.visitPatterns.visitFrequency}
              </p>
            </div>
            {analytics.visitPatterns.averageTimeBetweenVisits > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Avg. Days Between</p>
                <p className="text-xl font-bold text-terracotta-foreground">
                  {analytics.visitPatterns.averageTimeBetweenVisits}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card className="border-parchment/30 bg-parchment/5">
        <CardHeader>
          <CardTitle className="text-lg text-terracotta-foreground">
            Export Study Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download your complete study participation data for your records.
          </p>
          <Button onClick={handleExport} className="w-full" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data (JSON)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}