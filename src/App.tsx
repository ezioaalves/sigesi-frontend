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
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Portal from "./pages/Portal";
// import Auth from "./pages/Auth"; // Deleted
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
          <Route path="/" element={<Index />} />

          {/* Protected Routes for any authenticated user */}
          <Route path="/portal" element={
            <ProtectedRoute>
              <Portal />
            </ProtectedRoute>
          } />
          <Route path="/solicitacao" element={
            <ProtectedRoute>
              <Solicitation />
            </ProtectedRoute>
          } />
          <Route path="/documentos" element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } />

          {/* Role-Based Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['AGENTE', 'OPERADOR', 'ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/demandas" element={
            <ProtectedRoute allowedRoles={['AGENTE', 'OPERADOR', 'ADMIN']}>
              <Demands />
            </ProtectedRoute>
          } />
          <Route path="/cemeterio" element={
            <ProtectedRoute allowedRoles={['OPERADOR', 'ADMIN']}>
              <Cemetery />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/agente" element={
            <ProtectedRoute allowedRoles={['AGENTE', 'OPERADOR', 'ADMIN']}>
              <Agent />
            </ProtectedRoute>
          } />

          <Route path="/signup" element={<Signup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
