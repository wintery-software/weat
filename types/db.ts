export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          address_1: string;
          address_2: string | null;
          city: string;
          id: string;
          state: string;
          zip_code: string;
        };
        Insert: {
          address_1: string;
          address_2?: string | null;
          city: string;
          id?: string;
          state: string;
          zip_code: string;
        };
        Update: {
          address_1?: string;
          address_2?: string | null;
          city?: string;
          id?: string;
          state?: string;
          zip_code?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar: string | null;
          created_at: string;
          id: string;
          name: string | null;
          roles: Database["public"]["Enums"]["user_role"][] | null;
          user_id: string;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          roles?: Database["public"]["Enums"]["user_role"][] | null;
          user_id?: string;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          roles?: Database["public"]["Enums"]["user_role"][] | null;
          user_id?: string;
        };
        Relationships: [];
      };
      restaurant_dishes: {
        Row: {
          id: string;
          mention_count: number;
          name: string;
          restaurant_id: string;
        };
        Insert: {
          id?: string;
          mention_count: number;
          name: string;
          restaurant_id: string;
        };
        Update: {
          id?: string;
          mention_count?: number;
          name?: string;
          restaurant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_dishes_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      restaurant_summaries: {
        Row: {
          average_rating: number;
          id: string;
          restaurant_id: string;
          review_count: number;
          summary: string;
          top_tags: Json;
          updated_at: string;
        };
        Insert: {
          average_rating: number;
          id?: string;
          restaurant_id: string;
          review_count?: number;
          summary: string;
          top_tags: Json;
          updated_at?: string;
        };
        Update: {
          average_rating?: number;
          id?: string;
          restaurant_id?: string;
          review_count?: number;
          summary?: string;
          top_tags?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_summaries_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: true;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      restaurant_tags: {
        Row: {
          id: string;
          mention_count: number;
          restaurant_id: string;
          tag_id: string;
        };
        Insert: {
          id?: string;
          mention_count?: number;
          restaurant_id: string;
          tag_id: string;
        };
        Update: {
          id?: string;
          mention_count?: number;
          restaurant_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_tags_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restaurants_tags_tag_id_tags_id_fk";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      restaurants: {
        Row: {
          address_id: string;
          created_at: string;
          external_links: Json | null;
          google_maps_place_id: string;
          id: string;
          latitude: number;
          location: unknown;
          longitude: number;
          name_en: string | null;
          name_zh: string | null;
          phone_number: string | null;
          updated_at: string;
        };
        Insert: {
          address_id: string;
          created_at?: string;
          external_links?: Json | null;
          google_maps_place_id: string;
          id?: string;
          latitude: number;
          location: unknown;
          longitude: number;
          name_en?: string | null;
          name_zh?: string | null;
          phone_number?: string | null;
          updated_at?: string;
        };
        Update: {
          address_id?: string;
          created_at?: string;
          external_links?: Json | null;
          google_maps_place_id?: string;
          id?: string;
          latitude?: number;
          location?: unknown;
          longitude?: number;
          name_en?: string | null;
          name_zh?: string | null;
          phone_number?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurants_address_id_addresses_id_fk";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
        ];
      };
      review_summaries: {
        Row: {
          authenticity_score: number;
          created_at: string;
          dishes: Json | null;
          id: string;
          rating: number;
          review_id: string;
          summary: string;
          tags: Json | null;
        };
        Insert: {
          authenticity_score: number;
          created_at?: string;
          dishes?: Json | null;
          id?: string;
          rating: number;
          review_id: string;
          summary: string;
          tags?: Json | null;
        };
        Update: {
          authenticity_score?: number;
          created_at?: string;
          dishes?: Json | null;
          id?: string;
          rating?: number;
          review_id?: string;
          summary?: string;
          tags?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_summaries_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: true;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          created_at: string;
          id: string;
          published_at: string | null;
          restaurant_id: string;
          source: string;
          source_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          published_at?: string | null;
          restaurant_id: string;
          source: string;
          source_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          published_at?: string | null;
          restaurant_id?: string;
          source?: string;
          source_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_restaurants_id_fk";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      task_queue: {
        Row: {
          attempts: number;
          created_at: string;
          data: Json;
          id: string;
          status: Database["public"]["Enums"]["task_status"];
          status_message: string | null;
          task: string;
          updated_at: string;
        };
        Insert: {
          attempts?: number;
          created_at?: string;
          data: Json;
          id?: string;
          status: Database["public"]["Enums"]["task_status"];
          status_message?: string | null;
          task: string;
          updated_at?: string;
        };
        Update: {
          attempts?: number;
          created_at?: string;
          data?: Json;
          id?: string;
          status?: Database["public"]["Enums"]["task_status"];
          status_message?: string | null;
          task?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_tagged_restaurants_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_task_queue_status: {
        Args: { start_date: string; end_date: string };
        Returns: Json;
      };
      restaurant_location_geojson: {
        Args: { r: Database["public"]["Tables"]["restaurants"]["Row"] };
        Returns: Json;
      };
    };
    Enums: {
      task_status: "PENDING" | "STARTED" | "FAILURE" | "SUCCESS";
      user_role: "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      task_status: ["PENDING", "STARTED", "FAILURE", "SUCCESS"],
      user_role: ["admin"],
    },
  },
} as const;
