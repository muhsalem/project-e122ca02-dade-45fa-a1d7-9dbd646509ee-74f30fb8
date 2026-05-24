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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assessment_reports: {
        Row: {
          age: string | null
          answers: Json
          code: string
          created_at: string
          group_code: string | null
          id: string
          name: string | null
          report: string
          stage: string | null
        }
        Insert: {
          age?: string | null
          answers: Json
          code: string
          created_at?: string
          group_code?: string | null
          id?: string
          name?: string | null
          report: string
          stage?: string | null
        }
        Update: {
          age?: string | null
          answers?: Json
          code?: string
          created_at?: string
          group_code?: string | null
          id?: string
          name?: string | null
          report?: string
          stage?: string | null
        }
        Relationships: []
      }
      clarity_scores: {
        Row: {
          code: string
          created_at: string
          id: string
          phase: string
          q1_self_awareness: number
          q2_career_options: number
          q3_decision_confidence: number
          q4_action_plan: number
          q5_future_optimism: number
          total_score: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          phase: string
          q1_self_awareness: number
          q2_career_options: number
          q3_decision_confidence: number
          q4_action_plan: number
          q5_future_optimism: number
          total_score: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          phase?: string
          q1_self_awareness?: number
          q2_career_options?: number
          q3_decision_confidence?: number
          q4_action_plan?: number
          q5_future_optimism?: number
          total_score?: number
        }
        Relationships: []
      }
      coach_ratings: {
        Row: {
          clarity: number
          coach_name: string
          comment: string | null
          created_at: string
          id: string
          overall: number
          professionalism: number
          reviewer_email: string | null
          reviewer_name: string | null
          session_date: string | null
          usefulness: number
          would_recommend: boolean
        }
        Insert: {
          clarity: number
          coach_name: string
          comment?: string | null
          created_at?: string
          id?: string
          overall: number
          professionalism: number
          reviewer_email?: string | null
          reviewer_name?: string | null
          session_date?: string | null
          usefulness: number
          would_recommend?: boolean
        }
        Update: {
          clarity?: number
          coach_name?: string
          comment?: string | null
          created_at?: string
          id?: string
          overall?: number
          professionalism?: number
          reviewer_email?: string | null
          reviewer_name?: string | null
          session_date?: string | null
          usefulness?: number
          would_recommend?: boolean
        }
        Relationships: []
      }
      coaches: {
        Row: {
          bio: string
          certifications: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          email: string
          experience_years: number
          full_name: string
          hourly_price: number | null
          id: string
          languages: string[]
          linkedin_url: string | null
          phone: string | null
          photo_url: string | null
          specializations: string[]
          status: Database["public"]["Enums"]["coach_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio: string
          certifications?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          email: string
          experience_years?: number
          full_name: string
          hourly_price?: number | null
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          specializations?: string[]
          status?: Database["public"]["Enums"]["coach_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string
          certifications?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          email?: string
          experience_years?: number
          full_name?: string
          hourly_price?: number | null
          id?: string
          languages?: string[]
          linkedin_url?: string | null
          phone?: string | null
          photo_url?: string | null
          specializations?: string[]
          status?: Database["public"]["Enums"]["coach_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      development_plans: {
        Row: {
          career_goal: string
          code: string
          created_at: string
          current_stage: string | null
          id: string
          milestones: Json
          recommended_courses: Json
          report_code: string
          skills_to_develop: Json
          success_metrics: string | null
          updated_at: string
          weekly_actions: Json
        }
        Insert: {
          career_goal: string
          code: string
          created_at?: string
          current_stage?: string | null
          id?: string
          milestones?: Json
          recommended_courses?: Json
          report_code: string
          skills_to_develop?: Json
          success_metrics?: string | null
          updated_at?: string
          weekly_actions?: Json
        }
        Update: {
          career_goal?: string
          code?: string
          created_at?: string
          current_stage?: string | null
          id?: string
          milestones?: Json
          recommended_courses?: Json
          report_code?: string
          skills_to_develop?: Json
          success_metrics?: string | null
          updated_at?: string
          weekly_actions?: Json
        }
        Relationships: []
      }
      wellbeing_screenings: {
        Row: {
          career_anx_q1: number
          career_anx_q2: number
          career_anx_q3: number
          career_anx_total: number
          code: string
          created_at: string
          gad2_q1: number
          gad2_q2: number
          gad2_total: number
          id: string
          phq2_q1: number
          phq2_q2: number
          phq2_total: number
          referral_needed: boolean
          risk_level: string
        }
        Insert: {
          career_anx_q1: number
          career_anx_q2: number
          career_anx_q3: number
          career_anx_total: number
          code: string
          created_at?: string
          gad2_q1: number
          gad2_q2: number
          gad2_total: number
          id?: string
          phq2_q1: number
          phq2_q2: number
          phq2_total: number
          referral_needed?: boolean
          risk_level: string
        }
        Update: {
          career_anx_q1?: number
          career_anx_q2?: number
          career_anx_q3?: number
          career_anx_total?: number
          code?: string
          created_at?: string
          gad2_q1?: number
          gad2_q2?: number
          gad2_total?: number
          id?: string
          phq2_q1?: number
          phq2_q2?: number
          phq2_total?: number
          referral_needed?: boolean
          risk_level?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      coach_status: "pending" | "approved" | "rejected"
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
      coach_status: ["pending", "approved", "rejected"],
    },
  },
} as const
