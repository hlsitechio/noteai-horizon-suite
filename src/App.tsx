
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './providers/ThemeProvider';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Editor from './pages/Editor';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { QuantumAIProvider } from '@/contexts/QuantumAIContext';
import QuantumAIInterface from '@/components/QuantumAI/QuantumAIInterface';
import QuantumAIIndicator from '@/components/QuantumAI/QuantumAIIndicator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            {/* QuantumAIProvider must be inside Router since it uses useLocation */}
            <QuantumAIProvider>
              <AuthProvider>
                <NotificationsProvider>
                  <FoldersProvider>
                    <NotesProvider>
                      <Routes>
                        <Route path="/auth" element={<Landing />} />
                        <Route
                          path="/app/*"
                          element={
                            <Layout>
                              <Routes>
                                <Route path="home" element={<Dashboard />} />
                                <Route path="notes" element={<Notes />} />
                                <Route path="editor/:noteId?" element={<Editor />} />
                                <Route path="chat" element={<Chat />} />
                                <Route path="settings" element={<Settings />} />
                              </Routes>
                            </Layout>
                          }
                        />
                        <Route path="/" element={<Landing />} />
                      </Routes>
                      
                      {/* Quantum AI Components - Available everywhere, now inside NotificationsProvider */}
                      <QuantumAIInterface />
                      <QuantumAIIndicator />
                    </NotesProvider>
                  </FoldersProvider>
                </NotificationsProvider>
              </AuthProvider>
            </QuantumAIProvider>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
