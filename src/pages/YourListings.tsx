import { AppHeader } from "@/components/navigation/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MapPin, Clock, Star, Camera, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const YourListings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    siteName: "",
    location: "",
    description: "",
    category: "",
    openingHours: "",
    website: "",
    contactInfo: "",
    accessibility: "",
    highlights: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.siteName || !formData.location || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the site name, location, and description.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Submitting listing:", formData);
    
    toast({
      title: "Listing Submitted!",
      description: "Thank you for suggesting a heritage site. We'll review it and add it to our database if approved.",
    });

    // Reset form
    setFormData({
      siteName: "",
      location: "",
      description: "",
      category: "",
      openingHours: "",
      website: "",
      contactInfo: "",
      accessibility: "",
      highlights: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Your Listings" backPath="/" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Plus className="h-4 w-4" />
            Add Heritage Site
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Suggest a Heritage Site
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Know a cultural heritage site that should be featured? Help others discover amazing places by adding them to our database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name *</Label>
                  <Input
                    id="siteName"
                    placeholder="e.g., Ancient Roman Theatre"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="archaeological">Archaeological Site</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="religious">Religious Site</SelectItem>
                    <SelectItem value="castle">Castle/Fortress</SelectItem>
                    <SelectItem value="monument">Monument</SelectItem>
                    <SelectItem value="cultural-center">Cultural Center</SelectItem>
                    <SelectItem value="historic-district">Historic District</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the site's historical significance, what visitors can see, and why it's culturally important..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Visitor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input
                    id="openingHours"
                    placeholder="e.g., Daily 9:00 AM - 6:00 PM"
                    value={formData.openingHours}
                    onChange={(e) => handleInputChange("openingHours", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://..."
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  placeholder="Phone number or email"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessibility">Accessibility Information</Label>
                <Textarea
                  id="accessibility"
                  placeholder="Wheelchair access, parking, public transport options..."
                  rows={2}
                  value={formData.accessibility}
                  onChange={(e) => handleInputChange("accessibility", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="highlights">Key Highlights</Label>
                <Textarea
                  id="highlights"
                  placeholder="What makes this site special? Notable features, artifacts, architecture, events..."
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => handleInputChange("highlights", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Photos Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Photo upload functionality will be available in a future update. For now, please include detailed descriptions of the site's visual features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="px-8">
              <Send className="h-4 w-4 mr-2" />
              Submit Listing
            </Button>
          </div>
        </form>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">Submission Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>All submissions are reviewed before being added to our database</li>
              <li>Please ensure the site is genuinely of cultural or historical significance</li>
              <li>Include accurate and up-to-date information</li>
              <li>Sites should be accessible to the public (at least during certain hours)</li>
              <li>We reserve the right to edit submissions for clarity and consistency</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YourListings;