
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UnifiedProvider } from './contexts/UnifiedProvider';
import { OptimizedNotesProvider } from './contexts/OptimizedNotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { FloatingNotesProvider } from './contexts/FloatingNotesContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { useReminderManager } from './hooks/useReminderManager';
import { EnhancedErrorBoundary } from './components/EnhancedErrorBoundary';
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

// Create optimized QueryClient with reduced retry attempts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1, // Reduced from 2 to prevent excessive retries
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // No retries for mutations to prevent spam
    },
  },
});

// Simplified Reminder Manager Component
const ReminderManagerInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useReminderManager();
  return <>{children}</>;
};

function App() {
  return (
    <EnhancedErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UnifiedProvider>
          <FoldersProvider>
            <OptimizedNotesProvider>
              <ProjectRealmsProvider>
                <FloatingNotesProvider>
                  <ReminderManagerInit>
                    <Router>
                      <QuantumAIProvider>
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
                        {/* Only show React Query Devtools in development */}
                        {import.meta.env.DEV && (
                          <ReactQueryDevtools initialIsOpen={false} />
                        )}
                      </QuantumAIProvider>
                    </Router>
                  </ReminderManagerInit>
                </FloatingNotesProvider>
              </ProjectRealmsProvider>
            </OptimizedNotesProvider>
          </FoldersProvider>
        </UnifiedProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
