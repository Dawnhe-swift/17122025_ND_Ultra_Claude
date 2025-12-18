import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { Company } from './interfaces/company.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async findAll(filters?: { status?: string; risk_flag?: string; search?: string }): Promise<Company[]> {
    let query = this.supabase.from('companies').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.risk_flag) {
      query = query.eq('risk_flag', filters.risk_flag);
    }
    if (filters?.search) {
      query = query.ilike('company_name', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as Company[];
  }

  async findOne(uen: string): Promise<Company | null> {
    const { data, error } = await this.supabase.from('companies').select('*').eq('uen', uen).single();
    if (error) throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    return data as Company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { data, error } = await this.supabase.from('companies').insert(createCompanyDto).select().single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as Company;
  }

  async update(uen: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const payload = { ...updateCompanyDto, updated_at: new Date().toISOString() };
    const { data, error } = await this.supabase
      .from('companies')
      .update(payload)
      .eq('uen', uen)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as Company;
  }

  async softDelete(uen: string): Promise<Company> {
    const { data, error } = await this.supabase
      .from('companies')
      .update({ status: 'resigned', updated_at: new Date().toISOString() })
      .eq('uen', uen)
      .select()
      .single();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data as Company;
  }
}

