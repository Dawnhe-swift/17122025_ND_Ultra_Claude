import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { Database } from './database.types';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<Database>;

  constructor() {
    const url = process.env.SUPABASE_DB_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      throw new Error(
        'SUPABASE_DB_URL and SUPABASE_SERVICE_ROLE_KEY must be set',
      );
    }

    this.supabase = createClient<Database>(url, serviceRoleKey);
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }
}

