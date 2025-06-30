
import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout/Layout";
import AppWithAdvancedErrorHandling from "@/components/AppWithAdvancedErrorHandling";
import { AppInitializationService } from "@/services/appInitializationService";
import { QuantumAIProvider } from "@/contexts/QuantumAIContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccentColorProvider } from "@/contexts/AccentColorContext";
import { DynamicAccentProvider } from "@/contexts/DynamicAccentContext";
import QuantumAIInterface from "@/components/QuantumAI/QuantumAIInterface";
import QuantumAIIndicator from "@/components/QuantumAI/QuantumAIIndicator";

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

// Initialize app services
AppInitializationService.initialize().catch((error) => {
  console.error('Failed to initialize app services:', error);
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AppWithAdvancedErrorHandling>
              <AuthProvider>
                <AccentColorProvider>
                  <DynamicAccentProvider>
                    <QuantumAIProvider>
                      <Router>
                        <div className="min-h-screen bg-background">
                          <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/*" element={<Layout />} />
                          </Routes>
                          <Toaster />
                          <QuantumAIInterface />
                          <QuantumAIIndicator />
                        </div>
                      </Router>
                    </QuantumAIProvider>
                  </DynamicAccentProvider>
                </AccentColorProvider>
              </AuthProvider>
            </AppWithAdvancedErrorHandling>
          </TooltipProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
