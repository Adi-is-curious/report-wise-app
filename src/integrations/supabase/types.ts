export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: number
          is_active: boolean | null
          name: string
          name_hindi: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          name_hindi: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          name_hindi?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          description_hindi: string
          id: string
          report_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          description_hindi: string
          id?: string
          report_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          description_hindi?: string
          id?: string
          report_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_official: boolean | null
          report_id: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_official?: boolean | null
          report_id: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_official?: boolean | null
          report_id?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          message_hindi: string
          report_id: string | null
          title: string
          title_hindi: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          message_hindi: string
          report_id?: string | null
          title: string
          title_hindi: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_hindi?: string
          report_id?: string | null
          title?: string
          title_hindi?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          coins: number | null
          community_score: number | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone_number: string | null
          state: string | null
          total_reports: number | null
          updated_at: string
          user_id: string
          verified_reports: number | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          coins?: number | null
          community_score?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          state?: string | null
          total_reports?: number | null
          updated_at?: string
          user_id: string
          verified_reports?: number | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          coins?: number | null
          community_score?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone_number?: string | null
          state?: string | null
          total_reports?: number | null
          updated_at?: string
          user_id?: string
          verified_reports?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          actual_resolution_date: string | null
          address: string | null
          admin_notes: string | null
          ai_analysis: Json | null
          assigned_department: string | null
          category_id: number
          created_at: string
          description: string
          downvotes: number | null
          estimated_resolution_date: string | null
          id: string
          is_anonymous: boolean | null
          is_duplicate: boolean | null
          is_recurring: boolean | null
          latitude: number | null
          location_name: string
          longitude: number | null
          media_urls: string[] | null
          parent_report_id: string | null
          priority_score: number | null
          resolution_notes: string | null
          status: string
          title: string
          updated_at: string
          upvotes: number | null
          urgency_level: string
          user_id: string
          views: number | null
        }
        Insert: {
          actual_resolution_date?: string | null
          address?: string | null
          admin_notes?: string | null
          ai_analysis?: Json | null
          assigned_department?: string | null
          category_id: number
          created_at?: string
          description: string
          downvotes?: number | null
          estimated_resolution_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_duplicate?: boolean | null
          is_recurring?: boolean | null
          latitude?: number | null
          location_name: string
          longitude?: number | null
          media_urls?: string[] | null
          parent_report_id?: string | null
          priority_score?: number | null
          resolution_notes?: string | null
          status?: string
          title: string
          updated_at?: string
          upvotes?: number | null
          urgency_level: string
          user_id: string
          views?: number | null
        }
        Update: {
          actual_resolution_date?: string | null
          address?: string | null
          admin_notes?: string | null
          ai_analysis?: Json | null
          assigned_department?: string | null
          category_id?: number
          created_at?: string
          description?: string
          downvotes?: number | null
          estimated_resolution_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_duplicate?: boolean | null
          is_recurring?: boolean | null
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          media_urls?: string[] | null
          parent_report_id?: string | null
          priority_score?: number | null
          resolution_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
          upvotes?: number | null
          urgency_level?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_parent_report_id_fkey"
            columns: ["parent_report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          category: string
          coins_required: number
          created_at: string
          description: string
          description_hindi: string
          id: number
          image_url: string | null
          is_available: boolean | null
          times_redeemed: number | null
          title: string
          title_hindi: string
          total_available: number | null
        }
        Insert: {
          category: string
          coins_required: number
          created_at?: string
          description: string
          description_hindi: string
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          times_redeemed?: number | null
          title: string
          title_hindi: string
          total_available?: number | null
        }
        Update: {
          category?: string
          coins_required?: number
          created_at?: string
          description?: string
          description_hindi?: string
          id?: number
          image_url?: string | null
          is_available?: boolean | null
          times_redeemed?: number | null
          title?: string
          title_hindi?: string
          total_available?: number | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          id: string
          redeemed_at: string
          reward_id: number
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          redeemed_at?: string
          reward_id: number
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          redeemed_at?: string
          reward_id?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: string
          report_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_profile_data: {
        Args: { profile_user_id: string }
        Returns: {
          avatar_url: string
          full_name: string
          user_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
