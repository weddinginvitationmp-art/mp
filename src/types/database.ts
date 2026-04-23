/**
 * Hand-written DB schema mirror.
 * Replace with `supabase gen types typescript --project-id ceppcwfbtykubukgwtxd`
 * once Supabase CLI is installed and migrations are applied.
 */
export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string;
          guest_slug: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          relationship: string | null;
          language: "vi" | "en";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["guests"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["guests"]["Insert"]>;
      };
      rsvp: {
        Row: {
          id: string;
          guest_id: string;
          status: "attending" | "not_attending" | "pending";
          party_size: number;
          dietary_restrictions: string | null;
          song_request: string | null;
          special_requests: string | null;
          submitted_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rsvp"]["Row"], "id" | "submitted_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["rsvp"]["Insert"]>;
      };
      wishes: {
        Row: {
          id: string;
          guest_id: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["wishes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["wishes"]["Insert"]>;
      };
      media: {
        Row: {
          id: string;
          type: "photo" | "video";
          url: string;
          caption: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["media"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
      };
      games_leaderboard: {
        Row: {
          id: string;
          guest_id: string;
          game_name: "love_memory" | "quiz" | "catch_bouquet";
          score: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["games_leaderboard"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["games_leaderboard"]["Insert"]>;
      };
    };
  };
}
