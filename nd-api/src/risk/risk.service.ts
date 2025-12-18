import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { RiskLevel } from '../obligations/enums/risk-level.enum';
import { Company } from '../companies/interfaces/company.interface';
import { LegalObligation } from '../obligations/interfaces/legal-obligation.interface';

@Injectable()
export class RiskService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  calculateObligationRisk(obligation: LegalObligation): RiskLevel {
    const dueDate = new Date(obligation.statutory_due_date).getTime();
    const now = Date.now();
    if (obligation.status === 'overdue' || dueDate < now) return RiskLevel.HIGH;
    if (obligation.nd_risk_level === RiskLevel.HIGH) return RiskLevel.HIGH;
    if (obligation.nd_risk_level === RiskLevel.MEDIUM) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  async calculateCompanyRisk(companyUen: string): Promise<'normal' | 'heightened' | 'exit_recommended'> {
    const obligations = await this.supabase
      .from('legal_obligations')
      .select('*')
      .eq('company_uen', companyUen);
    if (obligations.error) throw new HttpException(obligations.error.message, HttpStatus.BAD_REQUEST);

    let hasHigh = false;
    let hasMedium = false;
    (obligations.data as LegalObligation[]).forEach((obligation) => {
      const level = this.calculateObligationRisk(obligation);
      if (level === RiskLevel.HIGH) hasHigh = true;
      if (level === RiskLevel.MEDIUM) hasMedium = true;
    });

    const risk_flag = hasHigh ? 'exit_recommended' : hasMedium ? 'heightened' : 'normal';

    const { error } = await this.supabase
      .from('companies')
      .update({ risk_flag, updated_at: new Date().toISOString() })
      .eq('uen', companyUen);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

    return risk_flag as Company['risk_flag'];
  }

  async checkResignationTriggers(): Promise<Company[]> {
    const { data, error } = await this.supabase.from('companies').select('*').eq('risk_flag', 'exit_recommended');
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as Company[];
  }
}

