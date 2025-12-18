import { ObligationStatus } from '../enums/obligation-status.enum';
import { ObligationType } from '../enums/obligation-type.enum';
import { RiskLevel } from '../enums/risk-level.enum';

export interface LegalObligation {
  id: string;
  company_uen: string;
  obligation_type: ObligationType | string;
  statutory_due_date: string;
  trigger_source?: 'auto' | 'email' | 'letter';
  status: ObligationStatus;
  nd_risk_level: RiskLevel;
  nd_decision_summary?: string | null;
  red_flag_checklist?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}


