alter table public.users
    add column if not exists age integer,
    add column if not exists gender text;
