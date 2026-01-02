import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Demands from "./pages/Demands";
import Cemetery from "./pages/Cemetery";
import Users from "./pages/Users";
import Agent from "./pages/Agent";
import Portal from "./pages/Portal";
import PortalSolicitations from "./pages/PortalSolicitations";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/index" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/demands" element={<Demands />} />
          <Route path="/cemetery" element={<Cemetery />} />
          <Route path="/users" element={<Users />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/solicitations" element={<PortalSolicitations />} />
          <Route path="/signup" element={<Signup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
