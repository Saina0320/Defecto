-- KYC Defect Hub: database objects that the Prisma schema cannot describe.
--
-- When to run it
--   Only when building the database from scratch:
--     1. npx prisma db push      (tables, columns, defaults, keys and indexes)
--     2. run this file by hand   (Supabase SQL Editor, or psql -f prisma/sql/post-db-push.sql)
--   The current database already has sections 1 and 2, and section 4 is the Supabase default.
--
-- What is NOT here, because it is in prisma/schema.prisma and `prisma db push` creates it:
--   primary keys, foreign keys (with their ON DELETE rules), unique indexes, indexes
--   and column defaults.
--
-- The file is safe to run more than once.
-- Keep it up to date: a new CHECK constraint, trigger, function or policy belongs here.

begin;

-- ---------------------------------------------------------------------------
-- 1. UNIQUE constraints
--    Prisma enforces @unique / @@unique with a unique index, not with a table constraint.
--    The original tables declare them as constraints, so the indexes that `prisma db push`
--    created are promoted here, keeping their names.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_soe_id_key' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_soe_id_key unique using index profiles_soe_id_key;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'resolutions_defect_id_key' and conrelid = 'public.resolutions'::regclass
  ) then
    alter table public.resolutions
      add constraint resolutions_defect_id_key unique using index resolutions_defect_id_key;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'defect_reads_defect_id_user_id_key' and conrelid = 'public.defect_reads'::regclass
  ) then
    alter table public.defect_reads
      add constraint defect_reads_defect_id_user_id_key unique using index defect_reads_defect_id_user_id_key;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2. CHECK constraints
--    Allowed values of the text columns. Prisma has no syntax for CHECK.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_role_check' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_role_check
      check (role = any (array['analyst'::text, 'manager'::text, 'admin'::text]));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'defects_case_type_check' and conrelid = 'public.defects'::regclass
  ) then
    alter table public.defects
      add constraint defects_case_type_check
      check (case_type = any (array['individual'::text, 'entity'::text]));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'defects_status_check' and conrelid = 'public.defects'::regclass
  ) then
    alter table public.defects
      add constraint defects_status_check
      check (status = any (array['draft'::text, 'submitted'::text, 'under_review'::text, 'resolved'::text]));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'evidence_category_check' and conrelid = 'public.evidence'::regclass
  ) then
    alter table public.evidence
      add constraint evidence_category_check
      check (category = any (array['qc'::text, 'supporting'::text, 'resolution'::text]));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3. Row level security
--    Supabase publishes every table of the public schema through its Data API, where anyone
--    holding the project's publishable key can query it. The application no longer uses that
--    API: it reads and writes through Prisma, whose database role bypasses row level security.
--    Enabling it without policies therefore closes the Data API and leaves Prisma unaffected.
--
--    Add policies below only if something must use the Data API again.
-- ---------------------------------------------------------------------------

alter table public.profiles     enable row level security;
alter table public.defects      enable row level security;
alter table public.resolutions  enable row level security;
alter table public.defect_reads enable row level security;
alter table public.audit_log    enable row level security;
alter table public.qc_findings  enable row level security;
alter table public.evidence     enable row level security;

-- ---------------------------------------------------------------------------
-- 4. Time zone
--    Prisma's PostgreSQL adapter reads and writes `timestamp with time zone` values as if the
--    session time zone were UTC. With any other zone every date is shifted by its offset.
--    UTC is the Supabase default, so this changes nothing unless the zone was modified or the
--    database is rebuilt somewhere else. It applies to connections opened after it runs.
-- ---------------------------------------------------------------------------

do $$
begin
  execute format('alter database %I set timezone to %L', current_database(), 'UTC');
end
$$;

commit;
