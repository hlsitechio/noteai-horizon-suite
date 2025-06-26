
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ProjectRealmsProvider } from './contexts/ProjectRealmsContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { AccentColorProvider } from './contexts/AccentColorContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import { FloatingNotesProvider } from './contexts/FloatingNotesContext';
import FloatingNotesContainer from './components/FloatingNotes/FloatingNotesContainer';
import SamsungFrame from './components/SamsungFrame';
import MobileApp from './mobile/MobileApp';
import HomeRedirect from './components/HomeRedirect';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Index from './pages/Index';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import FolderDetail from './pages/FolderDetail';
import Editor from './pages/Editor';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import ProjectRealms from './pages/ProjectRealms';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <AccentColorProvider>
              <Router>
                <QuantumAIProvider>
                  <NotificationsProvider>
                    <ProjectRealmsProvider>
                      <FoldersProvider>
                        <NotesProvider>
                          <FloatingNotesProvider>
                            <div className="min-h-screen bg-background text-foreground">
                              <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Index />} />
                                <Route path="/home" element={<HomeRedirect />} />
                                <Route path="/landing" element={<Landing />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/sitemap" element={<Sitemap />} />

                                {/* Mobile Routes with Samsung Frame */}
                                <Route path="/mobile/*" element={
                                  <ProtectedRoute>
                                    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-8">
                                      <SamsungFrame>
                                        <MobileApp />
                                      </SamsungFrame>
                                    </div>
                                  </ProtectedRoute>
                                } />

                                {/* Protected Routes */}
                                <Route path="/app" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Navigate to="/app/dashboard" replace />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/dashboard" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Dashboard />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/notes" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Notes />
                                    </Layout>
                                  </ProtectedRoute>
                                } />

                                <Route path="/app/folders/:folderId" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <FolderDetail />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/editor" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Editor />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/chat" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Chat />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/calendar" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Calendar />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/projects" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ProjectRealms />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/projects/:projectId" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <ProjectDetail />
                                    </Layout>
                                  </ProtectedRoute>
                                } />
                                
                                <Route path="/app/settings" element={
                                  <ProtectedRoute>
                                    <Layout>
                                      <Settings />
                                    </Layout>
                                  </ProtectedRoute>
                                } />

                                {/* Catch all route */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                              <Toaster />
                              <FloatingNotesContainer />
                            </div>
                          </FloatingNotesProvider>
                        </NotesProvider>
                      </FoldersProvider>
                    </ProjectRealmsProvider>
                  </NotificationsProvider>
                </QuantumAIProvider>
              </Router>
            </AccentColorProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
