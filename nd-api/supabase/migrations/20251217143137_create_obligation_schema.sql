-- Schema for Singapore Nominee Director obligation tracking

begin;

create table if not exists public.companies (
  uen varchar(10) primary key,
  company_name varchar(255) not null,
  nd_appointment_start date not null,
  fye_date date,
  csp_contact varchar(255),
  status varchar(20) default 'active' not null,
  risk_flag varchar(20) default 'normal' not null,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint companies_status_check check (status in ('active', 'dormant', 'resigned')),
  constraint companies_risk_flag_check check (risk_flag in ('normal', 'heightened', 'exit_recommended'))
);

create table if not exists public.legal_obligations (
  id uuid primary key default gen_random_uuid(),
  company_uen varchar(10) references public.companies(uen) on delete cascade,
  obligation_type varchar(50) not null,
  statutory_due_date date not null,
  trigger_source varchar(20) default 'auto' not null,
  status varchar(30) default 'open' not null,
  nd_risk_level varchar(20) default 'low' not null,
  nd_decision_summary text,
  red_flag_checklist jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  constraint legal_obligations_trigger_source_check check (trigger_source in ('auto', 'email', 'letter')),
  constraint legal_obligations_status_check check (status in ('open', 'in_progress', 'completed', 'overdue', 'escalated', 'resigned_unresolved')),
  constraint legal_obligations_nd_risk_level_check check (nd_risk_level in ('low', 'medium', 'high')),
  constraint nd_decision_required check (status <> 'completed' or nd_decision_summary is not null)
);

create table if not exists public.actions_log (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid references public.legal_obligations(id) on delete cascade,
  timestamp timestamp not null default now(),
  action_type varchar(50) not null,
  actor varchar(20) check (actor in ('nd', 'csp', 'auditor')),
  nd_notes text,
  evidence_link text,
  evidence_hash varchar(64),
  metadata jsonb,
  created_at timestamp default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  obligation_id uuid references public.legal_obligations(id),
  filename varchar(255),
  file_path text,
  file_hash varchar(64),
  uploaded_by varchar(50),
  uploaded_at timestamp default now()
);

create index if not exists idx_obligations_company on public.legal_obligations(company_uen);
create index if not exists idx_obligations_status on public.legal_obligations(status);
create index if not exists idx_obligations_due_date on public.legal_obligations(statutory_due_date);
create index if not exists idx_actions_obligation on public.actions_log(obligation_id);
create index if not exists idx_actions_timestamp on public.actions_log(timestamp desc);

create or replace function public.prevent_action_log_update()
returns trigger as $$
begin
  raise exception 'Action log is immutable. Cannot update records.';
end;
$$ language plpgsql;

drop trigger if exists prevent_action_log_modifications on public.actions_log;
create trigger prevent_action_log_modifications
before update on public.actions_log
for each row execute function public.prevent_action_log_update();

alter table public.companies enable row level security;
alter table public.legal_obligations enable row level security;
alter table public.actions_log enable row level security;
alter table public.documents enable row level security;

create policy "Users can view all companies" on public.companies
  for select to authenticated using (true);
create policy "Users can insert companies" on public.companies
  for insert to authenticated with check (true);
create policy "Users can update companies" on public.companies
  for update to authenticated using (true);

create policy "Users can view all obligations" on public.legal_obligations
  for select to authenticated using (true);
create policy "Users can insert obligations" on public.legal_obligations
  for insert to authenticated with check (true);
create policy "Users can update obligations" on public.legal_obligations
  for update to authenticated using (true);

create policy "Users can view action logs" on public.actions_log
  for select to authenticated using (true);
create policy "Users can insert action logs" on public.actions_log
  for insert to authenticated with check (true);

create policy "Users can view documents" on public.documents
  for select to authenticated using (true);
create policy "Users can insert documents" on public.documents
  for insert to authenticated with check (true);

commit;


