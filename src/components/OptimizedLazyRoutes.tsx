import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout/Layout';
import { Card } from './ui/card';
import ComponentLibraryPage from '../pages/ComponentLibraryPage';
import { DeviceRouter } from './DeviceRouter';
import { PublicPageWrapper } from './PublicPageWrapper';
import Landing from '../pages/public/Landing';

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

// PUBLIC PAGES
// Landing is imported directly to avoid loading animation on main entry point
const Features = lazyWithRetry(() => import('../pages/public/Features'));
const Pricing = lazyWithRetry(() => import('../pages/public/Pricing'));
const About = lazyWithRetry(() => import('../pages/public/About'));
const Privacy = lazyWithRetry(() => import('../pages/public/Privacy'));
const Terms = lazyWithRetry(() => import('../pages/public/Terms'));
const Contact = lazyWithRetry(() => import('../pages/public/Contact'));
const Sitemap = lazyWithRetry(() => import('../pages/public/Sitemap'));
const NotFound = lazyWithRetry(() => import('../pages/public/NotFound'));

//AUTH PAGES
const Login = lazyWithRetry(() => import('../pages/auth/Login'));
const Register = lazyWithRetry(() => import('../pages/auth/Register'));
const ResetPassword = lazyWithRetry(() => import('../pages/auth/ResetPassword'));
const Logout = lazyWithRetry(() => import('../pages/auth/Logout'));

// SETUP PAGES
const InitialOnboarding = lazyWithRetry(() => import('../pages/setup/InitialOnboarding'));
const DashboardOnboarding = lazyWithRetry(() => import('../pages/setup/DashboardOnboarding'));

// APP PAGES - Main Application
const Dashboard = lazyWithRetry(() => import('../pages/app/Dashboard'));
const Editor = lazyWithRetry(() => import('../pages/Editor'));
const Notes = lazyWithRetry(() => import('../pages/app/Notes'));
const NotesExplorer = lazyWithRetry(() => import('../pages/app/NotesExplorer'));
const Explorer = lazyWithRetry(() => import('../pages/Explorer'));
const Analytics = lazyWithRetry(() => import('../pages/app/Analytics'));
const Settings = lazyWithRetry(() => import('../pages/app/Settings'));
const Chat = lazyWithRetry(() => import('../pages/app/Chat'));
const VoiceChat = lazyWithRetry(() => import('../pages/VoiceChat'));
const Calendar = lazyWithRetry(() => import('../pages/app/Calendar'));
const Projects = lazyWithRetry(() => import('../pages/app/Projects'));
const ProjectDetail = lazyWithRetry(() => import('../pages/ProjectDetail'));
const KanbanBoards = lazyWithRetry(() => import('../pages/app/KanbanBoards'));
const KanbanBoardDetail = lazyWithRetry(() => import('../pages/app/KanbanBoardDetail'));
const FolderDetail = lazyWithRetry(() => import('../pages/FolderDetail'));
const ActivityPage = lazyWithRetry(() => import('../pages/ActivityPage'));
const ReferralPage = lazyWithRetry(() => import('../pages/ReferralPage'));
const SEODashboard = lazyWithRetry(() => import('../pages/seo'));
const APMPage = lazyWithRetry(() => import('../pages/APMPage').then(module => ({ default: module.APMPage })));
const UnifiedThemePage = lazyWithRetry(() => import('../pages/app/UnifiedThemePage'));
const AIFeatures = lazyWithRetry(() => import('../pages/AIFeatures'));
const AnalyticsDemo = lazyWithRetry(() => import('../pages/AnalyticsDemo'));
const CompletionDashboard = lazyWithRetry(() => import('../pages/app/CompletionDashboard'));

// MOBILE PAGES
const MobileApp = lazyWithRetry(() => import('../pages/mobile/MobileApp'));

