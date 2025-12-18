export interface ActionLog {
  id: string;
  obligation_id: string;
  timestamp: string;
  action_type: string;
  actor: 'nd' | 'csp' | 'auditor' | string;
  nd_notes?: string | null;
  evidence_link?: string | null;
  evidence_hash?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
}

