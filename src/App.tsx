import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Demands from "./pages/Demands";
import Cemetery from "./pages/Cemetery";
import Users from "./pages/Users";
import Agent from "./pages/Agent";
import Solicitation from "./pages/Solicitation";
import Portal from "./pages/Portal";
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/demandas" element={<Demands />} />
          <Route path="/cemeterio" element={<Cemetery />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/agente" element={<Agent />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/solicitacao" element={<Solicitation />} />
          <Route path="/signup" element={<Signup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
