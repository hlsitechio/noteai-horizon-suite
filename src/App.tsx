
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { UnifiedDragDropProvider } from './components/Layout/UnifiedDragDropProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Index from './pages/Index';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Editor from './pages/Editor';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import ProjectRealms from './pages/ProjectRealms';
import ProjectDetail from './pages/ProjectDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import ComingSoon from './pages/ComingSoon';

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
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AccentColorProvider>
          <AuthProvider>
            <NotificationsProvider>
              <FoldersProvider>
                <NotesProvider>
                  <ProjectRealmsProvider>
                    <UnifiedDragDropProvider>
                      <Router>
                        <QuantumAIProvider>
                          <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
                            <Routes>
                              {/* Public routes */}
                              <Route path="/" element={<Index />} />
                              <Route path="/landing" element={<Landing />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<Register />} />
                              <Route path="/reset-password" element={<ResetPassword />} />
                              <Route path="/terms" element={<Terms />} />
                              <Route path="/privacy" element={<Privacy />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/sitemap" element={<Sitemap />} />
                              
                              {/* Protected routes with layout */}
                              <Route path="/app" element={
                                <ProtectedRoute>
                                  <Layout>
                                    <Routes>
                                      <Route index element={<Navigate to="/app/dashboard" replace />} />
                                      <Route path="dashboard" element={<Dashboard />} />
                                      <Route path="notes" element={<Notes />} />
                                      <Route path="editor" element={<Editor />} />
                                      <Route path="chat" element={<Chat />} />
                                      <Route path="settings" element={<Settings />} />
                                      <Route path="calendar" element={<Calendar />} />
                                      <Route path="projects" element={<ProjectRealms />} />
                                      <Route path="projects/:id" element={<ProjectDetail />} />
                                      <Route path="coming-soon" element={<ComingSoon />} />
                                    </Routes>
                                  </Layout>
                                </ProtectedRoute>
                              } />
                              
                              {/* Catch all route */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                          <Toaster />
                        </QuantumAIProvider>
                      </Router>
                    </UnifiedDragDropProvider>
                  </ProjectRealmsProvider>
                </NotesProvider>
              </FoldersProvider>
            </NotificationsProvider>
          </AuthProvider>
        </AccentColorProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
