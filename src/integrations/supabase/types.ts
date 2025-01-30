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
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
