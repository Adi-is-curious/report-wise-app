-- Fix RLS issue by disabling RLS on unused "CivicConnect" table (quoted to preserve case)
ALTER TABLE public."CivicConnect" DISABLE ROW LEVEL SECURITY;