import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout/Layout';
import HomeRedirect from './HomeRedirect';
import { Card } from './ui/card';

// Lazy load components for better initial loading
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Editor = lazy(() => import('../pages/Editor'));
const Notes = lazy(() => import('../pages/Notes'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Chat = lazy(() => import('../pages/Chat'));
const Calendar = lazy(() => import('../pages/Calendar'));
const ProjectRealms = lazy(() => import('../pages/ProjectRealms'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const FolderDetail = lazy(() => import('../pages/FolderDetail'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Contact = lazy(() => import('../pages/Contact'));
const Sitemap = lazy(() => import('../pages/Sitemap'));
const Features = lazy(() => import('../pages/Features'));
const Pricing = lazy(() => import('../pages/Pricing'));
const About = lazy(() => import('../pages/About'));
const EditorControlsTest = lazy(() => import('./Editor/EditorControlsTest'));
const MobileApp = lazy(() => import('../mobile/MobileApp'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="p-8 flex items-center space-x-4">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      <span className="text-muted-foreground">Loading...</span>
    </Card>
  </div>
);

export const LazyRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
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
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="editor/:noteId?" element={<Editor />} />
          <Route path="notes" element={<Notes />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="projects" element={<ProjectRealms />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="folders/:id" element={<FolderDetail />} />
          <Route path="editor-test" element={<EditorControlsTest />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};