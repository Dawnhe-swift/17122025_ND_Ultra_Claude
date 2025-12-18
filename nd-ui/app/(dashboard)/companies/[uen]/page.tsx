'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/api-client';

export default function CompanyDetailPage() {
  const params = useParams();
  const uen = params?.uen as string;

  const companyQuery = useQuery({
    queryKey: ['company', uen],
    queryFn: () => apiClient.getCompany(uen),
    enabled: Boolean(uen),
  });

  if (companyQuery.isLoading) return <p className="text-sm text-slate-600">Loading company...</p>;
  if (!companyQuery.data) return <p className="text-sm text-red-600">Company not found.</p>;

  const { company, obligations } = companyQuery.data as any;

  const handleDownload = () => {
    // Placeholder to integrate backend export endpoint
    alert('Defense pack export will be implemented via backend endpoint.');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{company.company_name}</h2>
        <p className="text-sm text-slate-600">UEN: {company.uen}</p>
        <p className="text-sm text-slate-600">Risk: {company.risk_flag}</p>
        <p className="text-sm text-slate-600">Status: {company.status}</p>
        <button
          onClick={handleDownload}
          className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
        >
          Export Defense Pack
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Obligations</h3>
        <div className="mt-4 space-y-3">
          {obligations?.map((o: any) => (
            <div key={o.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{o.obligation_type}</p>
              <p className="text-xs text-slate-600">
                Status: {o.status} · Due {new Date(o.statutory_due_date).toLocaleDateString()}
              </p>
            </div>
          ))}
          {(!obligations || obligations.length === 0) && <p className="text-sm text-slate-600">No obligations.</p>}
        </div>
      </div>
    </div>
  );
}


