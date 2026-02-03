import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteCard } from "@/components/heritage/SiteCard";
import { BottomNav } from "@/components/navigation/BottomNav";
import { AppHeader } from "@/components/navigation/AppHeader";
import { PersonaFilterBar } from "@/components/discover/PersonaFilterBar";
import { Search, Filter, MapPin, Sparkles } from "lucide-react";
import { HERITAGE_SITES } from "@/data/heritageSites";
import { getPersonaRecommendations, getPersonaMatchCounts, filterSitesByPersonas, getUserPersonas, ScoredSite } from "@/lib/recommendationEngine";
const categories = ["All Sites", "Museums", "Religious Heritage", "Historical Sites", "Archaeological Sites", "Cultural Landscapes", "Traditional Crafts"];
export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Sites");
  const [activePersonaFilters, setActivePersonaFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"match" | "rating" | "name">("match");

  // Get user personas from storage
  const {
    primary: userPersona,
    all: userPersonas
  } = useMemo(() => getUserPersonas(), []);

  // Calculate recommendations with scores
  const scoredSites = useMemo(() => getPersonaRecommendations(HERITAGE_SITES, userPersona), [userPersona]);

  // Get match counts for each persona
  const matchCounts = useMemo(() => getPersonaMatchCounts(HERITAGE_SITES), []);

  // Apply all filters
  const filteredSites = useMemo(() => {
    let result = [...scoredSites];

    // Apply persona filters
    if (activePersonaFilters.length > 0) {
      result = filterSitesByPersonas(result, activePersonaFilters);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(site => site.name.toLowerCase().includes(query) || site.description.toLowerCase().includes(query) || site.city.toLowerCase().includes(query) || site.country.toLowerCase().includes(query));
    }

    // Apply category filter
    if (selectedCategory !== "All Sites") {
      result = result.filter(site => site.category.toLowerCase().includes(selectedCategory.toLowerCase().replace("s", "").replace("ical", "")));
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "match":
      default:
        result.sort((a, b) => b.matchScore - a.matchScore);
    }
    return result;
  }, [scoredSites, activePersonaFilters, searchQuery, selectedCategory, sortBy]);

  // Get top recommendations (>80% match)
  const topRecommendations = useMemo(() => filteredSites.filter(site => site.matchScore >= 80).slice(0, 4), [filteredSites]);
  const handleTogglePersonaFilter = (personaId: string) => {
    setActivePersonaFilters(prev => prev.includes(personaId) ? prev.filter(id => id !== personaId) : [...prev, personaId]);
  };
  const handleClearFilters = () => {
    setActivePersonaFilters([]);
  };
  const handleAddToTrip = (siteId: string) => {
    console.log("Added site to trip:", siteId);
  };
  return <div className="min-h-screen bg-background">
      <AppHeader showBackButton={false} title="Discover" />
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Discover Cultural Heritage
            </h1>
            <p className="text-muted-foreground">
              {userPersona ? "Personalized recommendations based on your cultural persona" : "Explore heritage sites and find your cultural match"}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Search sites, locations, or experiences..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>

            {/* Persona Filter Bar with Glass Effects */}
            <PersonaFilterBar activeFilters={activePersonaFilters} matchCounts={matchCounts} userPersonas={userPersonas} onToggleFilter={handleTogglePersonaFilter} onClearFilters={handleClearFilters} />

            {/* Category and Sort Controls */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <Button variant="outline" size="sm" className="px-4 py-2.5">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="px-4 py-2.5">
                <MapPin className="h-4 w-4" />
                Nearby
              </Button>
              <div className="flex gap-2">
                {categories.map(category => <Badge key={category} variant={selectedCategory === category ? "default" : "secondary"} className="cursor-pointer whitespace-nowrap" onClick={() => setSelectedCategory(category)}>
                    {category}
                  </Badge>)}
              </div>
            </div>
          </div>

          {/* Top Recommendations Section */}
          {topRecommendations.length > 0 && activePersonaFilters.length === 0 && <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Perfect Matches for You
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {topRecommendations.slice(0, 2).map((site, index) => <div key={site.id} className="animate-slide-up-fade" style={{
              animationDelay: `${index * 100}ms`
            }}>
                    <SiteCard id={site.id} name={site.name} description={site.description} image={site.image} location={`${site.city}, ${site.country}`} duration={site.duration} category={site.category} accessibility="High" rating={site.rating} matchScore={site.matchScore} matchedPersonas={site.matchedPersonaIds} isRecommended={site.isRecommended} onAddToTrip={() => handleAddToTrip(site.id)} />
                  </div>)}
              </div>
            </div>}

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredSites.length} Sites Found
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as "match" | "rating" | "name")} className="text-sm bg-secondary text-secondary-foreground rounded-md px-2 py-1 border-none focus:ring-2 focus:ring-primary">
                <option value="match">Best Match</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Heritage Sites Grid */}
          <div className="grid gap-6 md:grid-cols-2 bg-[#b781e4]/[0.14] mx-0 my-[20px] px-[20px] py-[20px] border-0 border-sky-400 rounded-none shadow-none">
            {filteredSites.map((site, index) => <div key={site.id} className="animate-slide-up-fade" style={{
            animationDelay: `${index % 6 * 50}ms`
          }}>
                <SiteCard id={site.id} name={site.name} description={site.description} image={site.image} location={`${site.city}, ${site.country}`} duration={site.duration} category={site.category} accessibility="Medium" rating={site.rating} matchScore={site.matchScore} matchedPersonas={site.matchedPersonaIds} isRecommended={site.isRecommended} onAddToTrip={() => handleAddToTrip(site.id)} />
              </div>)}
          </div>

          {filteredSites.length === 0 && <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No sites found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to discover more heritage
                sites.
              </p>
              {activePersonaFilters.length > 0 && <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                  Clear persona filters
                </Button>}
            </div>}
        </div>
      </div>

      <BottomNav />
    </div>;
}