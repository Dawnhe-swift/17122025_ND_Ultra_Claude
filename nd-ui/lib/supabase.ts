import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[nd-ui] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check `nd-ui/.env`.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    // Add a thin wrapper so "Failed to fetch" surfaces a useful stack trace in the console.
    fetch: async (input, init) => {
      try {
        return await fetch(input as RequestInfo | URL, init);
      } catch (err) {
        const details =
          err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ''}` : String(err);
        const looksLikeDnsFailure = /(ERR_NAME_NOT_RESOLVED|ENOTFOUND|getaddrinfo|EAI_AGAIN|dns|name not resolved)/i.test(
          details,
        );

        const url =
          typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : input instanceof Request
                ? input.url
                : '[unknown]';

        console.error('[nd-ui] Supabase fetch failed', {
          url,
          method: init?.method ?? (input instanceof Request ? input.method : 'GET'),
          error: err,
        });
        if (err instanceof Error) {
          console.error(err.stack);
        }

        if (looksLikeDnsFailure) {
          console.error(
            '[nd-ui] This looks like a DNS / domain resolution failure. If you are using local Supabase, restart the Supabase database/services and try again.',
          );
        }
        throw err;
      }
    },
  },
});


