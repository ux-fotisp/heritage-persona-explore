import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteCard } from "@/components/heritage/SiteCard";
import { PersonaRecommendations } from "@/components/planner/PersonaRecommendations";
import { AppHeader } from "@/components/navigation/AppHeader";
import { HERITAGE_SITES } from "@/data/heritageSites";
import { Search, MapPin, Filter } from "lucide-react";

export default function Planner() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");

  // Get unique categories and countries for filters
  const categories = Array.from(new Set(HERITAGE_SITES.map(site => site.category)));
  const countries = Array.from(new Set(HERITAGE_SITES.map(site => site.country)));

  // Filter sites based on search and filters
  const filteredSites = HERITAGE_SITES.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || site.category === selectedCategory;
    const matchesCountry = selectedCountry === "all" || site.country === selectedCountry;
    
    return matchesSearch && matchesCategory && matchesCountry;
  });

  const handleAddSite = (siteId: string) => {
    const existing: string[] = JSON.parse(localStorage.getItem("plannedSites") || "[]");
    const merged = Array.from(new Set([...existing, siteId]));
    localStorage.setItem("plannedSites", JSON.stringify(merged));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader showBackButton={false} title="Trip Planner" />
      
      <div className="flex-1 p-4">
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommended">For You</TabsTrigger>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="space-y-4">
            <PersonaRecommendations />
          </TabsContent>
          
          <TabsContent value="browse" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Browse All Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="all">All Countries</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sites Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSites.map((site) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        name={site.name}
                        description={site.description}
                        image={site.image}
                        location={`${site.city}, ${site.country}`}
                        duration={site.duration}
                        category={site.category}
                        accessibility="High"
                        rating={site.rating}
                        matchScore={75}
                        onAddToTrip={() => handleAddSite(site.id)}
                        onRate={() => window.location.href = `/rate/${site.id}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Sites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search heritage sites..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {searchTerm && (
                    <div className="text-sm text-muted-foreground">
                      Found {filteredSites.length} results
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSites.map((site) => (
                      <SiteCard
                        key={site.id}
                        id={site.id}
                        name={site.name}
                        description={site.description}
                        image={site.image}
                        location={`${site.city}, ${site.country}`}
                        duration={site.duration}
                        category={site.category}
                        accessibility="High"
                        rating={site.rating}
                        matchScore={80}
                        onAddToTrip={() => handleAddSite(site.id)}
                        onRate={() => window.location.href = `/rate/${site.id}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}