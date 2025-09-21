-- Fix RLS issue by disabling RLS on unused civicconnect table (lowercase)  
ALTER TABLE public.civicconnect DISABLE ROW LEVEL SECURITY;