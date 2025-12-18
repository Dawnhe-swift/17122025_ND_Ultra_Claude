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
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    setBusy(false);
    if (!authError) router.push('/');
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

