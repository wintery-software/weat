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
      places: {
        Row: {
          address_1: string;
          address_2: string | null;
          city: string;
          google_maps_place_id: string;
          id: string;
          location: unknown | null;
          state: string;
          zip_code: string;
        };
        Insert: {
          address_1: string;
          address_2?: string | null;
          city: string;
          google_maps_place_id: string;
          id?: string;
          location?: unknown | null;
          state: string;
          zip_code: string;
        };
        Update: {
          address_1?: string;
          address_2?: string | null;
          city?: string;
          google_maps_place_id?: string;
          id?: string;
          location?: unknown | null;
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
          settings: Json;
          user_id: string;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          roles?: Database["public"]["Enums"]["user_role"][] | null;
          settings?: Json;
          user_id?: string;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          roles?: Database["public"]["Enums"]["user_role"][] | null;
          settings?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
      restaurant_dish_names: {
        Row: {
          id: string;
          name: string;
          restaurant_id: string;
          standard_name: string;
        };
        Insert: {
          id?: string;
          name: string;
          restaurant_id?: string;
          standard_name: string;
        };
        Update: {
          id?: string;
          name?: string;
          restaurant_id?: string;
          standard_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurant_dish_names_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          },
        ];
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
          created_at: string;
          display_image: string | null;
          external_links: Json | null;
          id: string;
          images: string[];
          is_blocked: boolean;
          name_en: string | null;
          name_zh: string | null;
          phone_number: string | null;
          place_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_image?: string | null;
          external_links?: Json | null;
          id?: string;
          images?: string[];
          is_blocked?: boolean;
          name_en?: string | null;
          name_zh?: string | null;
          phone_number?: string | null;
          place_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_image?: string | null;
          external_links?: Json | null;
          id?: string;
          images?: string[];
          is_blocked?: boolean;
          name_en?: string | null;
          name_zh?: string | null;
          phone_number?: string | null;
          place_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "restaurants_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
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
          is_blocked: boolean;
          published_at: string | null;
          restaurant_id: string;
          source: Database["public"]["Enums"]["review_source"];
          source_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_blocked?: boolean;
          published_at?: string | null;
          restaurant_id: string;
          source?: Database["public"]["Enums"]["review_source"];
          source_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_blocked?: boolean;
          published_at?: string | null;
          restaurant_id?: string;
          source?: Database["public"]["Enums"]["review_source"];
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
      tag_clusters: {
        Row: {
          display_name: string;
          id: string;
        };
        Insert: {
          display_name: string;
          id?: string;
        };
        Update: {
          display_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          cluster_id: string;
          id: string;
          is_blocked: boolean;
          name: string;
        };
        Insert: {
          cluster_id: string;
          id?: string;
          is_blocked?: boolean;
          name: string;
        };
        Update: {
          cluster_id?: string;
          id?: string;
          is_blocked?: boolean;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_cluster_id_fkey";
            columns: ["cluster_id"];
            isOneToOne: false;
            referencedRelation: "tag_clusters";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          attempts: number;
          created_at: string;
          data: Json;
          id: string;
          status: Database["public"]["Enums"]["task_status"];
          status_message: string | null;
          type: Database["public"]["Enums"]["task_type"];
          updated_at: string;
        };
        Insert: {
          attempts?: number;
          created_at?: string;
          data: Json;
          id?: string;
          status: Database["public"]["Enums"]["task_status"];
          status_message?: string | null;
          type: Database["public"]["Enums"]["task_type"];
          updated_at?: string;
        };
        Update: {
          attempts?: number;
          created_at?: string;
          data?: Json;
          id?: string;
          status?: Database["public"]["Enums"]["task_status"];
          status_message?: string | null;
          type?: Database["public"]["Enums"]["task_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      verifications: {
        Row: {
          comment: string | null;
          created_at: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["verification_entity_type"];
          id: string;
          metadata: Json | null;
          reason: string;
          status: Database["public"]["Enums"]["verification_status"];
          updated_at: string;
          verification_type: string;
        };
        Insert: {
          comment?: string | null;
          created_at?: string;
          entity_id: string;
          entity_type: Database["public"]["Enums"]["verification_entity_type"];
          id?: string;
          metadata?: Json | null;
          reason: string;
          status?: Database["public"]["Enums"]["verification_status"];
          updated_at?: string;
          verification_type: string;
        };
        Update: {
          comment?: string | null;
          created_at?: string;
          entity_id?: string;
          entity_type?: Database["public"]["Enums"]["verification_entity_type"];
          id?: string;
          metadata?: Json | null;
          reason?: string;
          status?: Database["public"]["Enums"]["verification_status"];
          updated_at?: string;
          verification_type?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_restaurant_by_id_user_view: {
        Args: { id: string };
        Returns: Json;
      };
      get_restaurants_user_view: {
        Args: { lat: number; lng: number };
        Returns: {
          id: string;
          name_zh: string;
          name_en: string;
          phone_number: string;
          updated_at: string;
          is_blocked: boolean;
          images: Json;
          place: Json;
          summary: Json;
          distance: number;
        }[];
      };
      get_tagged_restaurants_count: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      get_tasks_status: {
        Args: { start_date: string; end_date: string };
        Returns: Json;
      };
      restaurant_location_geojson: {
        Args: { r: Database["public"]["Tables"]["restaurants"]["Row"] };
        Returns: Json;
      };
    };
    Enums: {
      review_source: "xiaohongshu";
      task_status: "PENDING" | "STARTED" | "FAILURE" | "SUCCESS";
      task_type:
        | "process_xhs_post"
        | "aggregate_restaurant_reviews"
        | "crawl_xhs_posts";
      user_role: "admin";
      verification_entity_type: "RESTAURANT" | "REVIEW";
      verification_status: "PENDING" | "RESOLVED";
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
      review_source: ["xiaohongshu"],
      task_status: ["PENDING", "STARTED", "FAILURE", "SUCCESS"],
      task_type: [
        "process_xhs_post",
        "aggregate_restaurant_reviews",
        "crawl_xhs_posts",
      ],
      user_role: ["admin"],
      verification_entity_type: ["RESTAURANT", "REVIEW"],
      verification_status: ["PENDING", "RESOLVED"],
    },
  },
} as const;
