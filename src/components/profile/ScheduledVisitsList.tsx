import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { type ScheduledVisit, updateVisitStatus, removeScheduledVisit } from '@/lib/visitStorage';
import { useToast } from '@/hooks/use-toast';

interface ScheduledVisitsListProps {
  visits: ScheduledVisit[];
  onVisitUpdated: (visitId: string, status: ScheduledVisit['status']) => void;
  onVisitRemoved: (visitId: string) => void;
}

export function ScheduledVisitsList({ visits, onVisitUpdated, onVisitRemoved }: ScheduledVisitsListProps) {
  const { toast } = useToast();

  const handleStatusUpdate = (visitId: string, status: ScheduledVisit['status']) => {
    if (updateVisitStatus(visitId, status)) {
      onVisitUpdated(visitId, status);
      toast({
        title: "Visit Updated",
        description: `Visit status changed to ${status}`,
      });
    }
  };

  const handleRemoveVisit = (visitId: string) => {
    if (removeScheduledVisit(visitId)) {
      onVisitRemoved(visitId);
      toast({
        title: "Visit Removed",
        description: "Scheduled visit has been removed",
      });
    }
  };

  const getStatusColor = (status: ScheduledVisit['status']) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: ScheduledVisit['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  if (visits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No visits scheduled yet. Schedule your first visit above!</p>
        </CardContent>
      </Card>
    );
  }

  const sortedVisits = [...visits].sort((a, b) => 
    new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled Visits ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedVisits.map((visit) => (
          <div key={visit.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {visit.destinationSite}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {visit.destinationCity}, {visit.destinationCountry}
                </p>
                <p className="text-sm font-medium flex items-center gap-2">
                  {getStatusIcon(visit.status)}
                  {format(new Date(visit.visitDate), 'PPP')}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={getStatusColor(visit.status) as any}>
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleRemoveVisit(visit.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {visit.status === 'scheduled' && (
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate(visit.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate(visit.id, 'cancelled')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              Scheduled {format(new Date(visit.dateScheduled), 'PPp')}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}