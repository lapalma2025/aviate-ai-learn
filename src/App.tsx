import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Exam from "./pages/Exam";
import Stats from "./pages/Stats";
import Admin from "./pages/Admin";
import AircraftParts from "./pages/AircraftParts";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiesPolicy from "./pages/CookiesPolicy";
import { CookieBanner } from "./components/CookieBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieBanner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/aircraft-parts" element={<AircraftParts />} />
            <Route path="/notes" element={<Notes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
