import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout/Layout';
import HomeRedirect from './HomeRedirect';
import { Card } from './ui/card';

// Lazy load components with prefetching for dashboard pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));

// Dashboard pages - optimized for performance
const OptimizedDashboard = lazy(() => import('../pages/OptimizedDashboard'));
const Editor = lazy(() => import('../pages/Editor'));
const Notes = lazy(() => import('../pages/Notes'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Settings = lazy(() => import('../pages/Settings'));
const Chat = lazy(() => import('../pages/Chat'));
const SemanticChat = lazy(() => import('../pages/SemanticChat'));
const Calendar = lazy(() => import('../pages/Calendar'));
const ProjectRealms = lazy(() => import('../pages/ProjectRealms'));
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'));
const FolderDetail = lazy(() => import('../pages/FolderDetail'));

// Static pages
const NotFound = lazy(() => import('../pages/NotFound'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Terms = lazy(() => import('../pages/Terms'));
const Contact = lazy(() => import('../pages/Contact'));
const Sitemap = lazy(() => import('../pages/Sitemap'));
const Features = lazy(() => import('../pages/Features'));
const Pricing = lazy(() => import('../pages/Pricing'));
const About = lazy(() => import('../pages/About'));
const EditorControlsTest = lazy(() => import('./Editor/EditorControlsTest'));
const ComponentGallery = lazy(() => import('../pages/ComponentGallery'));
const MobileApp = lazy(() => import('../mobile/MobileApp'));

// Enhanced loading fallback with better UX
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Card className="p-8 flex items-center space-x-4 border-2 border-primary/20">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      <div className="flex flex-col">
        <span className="text-foreground font-medium">Loading...</span>
        <span className="text-xs text-muted-foreground">Please wait</span>
      </div>
    </Card>
  </div>
);

// Route-specific loading component for dashboard area
const DashboardLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <div className="flex items-center space-x-3">
      <div className="animate-pulse w-2 h-2 bg-primary rounded-full"></div>
      <div className="animate-pulse w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.1s' }}></div>
      <div className="animate-pulse w-2 h-2 bg-primary rounded-full" style={{ animationDelay: '0.2s' }}></div>
      <span className="text-sm text-muted-foreground ml-2">Loading dashboard...</span>
    </div>
  </div>
);

export const OptimizedLazyRoutes: React.FC = () => {
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

        {/* Protected App Routes with route-specific suspense */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          
          {/* Dashboard with optimized loading */}
          <Route path="dashboard" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <OptimizedDashboard />
            </Suspense>
          } />
          
          {/* Other routes with standard suspense */}
          <Route path="editor/:noteId?" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Editor />
            </Suspense>
          } />
          
          <Route path="notes" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Notes />
            </Suspense>
          } />
          
          <Route path="analytics" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Analytics />
            </Suspense>
          } />
          
          <Route path="settings" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Settings />
            </Suspense>
          } />
          
          <Route path="chat" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Chat />
            </Suspense>
          } />
          
          <Route path="semantic-chat" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <SemanticChat />
            </Suspense>
          } />
          
          <Route path="calendar" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Calendar />
            </Suspense>
          } />
          
          <Route path="projects" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ProjectRealms />
            </Suspense>
          } />
          
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="folders/:id" element={<FolderDetail />} />
          <Route path="component-gallery" element={<ComponentGallery />} />
          <Route path="editor-test" element={<EditorControlsTest />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
