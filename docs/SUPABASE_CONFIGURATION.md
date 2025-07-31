# Supabase Configuration Documentation

## Project Overview

**Project Name:** Online Note AI  
**Project ID:** `9607f8b4-6c02-4a81-96b3-444babb0edc6`  
**Project Reference:** `qrdulwzjgbfgaplazgsh`  
**Supabase URL:** `https://qrdulwzjgbfgaplazgsh.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHVsd3pqZ2JmZ2FwbGF6Z3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzOTEsImV4cCI6MjA2MzQ1NjM5MX0.1KYtfqg9iKuu9UfSuySWOH7XsCneoDTbnYqg9JqSvjY`

This is a comprehensive note-taking application with AI capabilities, user authentication, real-time collaboration, and advanced features like voice-to-text, semantic search, and project management.

## Database Schema

### Core Tables

#### User Management
- **user_profiles**: Extended user profile information
- **user_roles**: Role-based access control (admin, moderator, user)
- **user_settings**: User preferences and settings
- **notification_preferences**: User notification settings

#### Notes & Content
- **notes_v2**: Main notes table with rich content support
- **folders**: Hierarchical folder organization
- **note_versions**: Version history for notes
- **note_shares**: Note sharing and collaboration
- **reminders**: Note reminder system

#### AI & Chat
- **chat_sessions**: Chat conversation sessions
- **chat_messages**: Individual chat messages with embeddings
- **ai_interactions**: Legacy AI interaction logs
- **ai_interactions_v2**: Enhanced AI interaction tracking
- **ai_copilot_sessions**: AI writing assistant sessions
- **ai_usage_tracking**: AI usage analytics and rate limiting
- **semantic_memory**: AI semantic memory for context

#### Projects & Organization
- **project_realms**: Project workspace management
- **project_agents**: AI agents per project
- **dashboard_layouts**: Customizable dashboard layouts
- **dashboard_components**: Available dashboard components
- **dashboard_settings**: User dashboard preferences

#### Media & Storage
- **banners**: User-uploaded banner images
- **user_gallery**: User media gallery

#### Analytics & Monitoring
- **page_visits**: Website analytics
- **pwa_analytics**: PWA-specific analytics
- **security_audit_log**: Security event logging
- **security_incidents**: Security incident tracking
- **rate_limits**: API rate limiting
- **realtime_performance_log**: Real-time performance monitoring

#### System Tables
- **cron_job_logs**: Scheduled job execution logs
- **content_moderation**: Content moderation system
- **security_settings**: Security configuration
- **password_failed_verification_attempts**: Brute force protection

### Database Views
- **daily_visit_counts**: Aggregated daily page visits
- **pwa_analytics_summary**: PWA analytics summary
- **visitor_stats**: Visitor statistics
- **realtime_throttling_stats**: Real-time throttling statistics

## Row Level Security (RLS) Policies

### User-Scoped Tables
Most tables implement user-scoped RLS policies:
```sql
-- Standard user-scoped pattern
CREATE POLICY "Users can view their own data" ON table_name
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own data" ON table_name
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own data" ON table_name
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own data" ON table_name
FOR DELETE USING (user_id = auth.uid());
```

### Admin-Only Tables
Security-related tables are admin-only:
- `security_audit_log`
- `security_incidents` 
- `security_settings`
- `content_moderation`
- `cron_job_logs`

### Public Tables
Some tables allow public read access:
- `dashboard_components`
- `page_visits`
- `pwa_analytics`
- `countries`
- `cities`

### Project-Scoped Tables
Project-related tables use project ownership checks:
```sql
-- Project agents example
CREATE POLICY "Users can view agents for their projects" 
ON project_agents FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM project_realms 
  WHERE id = project_agents.project_id 
  AND creator_id = auth.uid()
));
```

## Storage Configuration

### Buckets

#### 1. **avatars** Bucket
- **Purpose**: User profile pictures
- **Public**: Yes
- **Policies**: Users can upload/manage their own avatars

#### 2. **banners** Bucket  
- **Purpose**: Dashboard and project banners
- **Public**: Yes
- **File Types**: Images and videos
- **Size Limit**: 50MB
- **Allowed MIME Types**:
  - `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
  - `video/mp4`, `video/avi`, `video/quicktime`, `video/x-msvideo`

#### 3. **banner-images** Bucket
- **Purpose**: Generated banner images
- **Public**: Yes
- **Policies**: User-scoped upload/management

#### 4. **profile-pictures** Bucket
- **Purpose**: User profile images
- **Public**: Yes
- **Policies**: User-scoped with public read access

### Storage Policies Pattern
```sql
-- User can upload their own files
CREATE POLICY "Users can upload their own files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'bucket_name' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access
CREATE POLICY "Anyone can view files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'bucket_name');

-- User can manage their own files
CREATE POLICY "Users can update their own files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'bucket_name' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Edge Functions

