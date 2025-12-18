'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';

const pageSize = 10;

export default function ObligationsPage() {
  const [status, setStatus] = useState('');
  const [risk, setRisk] = useState('');
  const [page, setPage] = useState(1);

  const obligationsQuery = useQuery({
    queryKey: ['obligations', status, risk, page],
    queryFn: () => apiClient.listObligations({ status, risk, page, pageSize }),
  });

  const totalPages = useMemo(() => {
    const count = obligationsQuery.data?.count ?? 0;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [obligationsQuery.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Obligations</h2>
          <p className="text-sm text-slate-600">Filter by status and risk level</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="escalated">Escalated</option>
          <option value="resigned_unresolved">Resigned Unresolved</option>
        </select>
        <select
          value={risk}
          onChange={(e) => {
            setRisk(e.target.value);
            setPage(1);
          }}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="">All Risk</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Risk</HeaderCell>
              <HeaderCell>Due</HeaderCell>
              <HeaderCell>Company</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {obligationsQuery.isLoading && (
              <tr>
                <td colSpan={5} className="p-4 text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
            {obligationsQuery.data?.data?.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <Cell>
                  <Link href={`/obligations/${item.id}`} className="text-slate-900 underline">
                    {item.obligation_type}
                  </Link>
                </Cell>
                <Cell>{item.status}</Cell>
                <Cell>{item.nd_risk_level}</Cell>
                <Cell>{new Date(item.statutory_due_date).toLocaleDateString()}</Cell>
                <Cell>{item.company_uen}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-700">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="rounded-md border border-slate-200 px-3 py-1 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">{children}</th>;
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-sm text-slate-800">{children}</td>;
}

