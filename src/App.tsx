import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BottomNav } from "@/components/navigation/BottomNav";
import { CookieNotice } from "@/components/ui/cookie-notice";
import { AuthProvider } from "@/hooks/useAuth";
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
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import YourListings from "./pages/YourListings";
import StudyEnrollment from "./pages/StudyEnrollment";
import StudyDashboard from "./pages/StudyDashboard";
import TripCreation from "./pages/TripCreation";
import TripPersonaSelection from "./components/trip/TripPersonaSelection";
import PersonaBasedRecommendations from "./components/trip/PersonaBasedRecommendations";
import EvaluationFlow from "./components/evaluation/EvaluationFlow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/persona-questionnaire" element={
              <ProtectedRoute>
                <PersonaQuestionnaire />
              </ProtectedRoute>
            } />
            <Route path="/persona-selection" element={
              <ProtectedRoute>
                <PersonaSelection />
              </ProtectedRoute>
            } />
            <Route path="/persona-confirmation" element={
              <ProtectedRoute>
                <PersonaConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/persona-results" element={
              <ProtectedRoute>
                <PersonaResults />
              </ProtectedRoute>
            } />
            <Route path="/discover" element={<Discover />} />
            <Route path="/search" element={<Search />} />
            <Route path="/suggest" element={<Suggest />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/rate/:siteId" element={<RateExperience />} />
            <Route path="/evaluation/:visitId" element={<EvaluationFlow />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/your-listings" element={<YourListings />} />
            <Route path="/study-enrollment" element={<StudyEnrollment />} />
            <Route path="/study-dashboard" element={<StudyDashboard />} />
            
            {/* Trip Planning Routes */}
            <Route path="/trip-creation" element={<TripCreation />} />
            <Route path="/trip/:tripId/personas" element={<TripPersonaSelection />} />
            <Route path="/trip/:tripId/recommendations" element={<PersonaBasedRecommendations />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
        <CookieNotice />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
