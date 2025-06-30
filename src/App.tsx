
import { StrictMode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout/Layout";

function App() {
  return (
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/*" element={<Layout />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

export default App;
