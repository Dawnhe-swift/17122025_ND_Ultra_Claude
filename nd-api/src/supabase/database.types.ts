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
      companies: {
        Row: {
          uen: string;
          company_name: string;
          nd_appointment_start: string;
          fye_date: string | null;
          csp_contact: string | null;
          status: 'active' | 'dormant' | 'resigned';
          risk_flag: 'normal' | 'heightened' | 'exit_recommended';
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          uen: string;
          company_name: string;
          nd_appointment_start: string;
          fye_date?: string | null;
          csp_contact?: string | null;
          status?: 'active' | 'dormant' | 'resigned';
          risk_flag?: 'normal' | 'heightened' | 'exit_recommended';
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          uen?: string;
          company_name?: string;
          nd_appointment_start?: string;
          fye_date?: string | null;
          csp_contact?: string | null;
          status?: 'active' | 'dormant' | 'resigned';
          risk_flag?: 'normal' | 'heightened' | 'exit_recommended';
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      legal_obligations: {
        Row: {
          id: string;
          company_uen: string | null;
          obligation_type: string;
          statutory_due_date: string;
          trigger_source: 'auto' | 'email' | 'letter';
          status: 'open' | 'in_progress' | 'completed' | 'overdue' | 'escalated' | 'resigned_unresolved';
          nd_risk_level: 'low' | 'medium' | 'high';
          nd_decision_summary: string | null;
          red_flag_checklist: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_uen?: string | null;
          obligation_type: string;
          statutory_due_date: string;
          trigger_source?: 'auto' | 'email' | 'letter';
          status?: 'open' | 'in_progress' | 'completed' | 'overdue' | 'escalated' | 'resigned_unresolved';
          nd_risk_level?: 'low' | 'medium' | 'high';
          nd_decision_summary?: string | null;
          red_flag_checklist?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_uen?: string | null;
          obligation_type?: string;
          statutory_due_date?: string;
          trigger_source?: 'auto' | 'email' | 'letter';
          status?: 'open' | 'in_progress' | 'completed' | 'overdue' | 'escalated' | 'resigned_unresolved';
          nd_risk_level?: 'low' | 'medium' | 'high';
          nd_decision_summary?: string | null;
          red_flag_checklist?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      actions_log: {
        Row: {
          id: string;
          obligation_id: string | null;
          timestamp: string;
          action_type: string;
          actor: 'nd' | 'csp' | 'auditor' | null;
          nd_notes: string | null;
          evidence_link: string | null;
          evidence_hash: string | null;
          metadata: Json | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          obligation_id?: string | null;
          timestamp?: string;
          action_type: string;
          actor?: 'nd' | 'csp' | 'auditor' | null;
          nd_notes?: string | null;
          evidence_link?: string | null;
          evidence_hash?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          obligation_id?: string | null;
          timestamp?: string;
          action_type?: string;
          actor?: 'nd' | 'csp' | 'auditor' | null;
          nd_notes?: string | null;
          evidence_link?: string | null;
          evidence_hash?: string | null;
          metadata?: Json | null;
          created_at?: string | null;
        };
      };
      documents: {
        Row: {
          id: string;
          obligation_id: string | null;
          filename: string | null;
          file_path: string | null;
          file_hash: string | null;
          uploaded_by: string | null;
          uploaded_at: string | null;
        };
        Insert: {
          id?: string;
          obligation_id?: string | null;
          filename?: string | null;
          file_path?: string | null;
          file_hash?: string | null;
          uploaded_by?: string | null;
          uploaded_at?: string | null;
        };
        Update: {
          id?: string;
          obligation_id?: string | null;
          filename?: string | null;
          file_path?: string | null;
          file_hash?: string | null;
          uploaded_by?: string | null;
          uploaded_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

