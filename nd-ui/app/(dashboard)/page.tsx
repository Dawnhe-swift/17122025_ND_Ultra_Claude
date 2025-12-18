'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';

export default function DashboardPage() {
  const statsQuery = useQuery({ queryKey: ['dashboard-stats'], queryFn: apiClient.getDashboardStats });
  const recentActions = useQuery({ queryKey: ['recent-actions'], queryFn: () => apiClient.getRecentActions(8) });
  const upcoming = useQuery({ queryKey: ['upcoming'], queryFn: () => apiClient.getUpcomingDeadlines(5) });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-600">Key metrics for obligations and companies</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Companies" value={statsQuery.data?.companies ?? '-'} loading={statsQuery.isLoading} />
        <StatCard label="Obligations" value={statsQuery.data?.obligations ?? '-'} loading={statsQuery.isLoading} />
        <StatCard label="Overdue" value={statsQuery.data?.overdue ?? '-'} loading={statsQuery.isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Recent Activity">
          <ul className="space-y-3">
            {recentActions.isLoading && <p className="text-sm text-slate-500">Loading...</p>}
            {recentActions.data?.map((item: any) => (
              <li key={item.id} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item.action_type}</p>
                <p className="text-xs text-slate-600">
                  {item.nd_notes || 'No notes'} · {new Date(item.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
            {recentActions.data?.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
          </ul>
        </Panel>

        <Panel title="Upcoming Deadlines">
          <ul className="space-y-3">
            {upcoming.isLoading && <p className="text-sm text-slate-500">Loading...</p>}
            {upcoming.data?.map((item: any) => (
              <li key={item.id} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item.obligation_type}</p>
                <p className="text-xs text-slate-600">
                  Due {new Date(item.statutory_due_date).toLocaleDateString()} · Status {item.status}
                </p>
              </li>
            ))}
            {upcoming.data?.length === 0 && <p className="text-sm text-slate-500">No upcoming deadlines.</p>}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({ label, value, loading }: { label: string; value: number | string; loading?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{loading ? '...' : value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