// DEVELOPMENT/TESTING PAGES
const EditorControlsTest = lazyWithRetry(() => import('./Editor/EditorControlsTest'));
const ComponentGallery = lazyWithRetry(() => import('../pages/ComponentGallery'));


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
    <DeviceRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={
          <PublicPageWrapper>
            <Landing />
          </PublicPageWrapper>
        } />
        <Route path="/landing" element={
          <PublicPageWrapper>
            <Landing />
          </PublicPageWrapper>
        } />
        <Route path="/public/features" element={
          <PublicPageWrapper>
            <Features />
          </PublicPageWrapper>
        } />
        <Route path="/public/pricing" element={
          <PublicPageWrapper>
            <Pricing />
          </PublicPageWrapper>
        } />
        <Route path="/public/about" element={
          <PublicPageWrapper>
            <About />
          </PublicPageWrapper>
        } />
        <Route path="/public/privacy" element={
          <PublicPageWrapper>
            <Privacy />
          </PublicPageWrapper>
        } />
        <Route path="/public/terms" element={
          <PublicPageWrapper>
            <Terms />
          </PublicPageWrapper>
        } />
        <Route path="/public/contact" element={
          <PublicPageWrapper>
            <Contact />
          </PublicPageWrapper>
        } />
        <Route path="/public/sitemap" element={
          <PublicPageWrapper>
            <Sitemap />
          </PublicPageWrapper>
        } />
        <Route path="/public/referral" element={
          <PublicPageWrapper>
            <ProtectedRoute>
              <ReferralPage />
            </ProtectedRoute>
          </PublicPageWrapper>
        } />
        <Route path="/demo/analytics" element={
          <PublicPageWrapper>
            <AnalyticsDemo />
          </PublicPageWrapper>
        } />

        {/* Legacy public route redirects */}
        <Route path="/public/landing" element={<Navigate to="/landing" replace />} />
        <Route path="/features" element={<Navigate to="/public/features" replace />} />
        <Route path="/pricing" element={<Navigate to="/public/pricing" replace />} />
        <Route path="/about" element={<Navigate to="/public/about" replace />} />
        <Route path="/privacy" element={<Navigate to="/public/privacy" replace />} />
        <Route path="/terms" element={<Navigate to="/public/terms" replace />} />
        <Route path="/contact" element={<Navigate to="/public/contact" replace />} />
        <Route path="/sitemap" element={<Navigate to="/public/sitemap" replace />} />
        <Route path="/referral" element={<Navigate to="/public/referral" replace />} />

        {/* ========== AUTH ROUTES ========== */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/logout" element={<Logout />} />

        {/* Legacy auth route redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />

        {/* ========== SETUP ROUTES ========== */}
        <Route path="/setup/onboarding" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <InitialOnboarding />
            </Suspense>
          </ProtectedRoute>
        } />

        <Route path="/setup/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <DashboardOnboarding />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* Legacy setup route redirects */}
        <Route path="/onboarding" element={<Navigate to="/setup/onboarding" replace />} />
        <Route path="/setup" element={<Navigate to="/setup/onboarding" replace />} />

        {/* ========== MOBILE ROUTES ========== */}
        <Route path="/mobile/*" element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingFallback />}>
              <MobileApp />
            </Suspense>
          </ProtectedRoute>
        } />

        {/* ========== APP ROUTES ========== */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          
          {/* Core App Pages */}
          <Route path="dashboard" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Dashboard />
            </Suspense>
          } />
          
          <Route path="notes" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Notes />
            </Suspense>
          } />
          
          <Route path="editor/:noteId?" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Editor />
            </Suspense>
          } />
          
          <Route path="explorer" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <NotesExplorer />
            </Suspense>
          } />
          
          <Route path="explorer/:folderId" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <NotesExplorer />
            </Suspense>
          } />
          
          <Route path="files" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Explorer />
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
          
          <Route path="projects" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Projects />
            </Suspense>
          } />
          
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="projects/:id/kanban" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <KanbanBoards />
            </Suspense>
          } />
          <Route path="projects/:id/kanban/:boardId" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <KanbanBoardDetail />
            </Suspense>
          } />
          <Route path="folders/:id" element={<FolderDetail />} />
          
          <Route path="kanban" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <KanbanBoards />
            </Suspense>
          } />
          
          <Route path="kanban/:boardId" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <KanbanBoardDetail />
            </Suspense>
          } />
          
          <Route path="calendar" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <Calendar />
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
          
          <Route path="activity" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <ActivityPage />
            </Suspense>
          } />

          {/* Tools & Features */}
          <Route path="seo" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <SEODashboard />
            </Suspense>
          } />
          
          <Route path="apm" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <APMPage />
            </Suspense>
          } />
          
          <Route path="themes" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <UnifiedThemePage />
            </Suspense>
          } />
          
          <Route path="ai-features" element={
            <Suspense fallback={<DashboardLoadingFallback />}>
              <AIFeatures />
            </Suspense>
           } />
           
           <Route path="completion" element={
             <Suspense fallback={<DashboardLoadingFallback />}>
               <CompletionDashboard />
             </Suspense>
           } />

          {/* Development Tools */}
          <Route path="components" element={<ComponentLibraryPage />} />
          <Route path="component-gallery" element={<ComponentGallery />} />
          <Route path="editor-test" element={<EditorControlsTest />} />
        </Route>

        {/* Legacy app route redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/components" element={<Navigate to="/app/components" replace />} />

        {/* ========== CATCH ALL ========== */}
        <Route path="*" element={
          <PublicPageWrapper>
            <NotFound />
          </PublicPageWrapper>
        } />
      </Routes>
    </Suspense>
  </DeviceRouter>
  );
};