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
      admin_access: {
        Row: {
          id: number
          shared_password: string
        }
        Insert: {
          id?: number
          shared_password: string
        }
        Update: {
          id?: number
          shared_password?: string
        }
        Relationships: []
      }
      menu: {
        Row: {
          day: string
          default_items: string[]
          id: string
          is_default: boolean
          items: string[]
          meal_period: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          day: string
          default_items?: string[]
          id?: string
          is_default?: boolean
          items?: string[]
          meal_period: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          day?: string
          default_items?: string[]
          id?: string
          is_default?: boolean
          items?: string[]
          meal_period?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      mess_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          reset_by: string | null
          started_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          reset_by?: string | null
          started_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          reset_by?: string | null
          started_at?: string
        }
        Relationships: []
      }
      mess_settings: {
        Row: {
          breakfast_end: string
          breakfast_start: string
          dinner_end: string
          dinner_start: string
          high_max: number
          id: string
          low_max: number
          lunch_end: string
          lunch_start: string
          medium_max: number
          snacks_end: string
          snacks_start: string
          total_seats: number
          updated_at: string
          updated_by: string | null
          very_low_max: number
        }
        Insert: {
          breakfast_end?: string
          breakfast_start?: string
          dinner_end?: string
          dinner_start?: string
          high_max?: number
          id?: string
          low_max?: number
          lunch_end?: string
          lunch_start?: string
          medium_max?: number
          snacks_end?: string
          snacks_start?: string
          total_seats?: number
          updated_at?: string
          updated_by?: string | null
          very_low_max?: number
        }
        Update: {
          breakfast_end?: string
          breakfast_start?: string
          dinner_end?: string
          dinner_start?: string
          high_max?: number
          id?: string
          low_max?: number
          lunch_end?: string
          lunch_start?: string
          medium_max?: number
          snacks_end?: string
          snacks_start?: string
          total_seats?: number
          updated_at?: string
          updated_by?: string | null
          very_low_max?: number
        }
        Relationships: []
      }
      problems: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          status: Database["public"]["Enums"]["problem_status"]
          student_id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["problem_status"]
          student_id: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["problem_status"]
          student_id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problems_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          qr_code: string
          role: Database["public"]["Enums"]["app_role"]
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id: string
          qr_code?: string
          role?: Database["public"]["Enums"]["app_role"]
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          qr_code?: string
          role?: Database["public"]["Enums"]["app_role"]
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qr_transactions: {
        Row: {
          action: Database["public"]["Enums"]["occupancy_status"]
          created_at: string
          id: string
          performed_by: string | null
          performed_by_name: string | null
          session_id: string | null
          student_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["occupancy_status"]
          created_at?: string
          id?: string
          performed_by?: string | null
          performed_by_name?: string | null
          session_id?: string | null
          student_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["occupancy_status"]
          created_at?: string
          id?: string
          performed_by?: string | null
          performed_by_name?: string | null
          session_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_transactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mess_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_occupancy: {
        Row: {
          current_status: Database["public"]["Enums"]["occupancy_status"]
          entered_at: string | null
          id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          current_status?: Database["public"]["Enums"]["occupancy_status"]
          entered_at?: string | null
          id?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          current_status?: Database["public"]["Enums"]["occupancy_status"]
          entered_at?: string | null
          id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_occupancy_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "admin"
      occupancy_status: "IN" | "OUT"
      problem_status: "Pending" | "In Progress" | "Resolved" | "Rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["student", "admin"],
      occupancy_status: ["IN", "OUT"],
      problem_status: ["Pending", "In Progress", "Resolved", "Rejected"],
    },
  },
} as const