### 1. **ai-copilot-enhanced**
- **Purpose**: Enhanced AI writing assistant
- **Authentication**: Required (`verify_jwt = true`)
- **Features**: Content analysis, suggestions, improvements

### 2. **ai-writing-assistant**  
- **Purpose**: Basic AI writing assistance
- **Authentication**: Not required (`verify_jwt = false`)
- **Features**: Grammar, style, and content suggestions

### 3. **chat-openrouter**
- **Purpose**: Chat functionality via OpenRouter API
- **Authentication**: Required
- **Features**: Multi-model chat capabilities

### 4. **chat-with-rag**
- **Purpose**: RAG (Retrieval Augmented Generation) chat
- **Authentication**: Required
- **Features**: Context-aware chat using user notes

### 5. **dashboard-lock**
- **Purpose**: Dashboard locking mechanism
- **Authentication**: Required
- **Features**: Prevent concurrent dashboard editing

### 6. **desktop-app-api**
- **Purpose**: Desktop application integration
- **Authentication**: Required
- **Features**: Desktop-specific API endpoints

### 7. **generate-banner-image**
- **Purpose**: AI banner image generation
- **Authentication**: Required
- **Features**: Custom banner creation

### 8. **generate-note-tags**
- **Purpose**: Automatic tag generation for notes
- **Authentication**: Not required (`verify_jwt = false`)
- **Features**: AI-powered tag suggestions

### 9. **get-launchdarkly-config**
- **Purpose**: Feature flag configuration
- **Authentication**: Required
- **Features**: Dynamic feature management

### 10. **semantic-chat**
- **Purpose**: Semantic search and chat
- **Authentication**: Required
- **Features**: Vector-based search and chat

### 11. **speech-to-text**
- **Purpose**: Voice-to-text conversion
- **Authentication**: Not required (`verify_jwt = false`)
- **Features**: Audio transcription

### 12. **weather-api**
- **Purpose**: Weather information
- **Authentication**: Required (`verify_jwt = true`)
- **Features**: Current weather data

## Database Functions

### Authentication & Security
- `handle_new_user()`: Creates user profile on signup
- `ensure_authenticated()`: Validates user authentication
- `has_role(user_id, role)`: Checks user roles
- `get_current_user_role()`: Returns current user's role
- `get_current_user_data()`: Returns complete user data

### Content Validation
- `validate_content_security(content)`: Content security validation
- `validate_note_content(content)`: Note content validation
- `sanitize_input(input_text)`: Input sanitization

### Rate Limiting & Security
- `check_rate_limit()`: Basic rate limiting
- `check_enhanced_rate_limit()`: Advanced rate limiting with tiers
- `check_enhanced_rate_limit_v2()`: Latest rate limiting with admin bypass

### AI & Usage Tracking
- `can_make_ai_request(user_id)`: Checks AI usage limits
- `track_ai_usage_enhanced()`: Enhanced AI usage tracking
- `track_copilot_usage()`: Copilot-specific usage tracking
- `get_daily_ai_usage()`: Daily AI usage statistics

### Notes & Search
- `get_user_notes_for_rag(user_id)`: Notes for RAG system
- `search_user_notes_for_rag()`: Search notes with relevance scoring
- `find_similar_notes_text()`: Text-based note similarity
- `get_user_notes_optimized()`: Optimized note retrieval

### Reminders & Notifications
- `get_pending_reminders(user_id)`: Pending reminders
- `get_pending_reminders_with_preferences()`: Reminders with notification prefs
- `mark_reminder_sent(reminder_id)`: Mark reminder as sent
- `snooze_reminder(reminder_id, minutes)`: Snooze reminder
- `get_user_notification_preferences(user_id)`: User notification settings

### System Maintenance
- `cleanup_expired_sessions()`: Clean expired data
- `cleanup_realtime_logs()`: Clean performance logs
- `optimize_realtime_performance()`: Optimize real-time performance

### Vector Operations (pgvector extension)
- Vector distance functions: `l2_distance`, `cosine_distance`, `inner_product`
- Vector operations: `vector_add`, `vector_sub`, `vector_mul`
- Vector utilities: `vector_dims`, `vector_norm`, `l2_normalize`
- Binary quantization: `binary_quantize`

## Authentication Configuration

### Providers
- **Email/Password**: Enabled (primary method)
- **Google OAuth**: Configured (requires client ID/secret)

### Settings
- **Signup**: Enabled
- **Email Confirmations**: Configurable (recommended disabled for development)
- **JWT Expiry**: 3600 seconds (1 hour)
- **Session Persistence**: Enabled
- **Auto Token Refresh**: Enabled
- **Flow Type**: PKCE

### URL Configuration
- **Site URL**: Set to application domain
- **Redirect URLs**: Include all deployment URLs

