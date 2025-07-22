import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Hidden Gems of Ancient Greece: Beyond the Acropolis",
    excerpt: "Discover lesser-known archaeological sites that offer profound insights into ancient Greek civilization, away from the tourist crowds.",
    author: "Dr. Elena Vasquez",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Archaeology",
    image: "/src/assets/heritage-temple.jpg"
  },
  {
    id: 2,
    title: "The Art of Mindful Heritage Travel",
    excerpt: "How to approach cultural sites with intention and presence, creating deeper connections with history and place.",
    author: "Marco Chen",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Travel Philosophy",
    image: "/src/assets/heritage-castle.jpg"
  },
  {
    id: 3,
    title: "Sacred Spaces: A Journey Through Europe's Pilgrimage Routes",
    excerpt: "Exploring the spiritual significance and historical importance of medieval pilgrimage paths across European heritage sites.",
    author: "Sister Catherine Williams",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Spirituality",
    image: "/src/assets/heritage-museum.jpg"
  },
  {
    id: 4,
    title: "Preserving Stories: Digital Archives and Cultural Memory",
    excerpt: "How modern technology is helping preserve and share the narratives embedded in our cultural heritage sites.",
    author: "Prof. Ahmed Hassan",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "Digital Heritage",
    image: "/src/assets/heritage-temple.jpg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Blog Posts" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cultural Heritage Stories</h1>
          <p className="text-muted-foreground">
            Insights, stories, and guides from fellow heritage enthusiasts and experts
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <div className="h-48 md:h-full bg-muted rounded-l-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Heritage Image</span>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}