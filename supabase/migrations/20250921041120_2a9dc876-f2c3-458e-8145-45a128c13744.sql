-- Fix RLS issue by disabling RLS on unused CivicConnect table
ALTER TABLE public.CivicConnect DISABLE ROW LEVEL SECURITY;