
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Editor from './pages/Editor';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Sitemap from './pages/Sitemap';
import ComingSoon from './pages/ComingSoon';
import QuantumAIInterface from './components/QuantumAI/QuantumAIInterface';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationsProvider>
            <FoldersProvider>
              <NotesProvider>
                <Router>
                  <Routes>
                    {/* Public routes - NO Quantum AI */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/sitemap" element={<Sitemap />} />

                    {/* Protected app routes - WITH Quantum AI */}
                    <Route path="/app/*" element={
                      <QuantumAIProvider>
                        <Layout>
                          <Routes>
                            <Route path="home" element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="notes" element={<Notes />} />
                            <Route path="editor" element={<Editor />} />
                            <Route path="chat" element={<Chat />} />
                            <Route path="calendar" element={<Calendar />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="coming-soon" element={<ComingSoon />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                        
                        {/* Quantum AI Components - Only for app routes */}
                        <QuantumAIInterface />
                      </QuantumAIProvider>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  {/* Global Toaster */}
                  <Toaster />
                </Router>
              </NotesProvider>
            </FoldersProvider>
          </NotificationsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
