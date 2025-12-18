import { supabase } from './supabase';

export const apiClient = {
  async getDashboardStats() {
    const companies = await supabase.from('companies').select('*', { count: 'exact', head: true });
    const obligations = await supabase.from('legal_obligations').select('*', { count: 'exact', head: true });
    const overdue = await supabase
      .from('legal_obligations')
      .select('*', { count: 'exact', head: true })
      .lt('statutory_due_date', new Date().toISOString())
      .in('status', ['open', 'in_progress']);
    if (companies.error) throw companies.error;
    if (obligations.error) throw obligations.error;
    if (overdue.error) throw overdue.error;
    return {
      companies: companies.count ?? 0,
      obligations: obligations.count ?? 0,
      overdue: overdue.count ?? 0,
    };
  },

  async getRecentActions(limit = 10) {
    const { data, error } = await supabase
      .from('actions_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async getUpcomingDeadlines(limit = 5) {
    const { data, error } = await supabase
      .from('legal_obligations')
      .select('*')
      .gte('statutory_due_date', new Date().toISOString())
      .order('statutory_due_date', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async listObligations(params: { status?: string; risk?: string; page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = supabase.from('legal_obligations').select('*', { count: 'exact' }).range(from, to);
    if (params.status) query = query.eq('status', params.status);
    if (params.risk) query = query.eq('nd_risk_level', params.risk);
    const { data, error, count } = await query.order('statutory_due_date', { ascending: true });
    if (error) throw error;
    return { data, count };
  },

  async getObligation(id: string) {
    const { data, error } = await supabase
      .from('legal_obligations')
      .select('*, companies(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getObligationActions(id: string) {
    const { data, error } = await supabase
      .from('actions_log')
      .select('*')
      .eq('obligation_id', id)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  },

  async listCompanies(params: { status?: string; risk?: string; search?: string }) {
    let query = supabase.from('companies').select('*');
    if (params.status) query = query.eq('status', params.status);
    if (params.risk) query = query.eq('risk_flag', params.risk);
    if (params.search) query = query.ilike('company_name', `%${params.search}%`);
    const { data, error } = await query.order('company_name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getCompany(uen: string) {
    const company = await supabase.from('companies').select('*').eq('uen', uen).single();
    if (company.error) throw company.error;
    const obligations = await supabase.from('legal_obligations').select('*').eq('company_uen', uen);
    if (obligations.error) throw obligations.error;
    return { company: company.data, obligations: obligations.data };
  },

  async getAuditTrail(limit = 50) {
    const { data, error } = await supabase
      .from('actions_log')
      .select('*, legal_obligations(id, obligation_type, company_uen)')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },
};

