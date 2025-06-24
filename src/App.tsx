
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { FoldersProvider } from "./contexts/FoldersContext";
import { AccentColorProvider } from "./contexts/AccentColorContext";
import { QuantumAIProvider } from "./contexts/QuantumAIContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { ProjectRealmsProvider } from "./contexts/ProjectRealmsContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Landing = lazy(() => import("./pages/Landing"));
const Notes = lazy(() => import("./pages/Notes"));
const Editor = lazy(() => import("./pages/Editor"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chat = lazy(() => import("./pages/Chat"));
const Settings = lazy(() => import("./pages/Settings"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectRealms = lazy(() => import("./pages/ProjectRealms"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <NotificationsProvider>
              <AccentColorProvider>
                <QuantumAIProvider>
                  <FoldersProvider>
                    <NotesProvider>
                      <ProjectRealmsProvider>
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center min-h-screen">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                          }
                        >
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/landing" element={<Landing />} />
                            <Route path="/auth/login" element={<Login />} />
                            <Route path="/auth/register" element={<Register />} />
                            <Route path="/auth/reset-password" element={<ResetPassword />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/sitemap" element={<Sitemap />} />
                            
                            {/* Protected Routes */}
                            <Route
                              path="/app/*"
                              element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Routes>
                                      <Route path="dashboard" element={<Dashboard />} />
                                      <Route path="notes" element={<Notes />} />
                                      <Route path="editor" element={<Editor />} />
                                      <Route path="calendar" element={<Calendar />} />
                                      <Route path="chat" element={<Chat />} />
                                      <Route path="projects" element={<ProjectRealms />} />
                                      <Route path="settings" element={<Settings />} />
                                    </Routes>
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Suspense>
                        <Toaster />
                        <Sonner />
                      </ProjectRealmsProvider>
                    </NotesProvider>
                  </FoldersProvider>
                </QuantumAIProvider>
              </AccentColorProvider>
            </NotificationsProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
