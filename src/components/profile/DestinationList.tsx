import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Trash2, Check, X } from 'lucide-react';
import { type UserDestination, updateDestination, removeDestination } from '@/lib/destinationStorage';
import { useToast } from '@/hooks/use-toast';

interface DestinationListProps {
  destinations: UserDestination[];
  onDestinationUpdated: (destination: UserDestination) => void;
  onDestinationRemoved: (id: string) => void;
}

export function DestinationList({ destinations, onDestinationUpdated, onDestinationRemoved }: DestinationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserDestination>>({});
  const { toast } = useToast();

  const handleEdit = (destination: UserDestination) => {
    setEditingId(destination.id);
    setEditData({
      destinationCountry: destination.destinationCountry,
      destinationCity: destination.destinationCity,
      destinationSite: destination.destinationSite
    });
  };

  const handleSaveEdit = (id: string) => {
    if (!editData.destinationCountry || !editData.destinationCity || !editData.destinationSite) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const updated = updateDestination(id, editData);
    if (updated) {
      onDestinationUpdated(updated);
      setEditingId(null);
      setEditData({});
      toast({
        title: "Destination Updated",
        description: "Your destination has been updated successfully"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleRemove = (id: string) => {
    if (removeDestination(id)) {
      onDestinationRemoved(id);
      toast({
        title: "Destination Removed",
        description: "Your destination has been removed successfully"
      });
    }
  };

  if (destinations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No destinations added yet. Add your first cultural destination above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Your Cultural Destinations ({destinations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {destinations.map((destination) => (
          <div key={destination.id} className="border rounded-lg p-4 space-y-3">
            {editingId === destination.id ? (
              <div className="space-y-3">
                <Input
                  value={editData.destinationCountry || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, destinationCountry: e.target.value }))}
                  placeholder="Country"
                />
                <Input
                  value={editData.destinationCity || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, destinationCity: e.target.value }))}
                  placeholder="City"
                />
                <Input
                  value={editData.destinationSite || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, destinationSite: e.target.value }))}
                  placeholder="Site Name"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(destination.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-medium">{destination.destinationSite}</h4>
                    <p className="text-sm text-muted-foreground">
                      {destination.destinationCity}, {destination.destinationCountry}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(destination)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemove(destination.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs">
                    Added {new Date(destination.dateAdded).toLocaleDateString()}
                  </Badge>
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}