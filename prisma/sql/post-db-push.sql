-- KYC Defect Hub: database objects that the Prisma schema cannot describe.
--
-- When to run it
--   When building the database from scratch, and after a schema change that adds a table
--   or anything to this file:
--     1. npx prisma db push      (tables, columns, defaults, keys and indexes)
--     2. run this file by hand   (Supabase SQL Editor, or psql -f prisma/sql/post-db-push.sql)
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

  if not exists (
    select 1 from pg_constraint
    where conname = 'defect_categories_defect_id_section_name_key' and conrelid = 'public.defect_categories'::regclass
  ) then
    alter table public.defect_categories
      add constraint defect_categories_defect_id_section_name_key
      unique using index defect_categories_defect_id_section_name_key;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2. CHECK constraints
--    Allowed values of the text columns. Prisma has no syntax for CHECK.
-- ---------------------------------------------------------------------------

-- The SOE ID is what users type to sign in, and the lookup is an exact match on the lowercase
-- value without surrounding whitespace. Stored values are brought to that form before the format
-- is enforced. If two profiles end up with the same SOE ID, profiles_soe_id_key stops the script.
update public.profiles
   set soe_id = lower(btrim(soe_id, E' \t\r\n'))
 where soe_id <> lower(btrim(soe_id, E' \t\r\n'));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_soe_id_format_check' and conrelid = 'public.profiles'::regclass
  ) then
    -- Keep in sync with SOE_ID_PATTERN in features/auth/lib/soeId.ts.
    alter table public.profiles
      add constraint profiles_soe_id_format_check
      check (soe_id ~ '^[a-z]{2}[0-9]{5}$');
  end if;

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

  if not exists (
    select 1 from pg_constraint
    where conname = 'defect_categories_section_check' and conrelid = 'public.defect_categories'::regclass
  ) then
    alter table public.defect_categories
      add constraint defect_categories_section_check
      check (section = any (array['core'::text, 'appendix'::text]));
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
--
--    `sessions` must never be left open: through the Data API anyone could insert a session
--    for any profile and sign in as that user. Run this file right after `prisma db push`.
-- ---------------------------------------------------------------------------

alter table public.sessions          enable row level security;
alter table public.profiles          enable row level security;
alter table public.defects           enable row level security;
alter table public.resolutions       enable row level security;
alter table public.defect_reads      enable row level security;
alter table public.audit_log         enable row level security;
alter table public.qc_findings       enable row level security;
alter table public.evidence          enable row level security;
alter table public.defect_categories enable row level security;

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
