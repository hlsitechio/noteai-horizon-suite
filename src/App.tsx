
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { QuantumAIProvider } from './contexts/QuantumAIContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Editor from './pages/Editor';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MobileView from './mobile/MobileView';
import { ThemeProvider } from 'next-themes';
import GlobalAICopilot from './components/Global/GlobalAICopilot';
import './App.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <NotesProvider>
          <QuantumAIProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/mobile/*" element={<MobileView />} />
                  
                  {/* Protected routes */}
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="editor" element={<Editor />} />
                    <Route path="notes" element={<Notes />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  
                  {/* Redirect unknown routes to landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Global components */}
                <GlobalAICopilot />
                <Toaster />
              </div>
            </Router>
          </QuantumAIProvider>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
