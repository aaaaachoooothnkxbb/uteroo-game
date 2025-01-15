import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import YogaGame from "./pages/YogaGame";
import RecipeGame from "./pages/RecipeGame";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/lovable-uploads/5c55f1d7-fb0d-4ce9-b66b-43b57fca6f43.png')" }}>
        <div className="max-w-md w-full min-h-screen bg-white shadow-xl relative">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/yoga" element={<YogaGame />} />
              <Route path="/recipe" element={<RecipeGame />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;