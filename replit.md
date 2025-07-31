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
- **Environment**: Migrating from Lovable to Replit
- **Database**: Transitioning from Supabase to PostgreSQL
- **Known Issues**: Multiple TypeScript errors, Supabase dependencies, missing API integrations

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

## Architecture Notes
- Frontend: React with TypeScript, TailwindCSS, shadcn/ui
- Backend: Express.js with Drizzle ORM
- Database: PostgreSQL (migrating from Supabase)
- Key Features: AI integration, document processing, real-time features

## Migration Progress
Tracking in `.local/state/replit/agent/progress_tracker.md`