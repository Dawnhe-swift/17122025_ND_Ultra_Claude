'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/api-client';

export default function ObligationDetailPage() {
  const params = useParams();
  const obligationId = params?.id as string;

  const obligationQuery = useQuery({
    queryKey: ['obligation', obligationId],
    queryFn: () => apiClient.getObligation(obligationId),
    enabled: Boolean(obligationId),
  });

  const actionsQuery = useQuery({
    queryKey: ['obligation-actions', obligationId],
    queryFn: () => apiClient.getObligationActions(obligationId),
    enabled: Boolean(obligationId),
  });

  if (obligationQuery.isLoading) {
    return <div className="text-sm text-slate-600">Loading obligation...</div>;
  }

  const obligation = obligationQuery.data;

  if (!obligation) {
    return <div className="text-sm text-red-600">Obligation not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">{obligation.obligation_type}</h2>
        <p className="text-sm text-slate-600">Status: {obligation.status}</p>
        <p className="text-sm text-slate-600">
          Due: {new Date(obligation.statutory_due_date).toLocaleDateString()} · Risk: {obligation.nd_risk_level}
        </p>
        <p className="text-sm text-slate-600">Company: {obligation.company_uen}</p>
        {obligation.nd_decision_summary && (
          <p className="mt-3 text-sm text-slate-700">Decision: {obligation.nd_decision_summary}</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Action Log</h3>
        <div className="mt-4 space-y-3">
          {actionsQuery.isLoading && <p className="text-sm text-slate-600">Loading actions...</p>}
          {actionsQuery.data?.map((action: any) => (
            <div key={action.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{action.action_type}</p>
              <p className="text-xs text-slate-600">
                {new Date(action.timestamp).toLocaleString()} · Actor: {action.actor}
              </p>
              {action.nd_notes && <p className="text-sm text-slate-700 mt-1">{action.nd_notes}</p>}
            </div>
          ))}
          {actionsQuery.data?.length === 0 && <p className="text-sm text-slate-600">No actions recorded.</p>}
        </div>
      </div>
    </div>
  );
}


