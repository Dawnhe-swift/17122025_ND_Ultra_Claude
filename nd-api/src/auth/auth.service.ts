import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    return data;
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return data;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    return { success: true };
  }

  async me() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    return data;
  }
}

