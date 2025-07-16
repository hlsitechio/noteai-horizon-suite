export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      apm_alerts: {
        Row: {
          alert_type: string
          created_at: string
          current_value: number | null
          description: string
          id: string
          is_acknowledged: boolean | null
          is_resolved: boolean | null
          severity: string | null
          threshold_value: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          current_value?: number | null
          description: string
          id?: string
          is_acknowledged?: boolean | null
          is_resolved?: boolean | null
          severity?: string | null
          threshold_value?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          current_value?: number | null
          description?: string
          id?: string
          is_acknowledged?: boolean | null
          is_resolved?: boolean | null
          severity?: string | null
          threshold_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      apm_error_logs: {
        Row: {
          component_name: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          is_filtered: boolean | null
          severity: string | null
          tags: Json | null
          timestamp: string
          url: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          component_name?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          is_filtered?: boolean | null
          severity?: string | null
          tags?: Json | null
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          component_name?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          is_filtered?: boolean | null
          severity?: string | null
          tags?: Json | null
          timestamp?: string
          url?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      apm_performance_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          tags: Json | null
          timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_type: string
          metric_value: number
          tags?: Json | null
          timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          tags?: Json | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      apm_sessions: {
        Row: {
          avg_load_time: number | null
          bounce_rate: number | null
          created_at: string
          end_time: string | null
          id: string
          page_views: number | null
          session_id: string
          start_time: string
          total_errors: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_load_time?: number | null
          bounce_rate?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          page_views?: number | null
          session_id: string
          start_time?: string
          total_errors?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_load_time?: number | null
          bounce_rate?: number | null
          created_at?: string
          end_time?: string | null
          id?: string
          page_views?: number | null
          session_id?: string
          start_time?: string
          total_errors?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_all_day: boolean | null
          location: string | null
          reminder_minutes: number | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_all_day?: boolean | null
          location?: string | null
          reminder_minutes?: number | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_all_day?: boolean | null
          location?: string | null
          reminder_minutes?: number | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_components: {
        Row: {
          component_config: Json
          component_type: string
          created_at: string
          height: number | null
          id: string
          is_enabled: boolean | null
          layout_id: string | null
          position_x: number | null
          position_y: number | null
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          component_config?: Json
          component_type: string
          created_at?: string
          height?: number | null
          id?: string
          is_enabled?: boolean | null
          layout_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          component_config?: Json
          component_type?: string
          created_at?: string
          height?: number | null
          id?: string
          is_enabled?: boolean | null
          layout_id?: string | null
          position_x?: number | null
          position_y?: number | null
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_components_layout_id_fkey"
            columns: ["layout_id"]
            isOneToOne: false
            referencedRelation: "dashboard_layouts"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_layouts: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          layout_config: Json
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_settings: {
        Row: {
          created_at: string
          dashboard_edit_mode: boolean | null
          edit_mode_expires_at: string | null
          id: string
          selected_banner_type: string | null
          selected_banner_url: string | null
          settings: Json
          sidebar_edit_mode: boolean | null
          sidebar_panel_sizes: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_edit_mode?: boolean | null
          edit_mode_expires_at?: string | null
          id?: string
          selected_banner_type?: string | null
          selected_banner_url?: string | null
          settings?: Json
          sidebar_edit_mode?: boolean | null
          sidebar_panel_sizes?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_edit_mode?: boolean | null
          edit_mode_expires_at?: string | null
          id?: string
          selected_banner_type?: string | null
          selected_banner_url?: string | null
          settings?: Json
          sidebar_edit_mode?: boolean | null
          sidebar_panel_sizes?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_workspaces: {
        Row: {
          banner_settings: Json | null
          created_at: string
          custom_settings: Json | null
          dashboard_edit_mode: boolean | null
          dashboard_layout: Json | null
          edit_mode_expires_at: string | null
          glowing_effects_enabled: boolean | null
          id: string
          is_default: boolean
          panel_sizes: Json | null
          selected_banner_type: string | null
          selected_banner_url: string | null
          sidebar_edit_mode: boolean | null
          sidebar_layout: Json | null
          theme_settings: Json | null
          updated_at: string
          user_id: string
          weather_enabled: boolean | null
          weather_location: string | null
          weather_units: string | null
          workspace_name: string
        }
        Insert: {
          banner_settings?: Json | null
          created_at?: string
          custom_settings?: Json | null
          dashboard_edit_mode?: boolean | null
          dashboard_layout?: Json | null
          edit_mode_expires_at?: string | null
          glowing_effects_enabled?: boolean | null
          id?: string
          is_default?: boolean
          panel_sizes?: Json | null
          selected_banner_type?: string | null
          selected_banner_url?: string | null
          sidebar_edit_mode?: boolean | null
          sidebar_layout?: Json | null
          theme_settings?: Json | null
          updated_at?: string
          user_id: string
          weather_enabled?: boolean | null
          weather_location?: string | null
          weather_units?: string | null
          workspace_name?: string
        }
        Update: {
          banner_settings?: Json | null
          created_at?: string
          custom_settings?: Json | null
          dashboard_edit_mode?: boolean | null
          dashboard_layout?: Json | null
          edit_mode_expires_at?: string | null
          glowing_effects_enabled?: boolean | null
          id?: string
          is_default?: boolean
          panel_sizes?: Json | null
          selected_banner_type?: string | null
          selected_banner_url?: string | null
          sidebar_edit_mode?: boolean | null
          sidebar_layout?: Json | null
          theme_settings?: Json | null
          updated_at?: string
          user_id?: string
          weather_enabled?: boolean | null
          weather_location?: string | null
          weather_units?: string | null
          workspace_name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          folder_id: string | null
          id: string
          is_public: boolean
          mime_type: string
          original_name: string
          storage_path: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          folder_id?: string | null
          id?: string
          is_public?: boolean
          mime_type: string
          original_name: string
          storage_path: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          folder_id?: string | null
          id?: string
          is_public?: boolean
          mime_type?: string
          original_name?: string
          storage_path?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_folder_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_folder_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_folder_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      google_drive_settings: {
        Row: {
          access_token: string | null
          created_at: string
          drive_folder_id: string | null
          id: string
          refresh_token: string | null
          sync_enabled: boolean | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          drive_folder_id?: string | null
          id?: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          drive_folder_id?: string | null
          id?: string
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes_v2: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          folder_id: string | null
          id: string
          is_favorite: boolean | null
          reminder_date: string | null
          reminder_enabled: boolean | null
          reminder_frequency: string | null
          reminder_status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          is_favorite?: boolean | null
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          reminder_status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          folder_id?: string | null
          id?: string
          is_favorite?: boolean | null
          reminder_date?: string | null
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          reminder_status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notes_folder"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      page_banner_settings: {
        Row: {
          banner_height: number | null
          banner_position_x: number | null
          banner_position_y: number | null
          banner_type: string | null
          banner_url: string | null
          banner_width: number | null
          created_at: string
          id: string
          is_enabled: boolean | null
          page_path: string
          panel_sizes: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          banner_height?: number | null
          banner_position_x?: number | null
          banner_position_y?: number | null
          banner_type?: string | null
          banner_url?: string | null
          banner_width?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          page_path: string
          panel_sizes?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          banner_height?: number | null
          banner_position_x?: number | null
          banner_position_y?: number | null
          banner_type?: string | null
          banner_url?: string | null
          banner_width?: number | null
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          page_path?: string
          panel_sizes?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_agents: {
        Row: {
          agent_type: string
          config: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          prompt_template: string | null
          updated_at: string
        }
        Insert: {
          agent_type?: string
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          prompt_template?: string | null
          updated_at?: string
        }
        Update: {
          agent_type?: string
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          prompt_template?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_agents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_realms"
            referencedColumns: ["id"]
          },
        ]
      }
      project_realms: {
        Row: {
          ai_config: Json | null
          created_at: string
          creator_id: string | null
          description: string | null
          id: string
          last_activity_at: string | null
          settings: Json | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_config?: Json | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          last_activity_at?: string | null
          settings?: Json | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_config?: Json | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          id?: string
          last_activity_at?: string | null
          settings?: Json | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          frequency: string
          id: string
          note_id: string
          notification_sent: boolean | null
          reminder_date: string
          snooze_until: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          note_id: string
          notification_sent?: boolean | null
          reminder_date: string
          snooze_until?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          note_id?: string
          notification_sent?: boolean | null
          reminder_date?: string
          snooze_until?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_logs: {
        Row: {
          created_at: string | null
          csp_report_uri: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          csp_report_uri?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          csp_report_uri?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seo_active_sessions: {
        Row: {
          current_page: string
          id: string
          is_active: boolean | null
          last_activity: string
          session_id: string
          started_at: string
          total_pages_viewed: number | null
          total_time_spent: number | null
          user_id: string
          visitor_id: string
          website_domain: string
        }
        Insert: {
          current_page: string
          id?: string
          is_active?: boolean | null
          last_activity?: string
          session_id: string
          started_at?: string
          total_pages_viewed?: number | null
          total_time_spent?: number | null
          user_id: string
          visitor_id: string
          website_domain: string
        }
        Update: {
          current_page?: string
          id?: string
          is_active?: boolean | null
          last_activity?: string
          session_id?: string
          started_at?: string
          total_pages_viewed?: number | null
          total_time_spent?: number | null
          user_id?: string
          visitor_id?: string
          website_domain?: string
        }
        Relationships: []
      }
      seo_alerts: {
        Row: {
          alert_type: string | null
          created_at: string
          id: string
          is_read: boolean | null
          keyword: string | null
          message: string
          metric_value: number | null
          page_path: string | null
          previous_value: number | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          keyword?: string | null
          message: string
          metric_value?: number | null
          page_path?: string | null
          previous_value?: number | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          keyword?: string | null
          message?: string
          metric_value?: number | null
          page_path?: string | null
          previous_value?: number | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_analytics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: number | null
          page_path: string
          recorded_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value?: number | null
          page_path: string
          recorded_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number | null
          page_path?: string
          recorded_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seo_audits: {
        Row: {
          audit_data: Json | null
          audit_score: number | null
          audit_type: string | null
          created_at: string
          id: string
          issues_fixed: number | null
          issues_found: number | null
          user_id: string
        }
        Insert: {
          audit_data?: Json | null
          audit_score?: number | null
          audit_type?: string | null
          created_at?: string
          id?: string
          issues_fixed?: number | null
          issues_found?: number | null
          user_id: string
        }
        Update: {
          audit_data?: Json | null
          audit_score?: number | null
          audit_type?: string | null
          created_at?: string
          id?: string
          issues_fixed?: number | null
          issues_found?: number | null
          user_id?: string
        }
        Relationships: []
      }
      seo_backlink_analytics: {
        Row: {
          created_at: string
          domain_authority: number | null
          high_authority_links_percent: number | null
          id: string
          link_profile_health: number | null
          low_authority_links_percent: number | null
          medium_authority_links_percent: number | null
          monthly_growth: number | null
          recorded_date: string | null
          referring_domains: number | null
          total_backlinks: number | null
          trust_flow: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          domain_authority?: number | null
          high_authority_links_percent?: number | null
          id?: string
          link_profile_health?: number | null
          low_authority_links_percent?: number | null
          medium_authority_links_percent?: number | null
          monthly_growth?: number | null
          recorded_date?: string | null
          referring_domains?: number | null
          total_backlinks?: number | null
          trust_flow?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          domain_authority?: number | null
          high_authority_links_percent?: number | null
          id?: string
          link_profile_health?: number | null
          low_authority_links_percent?: number | null
          medium_authority_links_percent?: number | null
          monthly_growth?: number | null
          recorded_date?: string | null
          referring_domains?: number | null
          total_backlinks?: number | null
          trust_flow?: number | null
          user_id?: string
        }
        Relationships: []
      }
      seo_backlinks: {
        Row: {
          anchor_text: string | null
          authority_score: number | null
          created_at: string
          domain: string
          first_seen: string | null
          id: string
          is_nofollow: boolean | null
          last_checked: string | null
          link_type: string | null
          referring_url: string
          status: string | null
          target_url: string
          traffic_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anchor_text?: string | null
          authority_score?: number | null
          created_at?: string
          domain: string
          first_seen?: string | null
          id?: string
          is_nofollow?: boolean | null
          last_checked?: string | null
          link_type?: string | null
          referring_url: string
          status?: string | null
          target_url: string
          traffic_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anchor_text?: string | null
          authority_score?: number | null
          created_at?: string
          domain?: string
          first_seen?: string | null
          id?: string
          is_nofollow?: boolean | null
          last_checked?: string | null
          link_type?: string | null
          referring_url?: string
          status?: string | null
          target_url?: string
          traffic_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_competitors: {
        Row: {
          analysis_data: Json | null
          competitor_domain: string
          competitor_name: string
          created_at: string
          id: string
          last_analyzed: string | null
          target_keywords: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          competitor_domain: string
          competitor_name: string
          created_at?: string
          id?: string
          last_analyzed?: string | null
          target_keywords?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          competitor_domain?: string
          competitor_name?: string
          created_at?: string
          id?: string
          last_analyzed?: string | null
          target_keywords?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_content_gaps: {
        Row: {
          competitor_ranking_urls: string[] | null
          content_outline: string | null
          content_type_suggestion: string | null
          created_at: string
          id: string
          is_targeted: boolean | null
          keyword: string
          keyword_difficulty: number | null
          priority_score: number | null
          search_volume: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competitor_ranking_urls?: string[] | null
          content_outline?: string | null
          content_type_suggestion?: string | null
          created_at?: string
          id?: string
          is_targeted?: boolean | null
          keyword: string
          keyword_difficulty?: number | null
          priority_score?: number | null
          search_volume?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competitor_ranking_urls?: string[] | null
          content_outline?: string | null
          content_type_suggestion?: string | null
          created_at?: string
          id?: string
          is_targeted?: boolean | null
          keyword?: string
          keyword_difficulty?: number | null
          priority_score?: number | null
          search_volume?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          created_at: string
          current_position: number | null
          difficulty: string | null
          id: string
          keyword: string
          last_checked: string | null
          previous_position: number | null
          search_volume: string | null
          target_url: string
          traffic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_position?: number | null
          difficulty?: string | null
          id?: string
          keyword: string
          last_checked?: string | null
          previous_position?: number | null
          search_volume?: string | null
          target_url: string
          traffic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_position?: number | null
          difficulty?: string | null
          id?: string
          keyword?: string
          last_checked?: string | null
          previous_position?: number | null
          search_volume?: string | null
          target_url?: string
          traffic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_page_settings: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_recommendations: {
        Row: {
          action_items: string[] | null
          ai_generated: boolean | null
          created_at: string
          description: string
          id: string
          impact_score: number | null
          implementation_difficulty: string | null
          is_implemented: boolean | null
          page_path: string
          priority: string | null
          recommendation_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_items?: string[] | null
          ai_generated?: boolean | null
          created_at?: string
          description: string
          id?: string
          impact_score?: number | null
          implementation_difficulty?: string | null
          is_implemented?: boolean | null
          page_path: string
          priority?: string | null
          recommendation_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_items?: string[] | null
          ai_generated?: boolean | null
          created_at?: string
          description?: string
          id?: string
          impact_score?: number | null
          implementation_difficulty?: string | null
          is_implemented?: boolean | null
          page_path?: string
          priority?: string | null
          recommendation_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seo_visitor_analytics: {
        Row: {
          bounce_rate: boolean | null
          browser: string | null
          city: string | null
          conversion_event: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          os: string | null
          page_load_time: number | null
          page_path: string
          referrer: string | null
          screen_resolution: string | null
          session_id: string
          time_on_page: number | null
          updated_at: string
          user_agent: string | null
          user_id: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
          website_domain: string
        }
        Insert: {
          bounce_rate?: boolean | null
          browser?: string | null
          city?: string | null
          conversion_event?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page_load_time?: number | null
          page_path: string
          referrer?: string | null
          screen_resolution?: string | null
          session_id: string
          time_on_page?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
          website_domain: string
        }
        Update: {
          bounce_rate?: boolean | null
          browser?: string | null
          city?: string | null
          conversion_event?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page_load_time?: number | null
          page_path?: string
          referrer?: string | null
          screen_resolution?: string | null
          session_id?: string
          time_on_page?: number | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
          website_domain?: string
        }
        Relationships: []
      }
      seo_website_configs: {
        Row: {
          created_at: string
          goals: Json | null
          id: string
          tracking_enabled: boolean | null
          updated_at: string
          user_id: string
          website_domain: string
          website_name: string
          widget_settings: Json | null
        }
        Insert: {
          created_at?: string
          goals?: Json | null
          id?: string
          tracking_enabled?: boolean | null
          updated_at?: string
          user_id: string
          website_domain: string
          website_name: string
          widget_settings?: Json | null
        }
        Update: {
          created_at?: string
          goals?: Json | null
          id?: string
          tracking_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          website_domain?: string
          website_name?: string
          widget_settings?: Json | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          department: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          department: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          completed: boolean
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_description: string | null
          activity_title: string
          activity_type: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_description?: string | null
          activity_title: string
          activity_type: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_description?: string | null
          activity_title?: string
          activity_type?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_gallery: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          is_public: boolean | null
          storage_path: string
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          is_public?: boolean | null
          storage_path: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          is_public?: boolean | null
          storage_path?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed_steps: string[] | null
          created_at: string
          current_step: number
          id: string
          initial_onboarding_completed: boolean | null
          last_seen_step: number | null
          onboarding_completed: boolean
          onboarding_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_steps?: string[] | null
          created_at?: string
          current_step?: number
          id?: string
          initial_onboarding_completed?: boolean | null
          last_seen_step?: number | null
          onboarding_completed?: boolean
          onboarding_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_steps?: string[] | null
          created_at?: string
          current_step?: number
          id?: string
          initial_onboarding_completed?: boolean | null
          last_seen_step?: number | null
          onboarding_completed?: boolean
          onboarding_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_model: string | null
          ai_suggestions_enabled: boolean | null
          auto_save_enabled: boolean | null
          backup_to_cloud_enabled: boolean | null
          context_awareness_enabled: boolean | null
          created_at: string
          dashboard_components: string[] | null
          dashboard_theme: string | null
          default_note_category: string | null
          id: string
          smart_formatting_enabled: boolean | null
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role_type"] | null
          weather_city: string | null
          weather_enabled: boolean | null
          weather_units: string | null
          weather_update_interval: number | null
        }
        Insert: {
          ai_model?: string | null
          ai_suggestions_enabled?: boolean | null
          auto_save_enabled?: boolean | null
          backup_to_cloud_enabled?: boolean | null
          context_awareness_enabled?: boolean | null
          created_at?: string
          dashboard_components?: string[] | null
          dashboard_theme?: string | null
          default_note_category?: string | null
          id?: string
          smart_formatting_enabled?: boolean | null
          updated_at?: string
          user_id: string
          user_role?: Database["public"]["Enums"]["user_role_type"] | null
          weather_city?: string | null
          weather_enabled?: boolean | null
          weather_units?: string | null
          weather_update_interval?: number | null
        }
        Update: {
          ai_model?: string | null
          ai_suggestions_enabled?: boolean | null
          auto_save_enabled?: boolean | null
          backup_to_cloud_enabled?: boolean | null
          context_awareness_enabled?: boolean | null
          created_at?: string
          dashboard_components?: string[] | null
          dashboard_theme?: string | null
          default_note_category?: string | null
          id?: string
          smart_formatting_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role_type"] | null
          weather_city?: string | null
          weather_enabled?: boolean | null
          weather_units?: string | null
          weather_update_interval?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string
          id: string
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          id: string
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_security_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role_type:
        | "developer"
        | "designer"
        | "product_manager"
        | "analyst"
        | "content_creator"
        | "student"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role_type: [
        "developer",
        "designer",
        "product_manager",
        "analyst",
        "content_creator",
        "student",
        "other",
      ],
    },
  },
} as const
