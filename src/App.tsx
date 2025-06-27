import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './providers/ThemeProvider';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from './hooks/use-mobile';
import ProtectedRoute from './components/ProtectedRoute';
import HomeRedirect from './components/HomeRedirect';
import ErrorBoundary from './components/ErrorBoundary';
import DeviceFrame from './components/DeviceFrame';

// Desktop Layout and Pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Editor from './pages/Editor';
import FolderDetail from './pages/FolderDetail';
import ProjectRealms from './pages/ProjectRealms';
import ProjectDetail from './pages/ProjectDetail';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Chat from './pages/Chat';

// Mobile App (completely separate)
import MobileApp from './mobile/MobileApp';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';

// Public Pages
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/sitemap" element={<Sitemap />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Mobile Routes - Wrapped in Device Frame */}
        <Route 
          path="/mobile/*" 
          element={
            <ProtectedRoute>
              <DeviceFrame>
                <MobileApp />
              </DeviceFrame>
            </ProtectedRoute>
          } 
        />

        {/* Desktop App Routes - Only wrapped in desktop Layout */}
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route index element={<HomeRedirect />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="editor" element={<Editor />} />
                  <Route path="folders/:id" element={<FolderDetail />} />
                  <Route path="projects" element={<ProjectRealms />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="chat" element={<Chat />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <AccentColorProvider>
              <AuthProvider>
                <NotificationsProvider>
                  <FoldersProvider>
                    <NotesProvider>
                      <ProjectRealmsProvider>
                        <QuantumAIProvider>
                          <AppContent />
                          <Toaster />
                        </QuantumAIProvider>
                      </ProjectRealmsProvider>
                    </NotesProvider>
                  </FoldersProvider>
                </NotificationsProvider>
              </AuthProvider>
            </AccentColorProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
