
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { FoldersProvider } from "./contexts/FoldersContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { AccentColorProvider } from "./contexts/AccentColorContext";
import { QuantumAIProvider } from "./contexts/QuantumAIContext";
import { ProjectRealmsProvider } from "./contexts/ProjectRealmsContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ResetPassword from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Notes from "./pages/Notes";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import ProjectRealms from "./pages/ProjectRealms";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout/Layout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <AuthProvider>
              <AccentColorProvider>
                <NotificationsProvider>
                  <QuantumAIProvider>
                    <ProjectRealmsProvider>
                      <NotesProvider>
                        <FoldersProvider>
                          <div className="min-h-screen bg-background">
                            <Routes>
                              {/* Public routes */}
                              <Route path="/" element={<Index />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/reset-password" element={<ResetPassword />} />
                              
                              {/* Protected routes with layout */}
                              <Route
                                path="/app/*"
                                element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/editor" element={<Editor />} />
                                        <Route path="/notes" element={<Notes />} />
                                        <Route path="/chat" element={<Chat />} />
                                        <Route path="/calendar" element={<Calendar />} />
                                        <Route path="/projects" element={<ProjectRealms />} />
                                        <Route path="/settings" element={<Settings />} />
                                        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                                      </Routes>
                                    </Layout>
                                  </ProtectedRoute>
                                }
                              />
                              
                              {/* Catch all route */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                          <Toaster />
                          <Sonner />
                        </FoldersProvider>
                      </NotesProvider>
                    </ProjectRealmsProvider>
                  </QuantumAIProvider>
                </NotificationsProvider>
              </AccentColorProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
