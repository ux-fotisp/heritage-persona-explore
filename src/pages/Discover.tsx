import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteCard } from "@/components/heritage/SiteCard";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Search, Filter, MapPin } from "lucide-react";
import heritageTemple from "@/assets/heritage-temple.jpg";
import heritageMuseum from "@/assets/heritage-museum.jpg";
import heritageCastle from "@/assets/heritage-castle.jpg";

// Mock cultural heritage sites data
const heritageSites = [
  {
    id: "1",
    name: "Ancient Temple of Serenity",
    description: "A beautifully preserved temple complex dating back to the 12th century, featuring intricate stone carvings and peaceful meditation gardens.",
    image: heritageTemple,
    location: "Kyoto, Japan",
    duration: "2-3 hours",
    category: "Religious Heritage",
    accessibility: "Medium" as const,
    rating: 4.8,
    matchScore: 92
  },
  {
    id: "2", 
    name: "National Archaeological Museum",
    description: "World-renowned collection spanning 5,000 years of human history, with interactive exhibits and guided tours available.",
    image: heritageMuseum,
    location: "Athens, Greece",
    duration: "3-4 hours", 
    category: "Museum",
    accessibility: "High" as const,
    rating: 4.7,
    matchScore: 89
  },
  {
    id: "3",
    name: "Medieval Castle Fortress",
    description: "A stunning example of medieval architecture perched on a hilltop, offering panoramic views and rich historical narratives.",
    image: heritageCastle,
    location: "Edinburgh, Scotland",
    duration: "2-3 hours",
    category: "Historical Site",
    accessibility: "Low" as const,
    rating: 4.6,
    matchScore: 85
  }
];

const categories = [
  "All Sites",
  "Museums", 
  "Religious Heritage",
  "Historical Sites",
  "Archaeological Sites",
  "Cultural Landscapes",
  "Traditional Crafts"
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Sites");
  const [sites] = useState(heritageSites);

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Sites" || 
                           site.category.toLowerCase().includes(selectedCategory.toLowerCase().replace("s", ""));
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToTrip = (siteId: string) => {
    // TODO: Implement add to trip functionality
    console.log("Added site to trip:", siteId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Cultural Heritage
            </h1>
            <p className="text-muted-foreground">
              Personalized recommendations based on your cultural persona
            </p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sites, locations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4" />
                Nearby
              </Button>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredSites.length} Sites Found
            </h2>
            <p className="text-sm text-muted-foreground">
              Sorted by personality match
            </p>
          </div>

          {/* Heritage Sites Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                {...site}
                onAddToTrip={() => handleAddToTrip(site.id)}
              />
            ))}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No sites found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to discover more heritage sites.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}