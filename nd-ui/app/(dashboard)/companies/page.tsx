'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiClient } from '../../../lib/api-client';

export default function CompaniesPage() {
  const [status, setStatus] = useState('');
  const [risk, setRisk] = useState('');
  const [search, setSearch] = useState('');

  const companiesQuery = useQuery({
    queryKey: ['companies', status, risk, search],
    queryFn: () => apiClient.listCompanies({ status, risk, search }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Companies</h2>
          <p className="text-sm text-slate-600">Filter companies by status and risk flag</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="dormant">Dormant</option>
          <option value="resigned">Resigned</option>
        </select>
        <select value={risk} onChange={(e) => setRisk(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
          <option value="">All Risk</option>
          <option value="normal">Normal</option>
          <option value="heightened">Heightened</option>
          <option value="exit_recommended">Exit Recommended</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <HeaderCell>Company</HeaderCell>
              <HeaderCell>UEN</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell>Risk</HeaderCell>
              <HeaderCell>FYE</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companiesQuery.isLoading && (
              <tr>
                <td colSpan={5} className="p-4 text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
            {companiesQuery.data?.map((item: any) => (
              <tr key={item.uen} className="hover:bg-slate-50">
                <Cell>
                  <Link href={`/companies/${item.uen}`} className="text-slate-900 underline">
                    {item.company_name}
                  </Link>
                </Cell>
                <Cell>{item.uen}</Cell>
                <Cell>{item.status}</Cell>
                <Cell>{item.risk_flag}</Cell>
                <Cell>{item.fye_date ? new Date(item.fye_date).toLocaleDateString() : '-'}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
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


