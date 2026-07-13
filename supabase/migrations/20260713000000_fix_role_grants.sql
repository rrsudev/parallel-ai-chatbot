-- Fix missing table/routine/sequence grants for the Supabase API roles.
--
-- The public tables in this project were created without the standard Supabase
-- privilege grants for the anon / authenticated / service_role roles, so every
-- PostgREST request failed with "permission denied for table ..." (HTTP 403)
-- even though the row level security policies were correct. RLS still restricts
-- access to each user's own rows, so granting these privileges is safe.

-- Ensure the roles can access the schema.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant privileges on all existing objects.
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Grant privileges on any objects created in the future by the postgres role.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
