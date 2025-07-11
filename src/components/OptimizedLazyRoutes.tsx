import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout/Layout';
import HomeRedirect from './HomeRedirect';
import { Card } from './ui/card';

// Lazy load components with error handling for missing chunks
const lazyWithRetry = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.warn('Lazy loading failed, retrying...', error);
      // Retry once after a short delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(importFn().catch(() => {
            // If retry fails, return a fallback component
            return { 
              default: () => (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-lg font-semibold mb-2">Loading Error</h2>
                    <p className="text-muted-foreground mb-4">Failed to load page. Please refresh to try again.</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                    >
                      Refresh Page
                    </button>
                  </div>
                </div>
              )
            };
          }));
        }, 1000);
      });
    })
  );
};

const Landing = lazyWithRetry(() => import('../pages/Landing'));
const PremiumLanding = lazyWithRetry(() => import('../pages/PremiumLanding'));
const ConstellationLanding = lazyWithRetry(() => import('../pages/ConstellationLanding'));
const Login = lazyWithRetry(() => import('../pages/Auth/Login'));
const Register = lazyWithRetry(() => import('../pages/Auth/Register'));
const ResetPassword = lazyWithRetry(() => import('../pages/Auth/ResetPassword'));

// Dashboard pages - optimized for performance
const OptimizedDashboard = lazyWithRetry(() => import('../pages/OptimizedDashboard'));
const DashboardOnboarding = lazyWithRetry(() => import('../pages/DashboardOnboarding'));
const InitialOnboarding = lazyWithRetry(() => import('../pages/InitialOnboarding'));
const Editor = lazyWithRetry(() => import('../pages/Editor'));
const Explorer = lazyWithRetry(() => import('../pages/Explorer'));
const Analytics = lazyWithRetry(() => import('../pages/Analytics'));
const Settings = lazyWithRetry(() => import('../pages/settings'));
const Chat = lazyWithRetry(() => import('../pages/Chat'));
const VoiceChat = lazyWithRetry(() => import('../pages/VoiceChat'));
const Calendar = lazy(() => import('../pages/Calendar').then(module => ({ default: module.default })));
const ProjectRealms = lazyWithRetry(() => import('../pages/ProjectRealms'));
const ProjectDetail = lazyWithRetry(() => import('../pages/ProjectDetail'));
const FolderDetail = lazyWithRetry(() => import('../pages/FolderDetail'));

// Static pages
const NotFound = lazyWithRetry(() => import('../pages/NotFound'));
const Privacy = lazyWithRetry(() => import('../pages/Privacy'));
const Terms = lazyWithRetry(() => import('../pages/Terms'));
const Contact = lazyWithRetry(() => import('../pages/Contact'));
const Sitemap = lazyWithRetry(() => import('../pages/Sitemap'));
const Features = lazyWithRetry(() => import('../pages/Features'));
const Pricing = lazyWithRetry(() => import('../pages/Pricing'));
const About = lazyWithRetry(() => import('../pages/About'));
const EditorControlsTest = lazyWithRetry(() => import('./Editor/EditorControlsTest'));
const ComponentGallery = lazyWithRetry(() => import('../pages/ComponentGallery'));
const ComponentLibraryPage = lazyWithRetry(() => import('../pages/ComponentLibraryPage'));
const ActivityPage = lazyWithRetry(() => import('../pages/ActivityPage'));
const MobileApp = lazyWithRetry(() => import('../mobile/MobileApp'));
const ReferralPage = lazyWithRetry(() => import('../pages/ReferralPage'));
const SEODashboard = lazyWithRetry(() => import('../pages/seo'));

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
        <Route path="/landing.2" element={<PremiumLanding />} />
        <Route path="/landing.3" element={<ConstellationLanding />} />
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
        <Route path="/referral" element={<ReferralPage />} />
        
        {/* Initial Onboarding for new users */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <InitialOnboarding />
          </ProtectedRoute>
        } />

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
          
          {/* Dashboard Onboarding for new users */}
          <Route path="dashboard/onboarding" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <DashboardOnboarding />
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
              <Explorer />
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
          
          <Route path="voice-chat" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <VoiceChat />
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
          <Route path="activity" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ActivityPage />
            </Suspense>
          } />
          <Route path="components" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ComponentLibraryPage />
            </Suspense>
          } />
           <Route path="component-gallery" element={<ComponentGallery />} />
           <Route path="seo" element={
             <Suspense fallback={<DashboardLoadingFallback />}>
               <SEODashboard />
             </Suspense>
           } />
           <Route path="editor-test" element={<EditorControlsTest />} />
        </Route>

        {/* Legacy route redirects for 404 prevention */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/components" element={<Navigate to="/app/components" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
