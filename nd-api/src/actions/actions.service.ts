import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { ActionLog } from './interfaces/action-log.interface';

@Injectable()
export class ActionsService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async logAction(
    obligationId: string,
    actionType: string,
    actor: 'nd' | 'csp' | 'auditor',
    ndNotes?: string,
    evidenceLink?: string,
    evidenceHash?: string,
    metadata?: Record<string, unknown>,
  ): Promise<ActionLog> {
    const { data, error } = await this.supabase
      .from('actions_log')
      .insert({
        obligation_id: obligationId,
        action_type: actionType,
        actor,
        nd_notes: ndNotes,
        evidence_link: evidenceLink,
        evidence_hash: evidenceHash,
        metadata,
      })
      .select()
      .single();

    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as ActionLog;
  }

  async getByObligation(obligationId: string): Promise<ActionLog[]> {
    const { data, error } = await this.supabase
      .from('actions_log')
      .select('*')
      .eq('obligation_id', obligationId)
      .order('timestamp', { ascending: false });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as ActionLog[];
  }

  async getByCompany(companyUen: string): Promise<ActionLog[]> {
    const obligations = await this.supabase
      .from('legal_obligations')
      .select('id')
      .eq('company_uen', companyUen);

    if (obligations.error) throw new HttpException(obligations.error.message, HttpStatus.BAD_REQUEST);
    const obligationIds = (obligations.data ?? []).map((row) => row.id);
    if (obligationIds.length === 0) return [];

    const { data, error } = await this.supabase
      .from('actions_log')
      .select('*')
      .in('obligation_id', obligationIds)
      .order('timestamp', { ascending: false });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as ActionLog[];
  }
}

