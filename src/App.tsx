
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";
import { AccentColorProvider } from "./contexts/AccentColorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { FoldersProvider } from "./contexts/FoldersContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { QuantumAIProvider } from "./contexts/QuantumAIContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Editor from "./pages/Editor";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AccentColorProvider>
        <AuthProvider>
          <FoldersProvider>
            <NotesProvider>
              <NotificationsProvider>
                <TooltipProvider>
                  <Toaster />
                  <BrowserRouter>
                    <QuantumAIProvider>
                      <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/coming-soon" element={<ComingSoon />} />
                        
                        {/* Protected app routes */}
                        <Route path="/app" element={<ProtectedRoute><Layout><Navigate to="/app/dashboard" replace /></Layout></ProtectedRoute>} />
                        <Route path="/app/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                        <Route path="/app/notes" element={<ProtectedRoute><Layout><Notes /></Layout></ProtectedRoute>} />
                        <Route path="/app/editor" element={<ProtectedRoute><Layout><Editor /></Layout></ProtectedRoute>} />
                        <Route path="/app/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
                        <Route path="/app/calendar" element={<ProtectedRoute><Layout><Calendar /></Layout></ProtectedRoute>} />
                        <Route path="/app/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </QuantumAIProvider>
                  </BrowserRouter>
                </TooltipProvider>
              </NotificationsProvider>
            </NotesProvider>
          </FoldersProvider>
        </AuthProvider>
      </AccentColorProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
