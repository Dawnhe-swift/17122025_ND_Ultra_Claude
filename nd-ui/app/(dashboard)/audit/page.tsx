'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';

export default function AuditPage() {
  const auditQuery = useQuery({ queryKey: ['audit-trail'], queryFn: () => apiClient.getAuditTrail(100) });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Audit Trail</h2>
        <p className="text-sm text-slate-600">Immutable actions across all obligations</p>
      </div>

      <div className="space-y-3">
        {auditQuery.isLoading && <p className="text-sm text-slate-600">Loading audit trail...</p>}
        {auditQuery.data?.map((item: any) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{item.action_type}</p>
            <p className="text-xs text-slate-600">
              Obligation: {item.obligation_id} · Company: {item.legal_obligations?.company_uen ?? 'n/a'}
            </p>
            <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
            {item.nd_notes && <p className="mt-2 text-sm text-slate-700">{item.nd_notes}</p>}
          </div>
        ))}
        {auditQuery.data?.length === 0 && <p className="text-sm text-slate-600">No audit entries.</p>}
      </div>
    </div>
  );
}


