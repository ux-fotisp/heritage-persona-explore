import { useState } from "react";
import { Search as SearchIcon, Filter, MapPin, Calendar, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/navigation/AppHeader";

const searchCategories = [
  { id: "all", label: "All", icon: SearchIcon },
  { id: "heritage", label: "Heritage Sites", icon: MapPin },
  { id: "experiences", label: "Experiences", icon: Star },
  { id: "events", label: "Events", icon: Calendar },
  { id: "groups", label: "Travel Groups", icon: Users },
];

const mockResults = {
  heritage: [
    { id: 1, name: "Ancient Temple Complex", location: "Bagan, Myanmar", rating: 4.8, type: "Religious Heritage" },
    { id: 2, name: "Colonial Architecture District", location: "Yangon, Myanmar", rating: 4.6, type: "Architectural Heritage" },
    { id: 3, name: "Traditional Village", location: "Inle Lake, Myanmar", rating: 4.7, type: "Cultural Heritage" },
  ],
  experiences: [
    { id: 4, name: "Traditional Cooking Class", location: "Mandalay", rating: 4.9, type: "Culinary" },
    { id: 5, name: "Handicraft Workshop", location: "Bagan", rating: 4.5, type: "Arts & Crafts" },
    { id: 6, name: "Meditation Retreat", location: "Sagaing", rating: 4.8, type: "Spiritual" },
  ],
  events: [
    { id: 7, name: "Water Festival", location: "Nationwide", rating: 4.9, type: "Cultural Event" },
    { id: 8, name: "Pagoda Festival", location: "Shwedagon", rating: 4.7, type: "Religious Event" },
  ],
  groups: [
    { id: 9, name: "Cultural Heritage Explorers", location: "Yangon", rating: 4.6, type: "Heritage Group" },
    { id: 10, name: "Photography Enthusiasts", location: "Bagan", rating: 4.8, type: "Photo Group" },
  ],
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    "Near Me", "Top Rated", "Free", "Guided Tours", "Family Friendly", "UNESCO Sites"
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getFilteredResults = () => {
    if (selectedCategory === "all") {
      return Object.values(mockResults).flat();
    }
    return mockResults[selectedCategory as keyof typeof mockResults] || [];
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader showBackButton={false} title="Search" />
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-2xl font-bold mb-4">Discover & Search</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search heritage sites, experiences, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background text-foreground"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="px-4 pt-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-4">
          {searchCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Filters
          </Button>
          {filters.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer h-8 px-3"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <TabsContent value={selectedCategory} className="mt-0">
          <div className="space-y-4">
            {getFilteredResults().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              getFilteredResults()
                .filter(item => 
                  searchQuery === "" || 
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}