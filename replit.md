# OnlineNote.ai - Comprehensive SAAS Platform

## Project Overview
A full-featured SAAS application originally built on Lovable/Supabase, now being migrated to Replit with PostgreSQL backend. The platform includes:

- AI-powered writing assistant and chat with RAG
- Document management and analysis 
- Google Drive integration
- Authentication with passkey support
- Dashboard with customizable workspaces
- SEO optimization tools
- Calendar and task management
- Real-time collaboration features
- Performance monitoring (APM)

## Current Status
- **Domain**: https://onlinenote.ai/ (hosted on IONOS)
- **Environment**: Successfully migrated from Lovable to Replit
- **Database**: Connected to Supabase PostgreSQL (db.ubxtmbgvibtjtjggjnjm.supabase.co)
- **Status**: Application running on port 5000 with all core features functional

## User Preferences
- Focus on fixing bugs and completing the application
- Prioritize functionality over cosmetic changes
- Ensure all features work end-to-end
- Maintain security best practices

## Recent Changes
- 2025-01-30: Started migration from Lovable to Replit
- 2025-01-30: Installed missing dependencies
- 2025-01-30: Created comprehensive PostgreSQL schema
- 2025-01-30: Project successfully running on port 5000
- 2025-01-31: Successfully migrated authentication to Supabase
- 2025-01-31: Fixed DNS resolution issues by using Supabase REST API instead of direct database connections
- 2025-01-31: Updated all API routes to work with Supabase authentication service
- 2025-01-31: Resolved frontend/backend authentication parameter mismatch (email vs username)
- 2025-01-31: Implemented intelligent post-login routing based on user onboarding status
- 2025-01-31: Added onboarding status API endpoints and database integration
- 2025-01-31: New users now route to /setup/onboarding, existing users to /app/dashboard

## Architecture Notes
- Frontend: React with TypeScript, TailwindCSS, shadcn/ui
- Backend: Express.js with Drizzle ORM
- Database: PostgreSQL (migrating from Supabase)
- Key Features: AI integration, document processing, real-time features

## Migration Progress
Tracking in `.local/state/replit/agent/progress_tracker.md`