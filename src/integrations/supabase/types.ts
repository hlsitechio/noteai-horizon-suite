export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_interactions: {
        Row: {
          created_at: string | null
          id: string
          note_content: string
          request_type: string
          response: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_content: string
          request_type: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note_content?: string
          request_type?: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_interactions_v2: {
        Row: {
          created_at: string | null
          feedback_rating: number | null
          id: string
          interaction_type: string
          model_used: string | null
          note_id: string | null
          processing_time: number | null
          prompt: string | null
          response: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          interaction_type: string
          model_used?: string | null
          note_id?: string | null
          processing_time?: number | null
          prompt?: string | null
          response?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_rating?: number | null
          id?: string
          interaction_type?: string
          model_used?: string | null
          note_id?: string | null
          processing_time?: number | null
          prompt?: string | null
          response?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_v2_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_tracking: {
        Row: {
          created_at: string
          date: string
          id: string
          request_type: string
          subscription_tier: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          request_type: string
          subscription_tier?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          request_type?: string
          subscription_tier?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_moderation: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          flags: Json | null
          id: string
          moderation_status: string | null
          moderator_notes: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_status?: string | null
          moderator_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          flags?: Json | null
          id?: string
          moderation_status?: string | null
          moderator_notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cron_job_logs: {
        Row: {
          completed_at: string | null
          details: Json | null
          error_message: string | null
          id: string
          job_name: string
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          job_name: string
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          job_name?: string
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      data: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gemini_models: {
        Row: {
          capabilities: Json
          id: number
          input_token_limit: number
          knowledge_cutoff: string
          latest_update: string
          model_code: string
          output_token_limit: number
          preview_versions: Json | null
          stable_version: string
        }
        Insert: {
          capabilities: Json
          id?: never
          input_token_limit: number
          knowledge_cutoff: string
          latest_update: string
          model_code: string
          output_token_limit: number
          preview_versions?: Json | null
          stable_version: string
        }
        Update: {
          capabilities?: Json
          id?: never
          input_token_limit?: number
          knowledge_cutoff?: string
          latest_update?: string
          model_code?: string
          output_token_limit?: number
          preview_versions?: Json | null
          stable_version?: string
        }
        Relationships: []
      }
      note_shares: {
        Row: {
          access_count: number | null
          access_level: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          note_id: string | null
          share_type: string | null
          shared_by: string | null
          shared_with: string | null
          updated_at: string | null
        }
        Insert: {
          access_count?: number | null
          access_level?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          note_id?: string | null
          share_type?: string | null
          shared_by?: string | null
          shared_with?: string | null
          updated_at?: string | null
        }
        Update: {
          access_count?: number | null
          access_level?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          note_id?: string | null
          share_type?: string | null
          shared_by?: string | null
          shared_with?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_shares_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      note_versions: {
        Row: {
          changes_summary: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          note_id: string | null
          version: number
        }
        Insert: {
          changes_summary?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_id?: string | null
          version: number
        }
        Update: {
          changes_summary?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          note_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "note_versions_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          is_encrypted: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          is_encrypted?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_encrypted?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_v2: {
        Row: {
          content: string
          content_type: string | null
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          is_public: boolean | null
          last_accessed_at: string | null
          parent_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          last_accessed_at?: string | null
          parent_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_public?: boolean | null
          last_accessed_at?: string | null
          parent_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_v2_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "notes_v2"
            referencedColumns: ["id"]
          },
        ]
      }
      page_visits: {
        Row: {
          city: string | null
          country: string | null
          id: string
          ip_address: string | null
          page_path: string
          referrer: string | null
          user_agent: string | null
          visited_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: string | null
          page_path: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          id?: string
          ip_address?: string | null
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
          visited_at?: string
        }
        Relationships: []
      }
      pwa_analytics: {
        Row: {
          browser: string | null
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          platform: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          platform?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number | null
          updated_at: string | null
          window_start: string | null
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: unknown
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Update: {
          blocked_until?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          updated_at?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          incident_type: string
          ip_address: unknown | null
          resolved: boolean | null
          severity: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          incident_type: string
          ip_address?: unknown | null
          resolved?: boolean | null
          severity?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          incident_type?: string
          ip_address?: unknown | null
          resolved?: boolean | null
          severity?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          description: string | null
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_name: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      shared_notes: {
        Row: {
          content: string
          created_at: string
          expires_at: string
          id: string
          views: number | null
        }
        Insert: {
          content: string
          created_at?: string
          expires_at: string
          id: string
          views?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          views?: number | null
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
      sync_queue: {
        Row: {
          created_at: string | null
          data: Json | null
          error_message: string | null
          id: string
          operation_type: string
          processed_at: string | null
          record_id: string | null
          retry_count: number | null
          status: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          operation_type: string
          processed_at?: string | null
          record_id?: string | null
          retry_count?: number | null
          status?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          error_message?: string | null
          id?: string
          operation_type?: string
          processed_at?: string | null
          record_id?: string | null
          retry_count?: number | null
          status?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          ai_preferences: Json | null
          created_at: string | null
          editor_preferences: Json | null
          id: string
          notification_preferences: Json | null
          sync_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_preferences?: Json | null
          created_at?: string | null
          editor_preferences?: Json | null
          id?: string
          notification_preferences?: Json | null
          sync_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_preferences?: Json | null
          created_at?: string | null
          editor_preferences?: Json | null
          id?: string
          notification_preferences?: Json | null
          sync_preferences?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      daily_visit_counts: {
        Row: {
          page_path: string | null
          visit_count: number | null
          visit_date: string | null
        }
        Relationships: []
      }
      pwa_analytics_summary: {
        Row: {
          count: number | null
          date: string | null
          device_type: string | null
          event_type: string | null
          platform: string | null
        }
        Relationships: []
      }
      visitor_stats: {
        Row: {
          last_visit_date: string | null
          total_visits: number | null
          unique_visitors: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_make_ai_request: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_enhanced_rate_limit: {
        Args: {
          user_uuid: string
          action_type: string
          max_requests?: number
          time_window?: unknown
        }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          user_uuid: string
          action_type: string
          max_requests?: number
          time_window?: unknown
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_daily_ai_usage: {
        Args:
          | Record<PropertyKey, never>
          | { user_uuid: string; usage_date?: string }
        Returns: {
          user_id: string
          daily_count: number
          usage_date: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      sanitize_input: {
        Args: { input_text: string }
        Returns: string
      }
      validate_content_length: {
        Args:
          | Record<PropertyKey, never>
          | { content: string; max_length?: number }
        Returns: boolean
      }
      validate_note_content: {
        Args: { content: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