### Auth Triggers
```sql
-- Automatic user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Required API Keys & Secrets

### Essential Secrets
- `OPENAI_API_KEY`: OpenAI API access for AI features
- `ANTHROPIC_API_KEY`: Anthropic Claude API (if used)
- `REPLICATE_API_TOKEN`: Replicate API for image generation
- `WEATHER_API_KEY`: Weather service API key

### Optional Secrets
- `STRIPE_SECRET_KEY`: Payment processing
- `SENDGRID_API_KEY`: Email services
- `TWILIO_AUTH_TOKEN`: SMS services
- `GOOGLE_MAPS_API_KEY`: Maps integration

### Configuration Location
Set in Supabase Dashboard → Settings → Edge Functions → Secrets

## Real-time Configuration

### Enabled Features
- **Real-time subscriptions**: Enabled
- **Database changes**: Enabled for specific tables
- **User presence**: Available via channels
- **Broadcasting**: Available via channels

### Optimized Tables
- `notes_v2`: Full replica identity for complete change tracking
- `chat_messages`: Real-time chat updates
- `folders`: Folder structure changes

### Performance Settings
```sql
-- Optimized indexes for real-time queries
CREATE INDEX idx_notes_v2_user_updated ON notes_v2(user_id, updated_at DESC);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at);
```

### Real-time Usage Example
```typescript
// Subscribe to note changes
const channel = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'notes_v2',
      filter: `user_id=eq.${userId}`
    },
    (payload) => handleNoteChange(payload)
  )
  .subscribe();
```

## Extensions

### Enabled Extensions
- **pgvector**: Vector similarity search for AI features
- **uuid-ossp**: UUID generation
- **pg_cron**: Scheduled jobs (if needed)
- **pg_net**: HTTP requests from database

## Migration History

### Key Migrations Applied
1. **Initial Setup**: Basic tables and authentication
2. **Notes Enhancement**: Advanced note features and versioning
3. **AI Integration**: AI tables, usage tracking, embeddings
4. **Security Hardening**: Audit logs, rate limiting, validation
5. **Performance Optimization**: Indexes, real-time optimization
6. **Project Management**: Project realms and organization
7. **Analytics**: Usage analytics and monitoring

### Critical Migration Commands
```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Set up RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Enable real-time
ALTER TABLE table_name REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE table_name;

-- Create indexes for performance
CREATE INDEX idx_table_user_created ON table_name(user_id, created_at DESC);
```

## Recovery Instructions

### Complete Project Recreation

1. **Create New Supabase Project**
   ```bash
   # Initialize new project
   supabase init
   supabase start
   ```

2. **Apply Database Schema**
   ```bash
   # Run all migrations in order
   supabase db reset
   # Or apply individual migrations
   supabase migration up
   ```

3. **Configure Authentication**
   - Set up auth providers in Supabase Dashboard
   - Configure site URL and redirect URLs
   - Set JWT expiry and other auth settings

4. **Create Storage Buckets**
   ```sql
   -- Run storage setup commands
   INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
   -- Repeat for all buckets
   ```

5. **Deploy Edge Functions**
   ```bash
   # Deploy all functions
   supabase functions deploy
   ```

6. **Set Environment Variables**
   - Add all required API keys in Supabase Dashboard
   - Configure function-specific settings

7. **Enable Extensions**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   CREATE EXTENSION IF NOT EXISTS uuid-ossp;
   ```

8. **Apply RLS Policies**
   - All policies are included in migration files
   - Verify policies are correctly applied

9. **Configure Real-time**
   ```sql
   -- Enable real-time for required tables
   ALTER TABLE notes_v2 REPLICA IDENTITY FULL;
   ALTER PUBLICATION supabase_realtime ADD TABLE notes_v2;
   ```

### Backup Strategies

1. **Database Backup**
   ```bash
   # Export schema and data
   supabase db dump --data-only > backup.sql
   ```

2. **Storage Backup**
   - Download all files from storage buckets
   - Document bucket configurations

3. **Configuration Backup**
   - Export all environment variables
   - Document auth provider settings
   - Save custom SQL functions and triggers

## Development vs Production

### Development Setup
- Disable email confirmations for faster testing
- Use localhost URLs for auth redirects
- Enable debug logging
- Use development API keys where available

### Production Setup
- Enable email confirmations
- Use production domain for auth redirects
- Disable debug logging
- Use production API keys
- Enable rate limiting
- Configure monitoring and alerts

## Troubleshooting

### Common Issues

1. **Auth Redirect Errors**
   - Verify site URL and redirect URLs in auth settings
   - Check for protocol mismatches (http vs https)

2. **RLS Policy Violations**
   - Ensure user_id columns are properly set
   - Check policy conditions match insert data

3. **Real-time Performance**
   - Monitor real-time performance logs
   - Check for excessive subscription volume

4. **Storage Access Issues**
   - Verify bucket policies
   - Check file path format for user folders

5. **API Rate Limiting**
   - Check rate limit tables for blocked IPs
   - Verify user tier configurations

### Monitoring

- Monitor edge function logs for errors
- Check security audit logs for suspicious activity
- Review AI usage patterns for anomalies
- Track real-time performance metrics

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintainer**: Project Owner

This document should be updated whenever significant changes are made to the Supabase configuration.