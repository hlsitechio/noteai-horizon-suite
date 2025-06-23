
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import { NotesProvider } from "./contexts/NotesContext";
import { FoldersProvider } from "./contexts/FoldersContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import Layout from "./components/Layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Editor from "./pages/Editor";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import ComingSoon from "./pages/ComingSoon";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Sitemap from "./pages/Sitemap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <NotificationsProvider>
            <NotesProvider>
              <FoldersProvider>
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    {/* Landing and marketing pages */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/sitemap" element={<Sitemap />} />
                    
                    {/* Authentication pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* App pages with layout */}
                    <Route path="/app" element={<Layout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="chat" element={<Chat />} />
                      <Route path="editor" element={<Editor />} />
                      <Route path="calendar" element={<Calendar />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                    
                    {/* Legacy routes for backward compatibility */}
                    <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="/chat" element={<Navigate to="/app/chat" replace />} />
                    <Route path="/editor" element={<Navigate to="/app/editor" replace />} />
                    <Route path="/calendar" element={<Navigate to="/app/calendar" replace />} />
                    <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
                    
                    {/* Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </FoldersProvider>
            </NotesProvider>
          </NotificationsProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
