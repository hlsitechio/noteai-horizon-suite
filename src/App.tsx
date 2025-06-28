
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Editor from './pages/Editor';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MobileApp from './mobile/MobileApp';
import { ThemeProvider } from 'next-themes';
import GlobalAICopilot from './components/Global/GlobalAICopilot';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <FoldersProvider>
            <NotesProvider>
              <QuantumAIProvider>
                <Router>
                  <div className="min-h-screen bg-background w-full">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<Login />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/mobile/*" element={<MobileApp />} />
                      
                      {/* Protected routes with layout */}
                      <Route path="/app" element={
                        <ProtectedRoute>
                          <SidebarProvider>
                            <Layout />
                          </SidebarProvider>
                        </ProtectedRoute>
                      }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="editor" element={<Editor />} />
                        <Route path="notes" element={<Notes />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<Settings />} />
                      </Route>
                      
                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    
                    <GlobalAICopilot />
                    <Toaster />
                  </div>
                </Router>
              </QuantumAIProvider>
            </NotesProvider>
          </FoldersProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
