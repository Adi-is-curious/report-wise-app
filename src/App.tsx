import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./i18n/config";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ReportIssue from "./pages/ReportIssue";
import ActiveCases from "./pages/ActiveCases";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/report" element={<Layout><ReportIssue /></Layout>} />
            <Route path="/map" element={<Layout><ActiveCases /></Layout>} />
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/rewards" element={<Layout><Rewards /></Layout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;