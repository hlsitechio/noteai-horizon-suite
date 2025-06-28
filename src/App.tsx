
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { DynamicAccentProvider } from './contexts/DynamicAccentContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from './contexts/FloatingNotesContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import HomeRedirect from './components/HomeRedirect';

// Pages
import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import ProjectRealms from './pages/ProjectRealms';
import ProjectDetail from './pages/ProjectDetail';
import FolderDetail from './pages/FolderDetail';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';

// Mobile Components
import MobileApp from './mobile/MobileApp';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="online-note-ai-theme">
        <TooltipProvider>
          <AuthProvider>
            <AccentColorProvider>
              <DynamicAccentProvider>
                <NotificationsProvider>
                  <FoldersProvider>
                    <NotesProvider>
                      <ProjectRealmsProvider>
                        <FloatingNotesProvider>
                          <QuantumAIProvider>
                            <Router>
                              <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Index />} />
                                <Route path="/landing" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/sitemap" element={<Sitemap />} />

                                {/* Mobile Routes */}
                                <Route path="/mobile/*" element={
                                  <ProtectedRoute>
                                    <MobileApp />
                                  </ProtectedRoute>
                                } />

                                {/* Protected App Routes */}
                                <Route path="/app" element={
                                  <ProtectedRoute>
                                    <Layout />
                                  </ProtectedRoute>
                                }>
                                  <Route index element={<HomeRedirect />} />
                                  <Route path="dashboard" element={<Dashboard />} />
                                  <Route path="editor" element={<Editor />} />
                                  <Route path="notes" element={<Notes />} />
                                  <Route path="analytics" element={<Analytics />} />
                                  <Route path="settings" element={<Settings />} />
                                  <Route path="chat" element={<Chat />} />
                                  <Route path="calendar" element={<Calendar />} />
                                  <Route path="projects" element={<ProjectRealms />} />
                                  <Route path="projects/:id" element={<ProjectDetail />} />
                                  <Route path="folders/:id" element={<FolderDetail />} />
                                </Route>

                                {/* Catch all route */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </Router>
                            <Toaster />
                            <Sonner />
                          </QuantumAIProvider>
                        </FloatingNotesProvider>
                      </ProjectRealmsProvider>
                    </NotesProvider>
                  </FoldersProvider>
                </NotificationsProvider>
              </DynamicAccentProvider>
            </AccentColorProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
