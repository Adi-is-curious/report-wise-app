-- Fix security issue: Restrict profile visibility to protect personal information
-- Drop the overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create restrictive policy: Users can only view their own full profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a security definer function to get safe public profile data
-- This allows controlled access to non-sensitive profile fields for reports
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id uuid)
RETURNS TABLE(
  user_id uuid,
  full_name text,
  avatar_url text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url
  FROM public.profiles p
  WHERE p.user_id = profile_user_id;
$$;

-- Create a view for public profile data that only exposes safe fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  full_name,
  avatar_url,
  community_score,
  total_reports,
  verified_reports
FROM public.profiles;

-- Enable RLS on the view 
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create policy for the public profiles view
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.public_profiles
FOR SELECT
TO authenticated
USING (true);