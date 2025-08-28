import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { saveDestination, type UserDestination } from '@/lib/destinationStorage';
import { useToast } from '@/hooks/use-toast';

interface DestinationFormProps {
  onDestinationAdded: (destination: UserDestination) => void;
}

export function DestinationForm({ onDestinationAdded }: DestinationFormProps) {
  const [formData, setFormData] = useState({
    destinationCountry: '',
    destinationCity: '',
    destinationSite: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destinationCountry || !formData.destinationCity || !formData.destinationSite) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const newDestination = saveDestination(formData);
      onDestinationAdded(newDestination);
      setFormData({
        destinationCountry: '',
        destinationCity: '',
        destinationSite: ''
      });
      
      toast({
        title: "Destination Added",
        description: "Your cultural destination has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save destination",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Cultural Destination
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.destinationCountry}
              onChange={(e) => handleInputChange('destinationCountry', e.target.value)}
              placeholder="e.g., Greece"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.destinationCity}
              onChange={(e) => handleInputChange('destinationCity', e.target.value)}
              placeholder="e.g., Athens"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site">Site Name</Label>
            <Input
              id="site"
              value={formData.destinationSite}
              onChange={(e) => handleInputChange('destinationSite', e.target.value)}
              placeholder="e.g., Acropolis of Athens"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Add Destination
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}