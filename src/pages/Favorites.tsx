import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Star, Trash2 } from "lucide-react";
import { useState } from "react";

const initialFavorites = [
  {
    id: 1,
    name: "Acropolis of Athens",
    location: "Athens, Greece",
    type: "Archaeological Site",
    rating: 4.8,
    savedDate: "2024-01-15",
    image: "/src/assets/heritage-temple.jpg",
    description: "Ancient citadel located on a rocky outcrop above the city of Athens"
  },
  {
    id: 2,
    name: "Neuschwanstein Castle",
    location: "Bavaria, Germany",
    type: "Historic Castle",
    rating: 4.6,
    savedDate: "2024-01-12",
    image: "/src/assets/heritage-castle.jpg",
    description: "19th-century Romanesque Revival palace on a rugged hill"
  },
  {
    id: 3,
    name: "British Museum",
    location: "London, UK",
    type: "Museum",
    rating: 4.7,
    savedDate: "2024-01-10",
    image: "/src/assets/heritage-museum.jpg",
    description: "World-famous museum dedicated to human history, art and culture"
  }
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="My Favorites" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-destructive fill-destructive" />
            <h1 className="text-3xl font-bold text-foreground">Your Heritage Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            Keep track of cultural sites and experiences you want to explore
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring heritage sites and add them to your wishlist
              </p>
              <Button>Discover Sites</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Heritage Image</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{favorite.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{favorite.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{favorite.rating}</span>
                            </div>
                          </div>
                          <Badge variant="secondary">{favorite.type}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(favorite.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-muted-foreground mb-4">
                        {favorite.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Saved {new Date(favorite.savedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Plan Visit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}