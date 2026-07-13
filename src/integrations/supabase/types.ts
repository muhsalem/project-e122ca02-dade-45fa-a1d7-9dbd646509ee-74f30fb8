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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_ip: string | null
          created_at: string
          id: string
          metadata: Json
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_ip?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_ip?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          coach_id: string
          coach_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          notes: string | null
          session_date: string
          session_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          coach_id: string
          coach_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_date: string
          session_time: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          coach_id?: string
          coach_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          session_date?: string
          session_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_ladders: {
        Row: {
          created_at: string
          id: string
          isco: string | null
          key_responsibilities: string
          level_order: number
          level_title: string
          next_step_skills: string
          role_family: string
          years_experience: string
        }
        Insert: {
          created_at?: string
          id?: string
          isco?: string | null
          key_responsibilities: string
          level_order: number
          level_title: string
          next_step_skills: string
          role_family: string
          years_experience: string
        }
        Update: {
          created_at?: string
          id?: string
          isco?: string | null
          key_responsibilities?: string
          level_order?: number
          level_title?: string
          next_step_skills?: string
          role_family?: string
          years_experience?: string
        }
        Relationships: []
      }
      career_plans: {
        Row: {
          created_at: string
          goals: Json
          track: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goals?: Json
          track?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goals?: Json
          track?: string | null
          updated_at?: string
          user_id?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      consent_log: {
        Row: {
          assessment_key: string
          consent_text: string | null
          created_at: string
          guardian_confirmed: boolean
          guardian_contact: string | null
          guardian_name: string | null
          guardian_relation: string | null
          id: string
          ip_address: string | null
          is_minor: boolean
          student_age: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          assessment_key: string
          consent_text?: string | null
          created_at?: string
          guardian_confirmed?: boolean
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relation?: string | null
          id?: string
          ip_address?: string | null
          is_minor: boolean
          student_age: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          assessment_key?: string
          consent_text?: string | null
          created_at?: string
          guardian_confirmed?: boolean
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relation?: string | null
          id?: string
          ip_address?: string | null
          is_minor?: boolean
          student_age?: number
          user_agent?: string | null
          user_id?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          weekly_actions?: Json
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          id: string
          mood: number
          tags: string[]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          mood: number
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          mood?: number
          tags?: string[]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_coach_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          submission_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          submission_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_coach_messages_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "learning_dna_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_dna_submissions: {
        Row: {
          ai_report: string | null
          answers: Json
          band: string | null
          code: string
          created_at: string
          dimension_scores: Json
          dls: number | null
          foc: number | null
          id: string
          las: number | null
          les: number | null
          pss: number | null
          ret: number | null
          sls: number | null
          task_results: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_report?: string | null
          answers?: Json
          band?: string | null
          code: string
          created_at?: string
          dimension_scores?: Json
          dls?: number | null
          foc?: number | null
          id?: string
          las?: number | null
          les?: number | null
          pss?: number | null
          ret?: number | null
          sls?: number | null
          task_results?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_report?: string | null
          answers?: Json
          band?: string | null
          code?: string
          created_at?: string
          dimension_scores?: Json
          dls?: number | null
          foc?: number | null
          id?: string
          las?: number | null
          les?: number | null
          pss?: number | null
          ret?: number | null
          sls?: number | null
          task_results?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_minor: number
          country_code: string
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          gateway: string | null
          gateway_ref: string | null
          id: string
          metadata: Json
          order_number: string
          paid_at: string | null
          product_code: string
          product_name: string
          quantity: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_minor: number
          country_code: string
          created_at?: string
          currency: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          gateway?: string | null
          gateway_ref?: string | null
          id?: string
          metadata?: Json
          order_number?: string
          paid_at?: string | null
          product_code: string
          product_name: string
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_minor?: number
          country_code?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          gateway?: string | null
          gateway_ref?: string | null
          id?: string
          metadata?: Json
          order_number?: string
          paid_at?: string | null
          product_code?: string
          product_name?: string
          quantity?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_minor: number
          created_at: string
          currency: string
          error_message: string | null
          gateway: string
          gateway_ref: string | null
          id: string
          order_id: string
          raw: Json
          status: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          created_at?: string
          currency: string
          error_message?: string | null
          gateway: string
          gateway_ref?: string | null
          id?: string
          order_id: string
          raw?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          created_at?: string
          currency?: string
          error_message?: string | null
          gateway?: string
          gateway_ref?: string | null
          id?: string
          order_id?: string
          raw?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      poia_occupations: {
        Row: {
          avg_burnout: number | null
          avg_health_impact: number | null
          avg_income_band: string | null
          avg_pressure: number | null
          avg_satisfaction: number | null
          avg_wlb: number | null
          created_at: string
          id: string
          name_ar: string
          name_en: string | null
          sector: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          avg_burnout?: number | null
          avg_health_impact?: number | null
          avg_income_band?: string | null
          avg_pressure?: number | null
          avg_satisfaction?: number | null
          avg_wlb?: number | null
          created_at?: string
          id?: string
          name_ar: string
          name_en?: string | null
          sector?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          avg_burnout?: number | null
          avg_health_impact?: number | null
          avg_income_band?: string | null
          avg_pressure?: number | null
          avg_satisfaction?: number | null
          avg_wlb?: number | null
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string | null
          sector?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      poia_submissions: {
        Row: {
          ai_report: string | null
          answers: Json
          band: string | null
          bri_score: number | null
          cfs_score: number | null
          code: string
          context: Json
          created_at: string
          csi_score: number | null
          id: string
          oh_score: number | null
          pi_score: number | null
          qwl_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_report?: string | null
          answers?: Json
          band?: string | null
          bri_score?: number | null
          cfs_score?: number | null
          code: string
          context?: Json
          created_at?: string
          csi_score?: number | null
          id?: string
          oh_score?: number | null
          pi_score?: number | null
          qwl_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_report?: string | null
          answers?: Json
          band?: string | null
          bri_score?: number | null
          cfs_score?: number | null
          code?: string
          context?: Json
          created_at?: string
          csi_score?: number | null
          id?: string
          oh_score?: number | null
          pi_score?: number | null
          qwl_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          birth_year: number | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          birth_year?: number | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          bucket: string
          client_key: string
          hits: number
          id: string
          window_start: string
        }
        Insert: {
          bucket: string
          client_key: string
          hits?: number
          id?: string
          window_start?: string
        }
        Update: {
          bucket?: string
          client_key?: string
          hits?: number
          id?: string
          window_start?: string
        }
        Relationships: []
      }
      report_cache: {
        Row: {
          cache_key: string
          created_at: string
          expires_at: string
          hit_count: number
          id: string
          report: string
          report_type: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          expires_at?: string
          hit_count?: number
          id?: string
          report: string
          report_type: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          expires_at?: string
          hit_count?: number
          id?: string
          report?: string
          report_type?: string
        }
        Relationships: []
      }
      review_requests: {
        Row: {
          code: string
          context: string | null
          created_at: string
          expires_at: string
          id: string
          subject_email: string | null
          subject_name: string
        }
        Insert: {
          code: string
          context?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          subject_email?: string | null
          subject_name: string
        }
        Update: {
          code?: string
          context?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          subject_email?: string | null
          subject_name?: string
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          adaptability: number
          communication: number
          created_at: string
          id: string
          improvement_text: string | null
          leadership: number
          problem_solving: number
          request_code: string
          responsibility: number
          reviewer_relation: string
          strengths: number
          strengths_text: string | null
          suggested_career: string | null
          teamwork: number
          work_ethic: number
        }
        Insert: {
          adaptability: number
          communication: number
          created_at?: string
          id?: string
          improvement_text?: string | null
          leadership: number
          problem_solving: number
          request_code: string
          responsibility: number
          reviewer_relation: string
          strengths: number
          strengths_text?: string | null
          suggested_career?: string | null
          teamwork: number
          work_ethic: number
        }
        Update: {
          adaptability?: number
          communication?: number
          created_at?: string
          id?: string
          improvement_text?: string | null
          leadership?: number
          problem_solving?: number
          request_code?: string
          responsibility?: number
          reviewer_relation?: string
          strengths?: number
          strengths_text?: string | null
          suggested_career?: string | null
          teamwork?: number
          work_ethic?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_bucket: string
          p_client_key: string
          p_limit: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "professional" | "coach" | "admin"
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
      app_role: ["student", "professional", "coach", "admin"],
      coach_status: ["pending", "approved", "rejected"],
    },
  },
} as const
