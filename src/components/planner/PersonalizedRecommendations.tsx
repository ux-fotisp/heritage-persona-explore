import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Users, Sunrise, MapPin, Sparkles } from 'lucide-react';
import { PersonalizedRecommendation } from '@/lib/personalizedRecommendations';

interface PersonalizedRecommendationsProps {
  recommendations: PersonalizedRecommendation[];
  onSiteSelect?: (siteId: string) => void;
}

export function PersonalizedRecommendations({ recommendations, onSiteSelect }: PersonalizedRecommendationsProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-sage';
    if (confidence >= 60) return 'text-terracotta';
    return 'text-olive';
  };

  const getCrowdIcon = (level: string) => {
    switch (level) {
      case 'low': return <Users className="h-4 w-4 text-sage" />;
      case 'medium': return <Users className="h-4 w-4 text-terracotta" />;
      case 'high': return <Users className="h-4 w-4 text-destructive" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card className="border-parchment/30 bg-parchment/5">
        <CardContent className="pt-6 text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Complete more evaluations to get personalized recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-terracotta-foreground flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-terracotta" />
        Recommended for You
      </h3>
      
      {recommendations.map((rec) => (
        <Card key={rec.id} className="border-parchment/30 bg-parchment/5 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg text-terracotta-foreground">
                  {rec.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {rec.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className={`h-4 w-4 ${getConfidenceColor(rec.confidence)}`} />
                <span className={getConfidenceColor(rec.confidence)}>
                  {rec.confidence}%
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Recommendation Reason */}
            <div className="p-3 rounded-lg bg-parchment/20 border border-parchment/30">
              <p className="text-sm text-terracotta-foreground font-medium">
                Why this matches you:
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {rec.reason}
              </p>
            </div>
            
            {/* Tags */}
            {rec.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {rec.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <Separator />
            
            {/* Visit Estimation */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-terracotta-foreground">
                  {rec.estimatedExperience.duration}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Sunrise className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">Best Time</p>
                <p className="text-sm font-medium text-terracotta-foreground">
                  {rec.estimatedExperience.bestTime}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center">
                  {getCrowdIcon(rec.estimatedExperience.crowdLevel)}
                </div>
                <p className="text-xs text-muted-foreground">Crowds</p>
                <p className="text-sm font-medium capitalize text-terracotta-foreground">
                  {rec.estimatedExperience.crowdLevel}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onSiteSelect?.(rec.siteId)}
              >
                <MapPin className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onSiteSelect?.(rec.siteId)}
              >
                Add to Planner
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}