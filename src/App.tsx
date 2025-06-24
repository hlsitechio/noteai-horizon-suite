import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './providers/ThemeProvider';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Editor from './pages/Editor';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ToastProvider } from './hooks/useToast';
import { GPUAccelerationProvider } from './hooks/useGPUAcceleration';
import { QuantumAIProvider } from '@/contexts/QuantumAIContext';
import QuantumAIInterface from '@/components/QuantumAI/QuantumAIInterface';
import QuantumAIIndicator from '@/components/QuantumAI/QuantumAIIndicator';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuantumAIProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <AuthProvider>
                <NotificationsProvider>
                  <ToastProvider>
                    <GPUAccelerationProvider>
                      <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route
                          path="/app/*"
                          element={
                            <Layout>
                              <Routes>
                                <Route path="home" element={<Home />} />
                                <Route path="notes" element={<Notes />} />
                                <Route path="editor/:noteId?" element={<Editor />} />
                                <Route path="chat" element={<Chat />} />
                                <Route path="settings" element={<Settings />} />
                              </Routes>
                            </Layout>
                          }
                        />
                        <Route path="/" element={<Auth />} />
                      </Routes>
                    </GPUAccelerationProvider>
                  </ToastProvider>
                </NotificationsProvider>
              </AuthProvider>
              
              {/* Quantum AI Components - Available everywhere */}
              <QuantumAIInterface />
              <QuantumAIIndicator />
            </div>
          </Router>
        </ThemeProvider>
      </QuantumAIProvider>
    </QueryClientProvider>
  );
}

export default App;
