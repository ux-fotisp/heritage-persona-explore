import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import PersonaQuestionnaire from "./pages/PersonaQuestionnaire";
import PersonaSelection from "./pages/PersonaSelection";
import PersonaConfirmation from "./pages/PersonaConfirmation";
import PersonaResults from "./pages/PersonaResults";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Planner from "./pages/Planner";
import Explore from "./pages/Explore";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Suggest from "./pages/Suggest";
import NotFound from "./pages/NotFound";
import RateExperience from "./pages/RateExperience";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/persona-questionnaire" element={<PersonaQuestionnaire />} />
            <Route path="/persona-selection" element={<PersonaSelection />} />
            <Route path="/persona-confirmation" element={<PersonaConfirmation />} />
            <Route path="/persona-results" element={<PersonaResults />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/search" element={<Search />} />
            <Route path="/suggest" element={<Suggest />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/rate/:siteId" element={<RateExperience />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
