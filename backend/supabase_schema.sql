-- ============================================================
-- Don Bosko — Supabase Schema
-- Run this once in Supabase Dashboard > SQL Editor
-- ============================================================

-- Users (secretaries + admin)
create table if not exists users (
  id           uuid primary key default gen_random_uuid(),
  username     text unique not null,
  password_hash text not null,
  role         text not null check (role in ('sec_9vjecare', 'sec_gjimnaz', 'admin')),
  email        text default 'qfp_donbosko@yahoo.it',
  phone        text default '+355 69 405 4009',
  last_login   timestamptz,
  created_at   timestamptz default now()
);

-- Classes
create table if not exists classes (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  grade_level int not null check (grade_level between 1 and 12),
  section     text not null check (section in ('9vjecare', 'gjimnaz'))
);

-- Students
create table if not exists students (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  class_id     uuid references classes(id) on delete cascade,
  parent_phone text not null,
  parent_name  text default ''
);

-- Message logs
create table if not exists message_logs (
  id               uuid primary key default gen_random_uuid(),
  student_id       uuid references students(id),
  secretary_id     uuid references users(id),
  action_type      text not null check (action_type in ('vone_ora1','vone_ora2','takim_mesues','takim_drejtori','semurje','korrigjim')),
  message_text     text not null,
  parent_phone     text not null,
  status           text default 'pending' check (status in ('sent','failed','pending')),
  is_correction_of uuid references message_logs(id) default null,
  timestamp        timestamptz default now()
);

-- Custom message templates per secretary
create table if not exists templates (
  id            uuid primary key default gen_random_uuid(),
  secretary_id  uuid references users(id) on delete cascade,
  action_type   text not null check (action_type in ('vone_ora1','vone_ora2','takim_mesues','takim_drejtori','semurje')),
  template_text text not null,
  updated_at    timestamptz default now(),
  unique (secretary_id, action_type)
);

-- Activity log (super admin feed)
create table if not exists activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references users(id),
  actor_role  text not null,
  action_type text not null check (action_type in ('login','logout','message_sent','correction_sent','password_change','template_edit')),
  metadata    jsonb default '{}',
  timestamp   timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_message_logs_secretary on message_logs(secretary_id);
create index if not exists idx_message_logs_timestamp on message_logs(timestamp desc);
create index if not exists idx_activity_logs_actor    on activity_logs(actor_id);
create index if not exists idx_activity_logs_timestamp on activity_logs(timestamp desc);
create index if not exists idx_students_class         on students(class_id);
