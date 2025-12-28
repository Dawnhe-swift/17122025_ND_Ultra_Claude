'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        console.error('[nd-ui] Login failed (Supabase auth error)', authError);
        setError(authError.message);
        return;
      }

      if (!data.session) {
        const noSessionErr = new Error('[nd-ui] Login succeeded but no session was returned.');
        console.error(noSessionErr);
        console.error(noSessionErr.stack);
        setError('Login succeeded but no session was returned. See console for details.');
        return;
      }

      router.push('/');
    } catch (err) {
      // This catches low-level network errors like: TypeError: Failed to fetch
      console.error('[nd-ui] Login failed (exception thrown)', err);
      if (err instanceof Error) {
        console.error(err.stack);
      }

      const details =
        err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ''}` : String(err);
      const looksLikeDnsFailure = /(ERR_NAME_NOT_RESOLVED|ENOTFOUND|getaddrinfo|EAI_AGAIN|dns|name not resolved)/i.test(
        details,
      );

      setError(
        looksLikeDnsFailure
          ? 'Login failed because the Supabase domain could not be resolved (DNS). If you are using local Supabase, restart the Supabase database/services and try again. See console for details.'
          : err instanceof Error
            ? `${err.name}: ${err.message} (see browser console for stack trace)`
            : 'Login failed (unknown error). See browser console for details.',
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-700">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white p-10 shadow-md">
          <p className="text-lg font-semibold text-slate-900">Welcome back, {user.email}</p>
          <p className="mt-2 text-sm text-slate-600">Go to your dashboard to manage obligations.</p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold text-slate-900">ND Portal Login</h1>
        <p className="mt-2 text-sm text-slate-600">Use your Supabase auth credentials to sign in.</p>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={busy}
          >
            {busy ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

