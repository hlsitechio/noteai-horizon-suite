
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Context providers
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import { FoldersProvider } from './contexts/FoldersContext';

// Layout
import Layout from './components/Layout/Layout';

// Page components
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Editor from './pages/Editor';
import Calendar from './pages/Calendar';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (renamed from cacheTime)
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-accent/20">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('AppRoutes render:', { isAuthenticated, isLoading });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <FoldersProvider>
      <NotesProvider>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/notes" element={<Navigate to="/editor" replace />} />
          <Route path="/notes-list" element={<Layout><Notes /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </NotesProvider>
    </FoldersProvider>
  );
};

function App() {
  console.log('App component rendering');
  
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="online-note-ai-theme">
          <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20">
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </div>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
