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
      contributions: {
        Row: {
          amount: number
          created_at: string
          gift_id: string | null
          guest_email: string | null
          guest_name: string
          id: string
          message: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          wedding_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          gift_id?: string | null
          guest_email?: string | null
          guest_name: string
          id?: string
          message?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          wedding_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          gift_id?: string | null
          guest_email?: string | null
          guest_name?: string
          id?: string
          message?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contributions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gift_stats"
            referencedColumns: ["gift_id"]
          },
          {
            foreignKeyName: "contributions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "contributions_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          sort_order: number
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_categories_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "gift_categories_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_reservations: {
        Row: {
          created_at: string
          gift_id: string
          guest_email: string | null
          guest_name: string
          id: string
          message: string | null
          quantity: number
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          gift_id: string
          guest_email?: string | null
          guest_name: string
          id?: string
          message?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          gift_id?: string
          guest_email?: string | null
          guest_name?: string
          id?: string
          message?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_reservations_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gift_stats"
            referencedColumns: ["gift_id"]
          },
          {
            foreignKeyName: "gift_reservations_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_reservations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "gift_reservations_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      gifts: {
        Row: {
          allow_partial_contributions: boolean
          category_id: string | null
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          price: number | null
          quantity_desired: number
          sort_order: number
          status: Database["public"]["Enums"]["gift_status"]
          title: string
          updated_at: string
          wedding_id: string
        }
        Insert: {
          allow_partial_contributions?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          price?: number | null
          quantity_desired?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["gift_status"]
          title: string
          updated_at?: string
          wedding_id: string
        }
        Update: {
          allow_partial_contributions?: boolean
          category_id?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          price?: number | null
          quantity_desired?: number
          sort_order?: number
          status?: Database["public"]["Enums"]["gift_status"]
          title?: string
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gifts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gift_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guestbook_messages: {
        Row: {
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          updated_at: string
          wedding_id: string
        }
        Insert: {
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          updated_at?: string
          wedding_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_messages_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "guestbook_messages_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          id: string
          is_read: boolean
          title: string
          type: string
          user_id: string
          wedding_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          title: string
          type: string
          user_id: string
          wedding_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          title?: string
          type?: string
          user_id?: string
          wedding_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "notifications_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          companions: number
          created_at: string
          guest_email: string | null
          guest_name: string
          id: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["rsvp_status"]
          updated_at: string
          wedding_id: string
        }
        Insert: {
          companions?: number
          created_at?: string
          guest_email?: string | null
          guest_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          wedding_id: string
        }
        Update: {
          companions?: number
          created_at?: string
          guest_email?: string | null
          guest_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["rsvp_status"]
          updated_at?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "rsvps_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["wedding_member_role"]
          user_id: string
          wedding_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["wedding_member_role"]
          user_id: string
          wedding_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["wedding_member_role"]
          user_id?: string
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wedding_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wedding_members_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "wedding_members_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      weddings: {
        Row: {
          cover_image_url: string | null
          created_at: string
          event_date: string | null
          event_location: string | null
          hero_headline: string | null
          id: string
          is_published: boolean
          owner_id: string
          partner_one_name: string
          partner_two_name: string
          pix_key: string | null
          pix_key_type: string | null
          primary_color: string
          published_at: string | null
          slug: string
          story: string | null
          title: string | null
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          hero_headline?: string | null
          id?: string
          is_published?: boolean
          owner_id: string
          partner_one_name: string
          partner_two_name: string
          pix_key?: string | null
          pix_key_type?: string | null
          primary_color?: string
          published_at?: string | null
          slug: string
          story?: string | null
          title?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          event_date?: string | null
          event_location?: string | null
          hero_headline?: string | null
          id?: string
          is_published?: boolean
          owner_id?: string
          partner_one_name?: string
          partner_two_name?: string
          pix_key?: string | null
          pix_key_type?: string | null
          primary_color?: string
          published_at?: string | null
          slug?: string
          story?: string | null
          title?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weddings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      gift_stats: {
        Row: {
          contributions_count: number | null
          gift_id: string | null
          reserved_quantity: number | null
          total_contributed: number | null
          wedding_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "wedding_fund_stats"
            referencedColumns: ["wedding_id"]
          },
          {
            foreignKeyName: "gifts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_fund_stats: {
        Row: {
          contributions_count: number | null
          general_fund_raised: number | null
          total_raised: number | null
          wedding_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_wedding_dashboard_stats: {
        Args: { wid: string }
        Returns: {
          contributions_count: number
          gifts_received: number
          gifts_reserved: number
          gifts_total: number
          guestbook_pending: number
          guests_expected: number
          pending_amount: number
          rsvp_confirmed: number
          rsvp_declined: number
          total_raised: number
        }[]
      }
      is_wedding_owner: { Args: { wid: string }; Returns: boolean }
      is_wedding_published: { Args: { wid: string }; Returns: boolean }
      safe_uuid: { Args: { value: string }; Returns: string }
    }
    Enums: {
      gift_status: "available" | "reserved" | "received" | "archived"
      payment_method:
        | "pix"
        | "credit_card"
        | "bank_transfer"
        | "manual"
        | "other"
      payment_status: "pending" | "confirmed" | "cancelled" | "refunded"
      reservation_status: "pending" | "confirmed" | "cancelled"
      rsvp_status: "confirmed" | "declined" | "pending"
      wedding_member_role: "owner" | "editor"
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
      gift_status: ["available", "reserved", "received", "archived"],
      payment_method: [
        "pix",
        "credit_card",
        "bank_transfer",
        "manual",
        "other",
      ],
      payment_status: ["pending", "confirmed", "cancelled", "refunded"],
      reservation_status: ["pending", "confirmed", "cancelled"],
      rsvp_status: ["confirmed", "declined", "pending"],
      wedding_member_role: ["owner", "editor"],
    },
  },
} as const
