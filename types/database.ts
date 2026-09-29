/**
 * Hand-written Supabase schema covering the tables and columns this app uses.
 * Replace with `supabase gen types typescript` output once the CLI is set up.
 */

export type ProfileRow = {
  id: string;
  soe_id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  active: boolean;
  created_at: string;
};

export type DefectRow = {
  id: string;
  ccid: string;
  kycid: string;
  case_type: string;
  analyst_id: string;
  analyst_context: string | null;
  status: string;
  created_at: string | null;
  submitted_at: string | null;
  updated_at: string | null;
};

export type DefectInsert = {
  id?: string;
  ccid: string;
  kycid: string;
  case_type: string;
  analyst_id: string;
  analyst_context?: string | null;
  status?: string;
  created_at?: string | null;
  submitted_at?: string | null;
  updated_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      defects: {
        Row: DefectRow;
        Insert: DefectInsert;
        Update: Partial<DefectInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
