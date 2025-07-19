import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Camera, Clock, Users } from "lucide-react";

const suggestionTypes = [
  { id: "heritage", label: "Heritage Site", icon: MapPin },
  { id: "experience", label: "Cultural Experience", icon: Users },
  { id: "event", label: "Cultural Event", icon: Clock },
  { id: "photo", label: "Photo Spot", icon: Camera },
];

const recentSuggestions = [
  {
    id: 1,
    title: "Hidden Temple in Mingun",
    type: "Heritage Site",
    location: "Mingun, Myanmar",
    status: "Under Review",
    submittedBy: "Local Guide",
    date: "2 days ago"
  },
  {
    id: 2,
    title: "Traditional Weaving Workshop",
    type: "Cultural Experience", 
    location: "Inle Lake, Myanmar",
    status: "Approved",
    submittedBy: "Cultural Expert",
    date: "1 week ago"
  },
  {
    id: 3,
    title: "Monthly Night Market",
    type: "Cultural Event",
    location: "Yangon, Myanmar", 
    status: "Under Review",
    submittedBy: "Local Resident",
    date: "3 days ago"
  }
];

export default function Suggest() {
  const [selectedType, setSelectedType] = useState("");
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Suggest New Places</h1>
        <p className="text-muted-foreground">Help others discover amazing cultural heritage sites and experiences</p>
      </div>

      {/* Suggestion Types */}
      {!showForm && (
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold">What would you like to suggest?</h2>
          <div className="grid grid-cols-2 gap-3">
            {suggestionTypes.map((type) => (
              <Card 
                key={type.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedType(type.id);
                  setShowForm(true);
                }}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">{type.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Suggest a {suggestionTypes.find(t => t.id === selectedType)?.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name/Title</label>
              <Input placeholder="Enter the name of the place or experience" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input placeholder="City, Region, Myanmar" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Describe what makes this place special, its cultural significance, accessibility, etc."
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Category Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Historical", "Religious", "Architectural", "Traditional Arts", "Local Cuisine", "Natural Heritage"].map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">
                Submit Suggestion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Community Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Community Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{suggestion.title}</h3>
                <Badge variant={suggestion.status === "Approved" ? "default" : "secondary"}>
                  {suggestion.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{suggestion.location}</span>
                </div>
                <p>Suggested by {suggestion.submittedBy} • {suggestion.date}</p>
              </div>
              <Badge variant="outline" className="mt-2 text-xs">
                {suggestion.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      {!showForm && (
        <Button 
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}