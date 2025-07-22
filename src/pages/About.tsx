import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Target, Heart, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="About This App" />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-8">
          {/* Project Overview */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <Badge variant="outline">Academic Research</Badge>
              </div>
              <CardTitle className="text-2xl">Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                This application is the result of an academic research project developed by 
                <span className="font-semibold text-foreground"> Fotis Pastrakis</span> as part of their 
                master's studies in digital experience design and cultural informatics. It explores how 
                personalization, UX writing, and reflective interaction design can enhance cultural 
                heritage engagement through a progressive web application (PWA).
              </p>
            </CardContent>
          </Card>

          {/* Purpose and Vision */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <Badge variant="secondary">Vision</Badge>
              </div>
              <CardTitle className="text-2xl">Purpose and Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The platform aims to redefine how travelers interact with cultural heritage by offering 
                a deeply personalized experience. Instead of generic recommendations, users are guided 
                to discover heritage sites that align with their travel persona—a profile shaped through 
                introspective choices and emotional resonance.
              </p>
            </CardContent>
          </Card>

          {/* Research Focus */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <Badge variant="outline">Research</Badge>
              </div>
              <CardTitle className="text-2xl">Research Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Areas</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Personalization in cultural heritage</li>
                    <li>• UX writing for emotional engagement</li>
                    <li>• Reflective interaction design</li>
                    <li>• Progressive web application architecture</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Methodology</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• User persona development</li>
                    <li>• Behavioral pattern analysis</li>
                    <li>• Cultural preference mapping</li>
                    <li>• Iterative design validation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Statement */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-6 w-6 text-primary" />
                <Badge variant="default">Impact</Badge>
              </div>
              <CardTitle className="text-2xl">Cultural Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By bridging technology with cultural understanding, this research contributes to making 
                heritage sites more accessible, meaningful, and personally relevant to diverse audiences. 
                The goal is to foster deeper appreciation and preservation of our shared cultural legacy 
                through innovative digital experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}