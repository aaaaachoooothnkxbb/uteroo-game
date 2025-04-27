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
      avatar_customizations: {
        Row: {
          accessories: Json | null
          background_theme: string | null
          body_type: string | null
          created_at: string
          eye_color: string | null
          eye_shape: string | null
          face_features: Json | null
          hair_color: string | null
          hair_style: string | null
          id: string
          outfit: Json | null
          posture: string | null
          skin_tone: string | null
          unlocked_features: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accessories?: Json | null
          background_theme?: string | null
          body_type?: string | null
          created_at?: string
          eye_color?: string | null
          eye_shape?: string | null
          face_features?: Json | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          outfit?: Json | null
          posture?: string | null
          skin_tone?: string | null
          unlocked_features?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accessories?: Json | null
          background_theme?: string | null
          body_type?: string | null
          created_at?: string
          eye_color?: string | null
          eye_shape?: string | null
          face_features?: Json | null
          hair_color?: string | null
          hair_style?: string | null
          id?: string
          outfit?: Json | null
          posture?: string | null
          skin_tone?: string | null
          unlocked_features?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatar_customizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cultural_practices: {
        Row: {
          benefits: string[]
          country_origin: string
          created_at: string
          description: string
          id: string
          instructions: string
          phase: string
          practice_name: string
        }
        Insert: {
          benefits: string[]
          country_origin: string
          created_at?: string
          description: string
          id?: string
          instructions: string
          phase: string
          practice_name: string
        }
        Update: {
          benefits?: string[]
          country_origin?: string
          created_at?: string
          description?: string
          id?: string
          instructions?: string
          phase?: string
          practice_name?: string
        }
        Relationships: []
      }
      cycle_rewards: {
        Row: {
          brand: string
          created_at: string
          description: string
          discount_code: string
          id: string
          required_streak: number
          reward_name: string
          valid_until: string
        }
        Insert: {
          brand: string
          created_at?: string
          description: string
          discount_code: string
          id?: string
          required_streak: number
          reward_name: string
          valid_until: string
        }
        Update: {
          brand?: string
          created_at?: string
          description?: string
          discount_code?: string
          id?: string
          required_streak?: number
          reward_name?: string
          valid_until?: string
        }
        Relationships: []
      }
      cycle_tracking: {
        Row: {
          created_at: string
          cycle_length: number | null
          cycle_start_date: string
          id: string
          period_length: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          cycle_length?: number | null
          cycle_start_date: string
          id?: string
          period_length?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          cycle_length?: number | null
          cycle_start_date?: string
          id?: string
          period_length?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cycle_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_activities: {
        Row: {
          activity_type: string
          completed: boolean | null
          created_at: string
          date: string
          id: string
          points: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          completed?: boolean | null
          created_at?: string
          date: string
          id?: string
          points?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          completed?: boolean | null
          created_at?: string
          date?: string
          id?: string
          points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          coins_earned: number
          created_at: string | null
          game_type: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          coins_earned: number
          created_at?: string | null
          game_type: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          coins_earned?: number
          created_at?: string | null
          game_type?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      grocery_lists: {
        Row: {
          created_at: string | null
          id: string
          is_checked: boolean | null
          item_name: string
          phase: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_checked?: boolean | null
          item_name: string
          phase: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_checked?: boolean | null
          item_name?: string
          phase?: string
        }
        Relationships: []
      }
      hormone_analysis: {
        Row: {
          commentary: string
          created_at: string
          hormone_levels: Json | null
          id: string
          phase: string
          prediction: string
          suggestions: string[]
        }
        Insert: {
          commentary: string
          created_at?: string
          hormone_levels?: Json | null
          id?: string
          phase: string
          prediction: string
          suggestions: string[]
        }
        Update: {
          commentary?: string
          created_at?: string
          hormone_levels?: Json | null
          id?: string
          phase?: string
          prediction?: string
          suggestions?: string[]
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: string
          notes: string | null
          symptoms: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          mood: string
          notes?: string | null
          symptoms?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: string
          notes?: string | null
          symptoms?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_stats: {
        Row: {
          coins: number | null
          created_at: string | null
          energy: number | null
          experience: number | null
          happiness: number | null
          hunger: number | null
          hygiene: number | null
          id: string
          last_updated: string | null
          level: number | null
          user_id: string
        }
        Insert: {
          coins?: number | null
          created_at?: string | null
          energy?: number | null
          experience?: number | null
          happiness?: number | null
          hunger?: number | null
          hygiene?: number | null
          id?: string
          last_updated?: string | null
          level?: number | null
          user_id: string
        }
        Update: {
          coins?: number | null
          created_at?: string | null
          energy?: number | null
          experience?: number | null
          happiness?: number | null
          hunger?: number | null
          hygiene?: number | null
          id?: string
          last_updated?: string | null
          level?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      phase_recommendations: {
        Row: {
          category: Database["public"]["Enums"]["recommendation_category"]
          created_at: string
          day: number
          id: string
          instructions: string
          phase: Database["public"]["Enums"]["cycle_phase"]
          recommendation: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["recommendation_category"]
          created_at?: string
          day: number
          id?: string
          instructions: string
          phase: Database["public"]["Enums"]["cycle_phase"]
          recommendation: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["recommendation_category"]
          created_at?: string
          day?: number
          id?: string
          instructions?: string
          phase?: Database["public"]["Enums"]["cycle_phase"]
          recommendation?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      recipe_roulette: {
        Row: {
          bonus_ingredients: string[]
          cooking_tips: string[]
          created_at: string
          id: string
          ingredients: string[]
          instructions: string[]
          phase: string
          recipe_name: string
        }
        Insert: {
          bonus_ingredients: string[]
          cooking_tips: string[]
          created_at?: string
          id?: string
          ingredients: string[]
          instructions: string[]
          phase: string
          recipe_name: string
        }
        Update: {
          bonus_ingredients?: string[]
          cooking_tips?: string[]
          created_at?: string
          id?: string
          ingredients?: string[]
          instructions?: string[]
          phase?: string
          recipe_name?: string
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          created_at: string | null
          description: string | null
          effects: Json | null
          id: string
          name: string
          price: number
          type: Database["public"]["Enums"]["item_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          effects?: Json | null
          id?: string
          name: string
          price: number
          type: Database["public"]["Enums"]["item_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          effects?: Json | null
          id?: string
          name?: string
          price?: number
          type?: Database["public"]["Enums"]["item_type"]
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          created_at: string | null
          id: string
          is_equipped: boolean | null
          item_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_equipped?: boolean | null
          item_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_equipped?: boolean | null
          item_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      yoga_poses: {
        Row: {
          benefits: string[]
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["yoga_difficulty"] | null
          id: string
          instructions: string[]
          name: string
          phase: string
          sanskrit_name: string | null
        }
        Insert: {
          benefits: string[]
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["yoga_difficulty"] | null
          id?: string
          instructions: string[]
          name: string
          phase: string
          sanskrit_name?: string | null
        }
        Update: {
          benefits?: string[]
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["yoga_difficulty"] | null
          id?: string
          instructions?: string[]
          name?: string
          phase?: string
          sanskrit_name?: string | null
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
      cycle_phase:
        | "Menstruation Flatland"
        | "Follicular Uphill"
        | "Ovulatory Mountain"
        | "Luteal Hill"
      item_type: "food" | "potion" | "clothing" | "decoration"
      recommendation_category: "Affirmation" | "Recipe" | "Yoga Pose"
      yoga_difficulty: "beginner" | "intermediate" | "advanced"
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
      cycle_phase: [
        "Menstruation Flatland",
        "Follicular Uphill",
        "Ovulatory Mountain",
        "Luteal Hill",
      ],
      item_type: ["food", "potion", "clothing", "decoration"],
      recommendation_category: ["Affirmation", "Recipe", "Yoga Pose"],
      yoga_difficulty: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
