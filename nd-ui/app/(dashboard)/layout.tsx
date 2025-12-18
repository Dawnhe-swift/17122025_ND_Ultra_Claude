'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useAuth } from '../../components/providers/auth-provider';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/obligations', label: 'Obligations' },
  { href: '/companies', label: 'Companies' },
  { href: '/audit', label: 'Audit Trail' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-700">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="rounded-xl bg-white p-8 shadow-md">
          <p className="text-lg font-semibold text-slate-900">Please sign in</p>
          <p className="text-sm text-slate-600">You need to authenticate to access the dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="flex flex-col gap-6 border-r border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">ND Portal</p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">User</p>
            <p className="text-xs text-slate-500">{user?.email ?? 'Guest'}</p>
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

