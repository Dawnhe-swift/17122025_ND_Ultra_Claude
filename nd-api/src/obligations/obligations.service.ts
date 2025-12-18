import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { ActionsService } from '../actions/actions.service';
import { CreateObligationDto } from './dto/create-obligation.dto';
import { ReviewObligationDto } from './dto/review-obligation.dto';
import { CloseObligationDto } from './dto/close-obligation.dto';
import { LegalObligation } from './interfaces/legal-obligation.interface';
import { ObligationStatus } from './enums/obligation-status.enum';
import { RiskLevel } from './enums/risk-level.enum';

@Injectable()
export class ObligationsService {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly actionsService: ActionsService,
  ) {
    this.supabase = this.supabaseService.getClient();
  }

  async findAll(filters?: { status?: string; company_uen?: string; risk?: string }): Promise<LegalObligation[]> {
    let query = this.supabase.from('legal_obligations').select('*');

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.company_uen) query = query.eq('company_uen', filters.company_uen);
    if (filters?.risk) query = query.eq('nd_risk_level', filters.risk);

    const { data, error } = await query;
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as LegalObligation[];
  }

  async findOne(id: string): Promise<LegalObligation> {
    const { data, error } = await this.supabase.from('legal_obligations').select('*').eq('id', id).single();
    if (error) throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    return data as LegalObligation;
  }

  async findOverdue(): Promise<LegalObligation[]> {
    const today = new Date().toISOString();
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .select('*')
      .lt('statutory_due_date', today)
      .in('status', [ObligationStatus.OPEN, ObligationStatus.IN_PROGRESS]);
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as LegalObligation[];
  }

  async findHighRisk(): Promise<LegalObligation[]> {
    const { data, error } = await this.supabase.from('legal_obligations').select('*').eq('nd_risk_level', 'high');
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as LegalObligation[];
  }

  async createObligation(createObligationDto: CreateObligationDto): Promise<LegalObligation> {
    const payload = {
      ...createObligationDto,
      status: createObligationDto.status ?? ObligationStatus.OPEN,
      nd_risk_level: createObligationDto.nd_risk_level ?? RiskLevel.LOW,
    };
    const { data, error } = await this.supabase.from('legal_obligations').insert(payload).select().single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(data.id, 'created', 'nd', undefined, undefined, undefined, {
      status: data.status,
    });
    return data as LegalObligation;
  }

  async reviewObligation(id: string, reviewDto: ReviewObligationDto): Promise<LegalObligation> {
    if (!reviewDto.ndNotes) {
      throw new HttpException('ndNotes is required', HttpStatus.BAD_REQUEST);
    }
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .update({
        status: ObligationStatus.IN_PROGRESS,
        red_flag_checklist: reviewDto.redFlagChecklist,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(id, 'reviewed', 'nd', reviewDto.ndNotes, undefined, undefined, {
      status: ObligationStatus.IN_PROGRESS,
    });
    return data as LegalObligation;
  }

  async approveObligation(id: string, ndNotes: string): Promise<LegalObligation> {
    if (!ndNotes) throw new HttpException('ndNotes is required', HttpStatus.BAD_REQUEST);
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .update({ status: ObligationStatus.COMPLETED, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(id, 'approved', 'nd', ndNotes, undefined, undefined, {
      status: ObligationStatus.COMPLETED,
    });
    return data as LegalObligation;
  }

  async rejectObligation(id: string, ndNotes: string): Promise<LegalObligation> {
    if (!ndNotes) throw new HttpException('ndNotes is required', HttpStatus.BAD_REQUEST);
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .update({ status: ObligationStatus.RESIGNED_UNRESOLVED, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(id, 'rejected', 'nd', ndNotes, undefined, undefined, {
      status: ObligationStatus.RESIGNED_UNRESOLVED,
    });
    return data as LegalObligation;
  }

  async escalateObligation(id: string, ndNotes: string): Promise<LegalObligation> {
    if (!ndNotes) throw new HttpException('ndNotes is required', HttpStatus.BAD_REQUEST);
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .update({ status: ObligationStatus.ESCALATED, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(id, 'escalated', 'nd', ndNotes, undefined, undefined, {
      status: ObligationStatus.ESCALATED,
    });
    return data as LegalObligation;
  }

  async closeObligation(id: string, closeDto: CloseObligationDto): Promise<LegalObligation> {
    if (!closeDto.ndDecisionSummary) throw new HttpException('ndDecisionSummary is required', HttpStatus.BAD_REQUEST);
    if (!closeDto.ndNotes) throw new HttpException('ndNotes is required', HttpStatus.BAD_REQUEST);
    const { data, error } = await this.supabase
      .from('legal_obligations')
      .update({
        status: ObligationStatus.COMPLETED,
        nd_decision_summary: closeDto.ndDecisionSummary,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    await this.actionsService.logAction(id, 'closed', 'nd', closeDto.ndNotes, undefined, undefined, {
      status: ObligationStatus.COMPLETED,
    });
    return data as LegalObligation;
  }
}

