create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 2 and 60),
  password_hash text not null,
  is_admin boolean not null default false,
  referral_code text,
  created_at timestamptz not null default now()
);

-- The browser must never access this table directly. Only Vercel API routes
-- using the server-side service-role key can query it.
alter table public.app_users enable row level security;
revoke all on public.app_users from anon, authenticated;

-- IMPORTANT: no user is promoted to admin automatically at signup.
-- After registering your own account, run the statement below in Supabase SQL Editor,
-- replacing the username with your account username:
-- update public.app_users set is_admin = true where username = 'your_username';
