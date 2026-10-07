alter table public.users
    add column if not exists email_verified boolean not null default true;

create table if not exists public.email_verification_codes (
    user_id text primary key references public.users(id) on delete cascade,
    email text not null,
    code_hash text not null,
    expires_at timestamptz not null,
    attempts integer not null default 0 check (attempts >= 0),
    last_sent_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create index if not exists email_verification_codes_expiry_idx
    on public.email_verification_codes (expires_at);

alter table public.email_verification_codes enable row level security;
