export interface Company {
  uen: string;
  company_name: string;
  nd_appointment_start: string;
  fye_date?: string | null;
  csp_contact?: string | null;
  status: 'active' | 'dormant' | 'resigned';
  risk_flag: 'normal' | 'heightened' | 'exit_recommended';
  created_at?: string;
  updated_at?: string;
}

