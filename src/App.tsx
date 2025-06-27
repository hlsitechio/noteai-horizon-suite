
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { FoldersProvider } from '@/contexts/FoldersContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { FloatingNotesProvider } from '@/contexts/FloatingNotesContext';
import { AccentColorProvider } from '@/contexts/AccentColorContext';
import { QuantumAIProvider } from '@/contexts/QuantumAIContext';
import { ProjectRealmsProvider } from '@/contexts/ProjectRealmsContext';
import { UnifiedDragDropProvider } from '@/components/Layout/UnifiedDragDropProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GlobalAICopilot } from '@/components/Global/GlobalAICopilot';
import { FloatingNotesContainer } from '@/components/FloatingNotes/FloatingNotesContainer';
import { GPUPerformanceMonitor } from '@/components/GPUPerformanceMonitor';
import { MobileViewButton } from '@/components/Layout/MobileViewButton';

// Main layout with sidebar
import Layout from '@/components/Layout/Layout';

// Pages
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Notes from '@/pages/Notes';
import Analytics from '@/pages/Analytics';
import Calendar from '@/pages/Calendar';
import Chat from '@/pages/Chat';
import Settings from '@/pages/Settings';
import Editor from '@/pages/Editor';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ResetPassword from '@/pages/Auth/ResetPassword';
import FolderDetail from '@/pages/FolderDetail';
import ProjectRealms from '@/pages/ProjectRealms';
import ProjectDetail from '@/pages/ProjectDetail';
import NotFound from '@/pages/NotFound';
import ComingSoon from '@/pages/ComingSoon';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Sitemap from '@/pages/Sitemap';
import Index from '@/pages/Index';

// Mobile app
import MobileApp from '@/mobile/MobileApp';

// Protected route component
import ProtectedRoute from '@/components/ProtectedRoute';

// Route guard component
import HomeRedirect from '@/components/HomeRedirect';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <AccentColorProvider>
            <NotificationsProvider>
              <Router>
                <Routes>
                  {/* Mobile Routes */}
                  <Route path="/mobile/*" element={<MobileApp />} />
                  
                  {/* Public Routes */}
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/coming-soon" element={<ComingSoon />} />
                  
                  {/* Protected App Routes */}
                  <Route path="/app/*" element={
                    <ProtectedRoute>
                      <NotesProvider>
                        <FoldersProvider>
                          <ProjectRealmsProvider>
                            <FloatingNotesProvider>
                              <QuantumAIProvider>
                                <UnifiedDragDropProvider>
                                  <Layout>
                                    <Routes>
                                      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                                      <Route path="/dashboard" element={<Dashboard />} />
                                      <Route path="/notes" element={<Notes />} />
                                      <Route path="/notes/:noteId" element={<Notes />} />
                                      <Route path="/analytics" element={<Analytics />} />
                                      <Route path="/calendar" element={<Calendar />} />
                                      <Route path="/chat" element={<Chat />} />
                                      <Route path="/settings" element={<Settings />} />
                                      <Route path="/editor" element={<Editor />} />
                                      <Route path="/folder/:folderId" element={<FolderDetail />} />
                                      <Route path="/projects" element={<ProjectRealms />} />
                                      <Route path="/projects/:projectId" element={<ProjectDetail />} />
                                    </Routes>
                                  </Layout>
                                  <FloatingNotesContainer />
                                  <GlobalAICopilot />
                                  <GPUPerformanceMonitor />
                                  <MobileViewButton />
                                </UnifiedDragDropProvider>
                              </QuantumAIProvider>
                            </FloatingNotesProvider>
                          </ProjectRealmsProvider>
                        </FoldersProvider>
                      </NotesProvider>
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </NotificationsProvider>
          </AccentColorProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
