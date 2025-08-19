export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      records: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          duration_minutes: number;
          timer_mark: string;
          content: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          duration_minutes: number;
          timer_mark: string;
          content: string;
          completed_at: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          duration_minutes?: number;
          timer_mark?: string;
          content?: string;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
