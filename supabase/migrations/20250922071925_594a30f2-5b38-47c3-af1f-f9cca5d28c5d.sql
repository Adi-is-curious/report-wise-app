-- Comprehensive database migration for mobile Civic Connect app
-- Add missing columns to profiles table for gamification
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tokens integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level text DEFAULT 'New Citizen';

-- Create issues table (renaming/restructuring reports if needed)
-- Since reports table already exists, we'll add any missing mobile-specific columns
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS issue_id text GENERATED ALWAYS AS ('CIV-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(id::text, 6, '0')) STORED;

-- Ensure rewards table has all necessary columns for mobile app
-- (rewards table already exists, add any missing columns)
ALTER TABLE public.rewards 
ADD COLUMN IF NOT EXISTS redemption_instructions text,
ADD COLUMN IF NOT EXISTS terms_conditions text;

-- Create user_redeemed_rewards table if it doesn't exist (user_rewards already exists)
-- Add any missing columns to existing user_rewards table
ALTER TABLE public.user_rewards 
ADD COLUMN IF NOT EXISTS redemption_code text,
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS used boolean DEFAULT false;

-- Create RPC function for secure reward redemption
CREATE OR REPLACE FUNCTION public.redeem_reward(reward_id_input integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_tokens integer;
  reward_cost integer;
  reward_title text;
  redemption_id uuid;
  redemption_code text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not authenticated');
  END IF;
  
  -- Get user's current token balance
  SELECT tokens INTO user_tokens 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  -- Get reward details
  SELECT coins_required, title INTO reward_cost, reward_title
  FROM public.rewards 
  WHERE id = reward_id_input AND is_available = true;
  
  -- Check if reward exists
  IF reward_cost IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Reward not found or unavailable');
  END IF;
  
  -- Check if user has enough tokens
  IF user_tokens < reward_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient tokens');
  END IF;
  
  -- Generate redemption code
  redemption_code := 'RDM-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));
  
  -- Deduct tokens and create redemption record
  UPDATE public.profiles 
  SET tokens = tokens - reward_cost 
  WHERE user_id = auth.uid();
  
  INSERT INTO public.user_rewards (user_id, reward_id, redemption_code, expires_at)
  VALUES (auth.uid(), reward_id_input, redemption_code, now() + interval '30 days')
  RETURNING id INTO redemption_id;
  
  -- Update reward redemption count
  UPDATE public.rewards 
  SET times_redeemed = times_redeemed + 1 
  WHERE id = reward_id_input;
  
  RETURN json_build_object(
    'success', true, 
    'redemption_code', redemption_code,
    'redemption_id', redemption_id,
    'remaining_tokens', user_tokens - reward_cost
  );
END;
$$;

-- Create RPC function for granting tokens
CREATE OR REPLACE FUNCTION public.grant_tokens_for_action(
  target_user_id uuid,
  action_type text,
  token_amount integer,
  description_text text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token_balance integer;
  new_level text;
BEGIN
  -- Update user tokens
  UPDATE public.profiles 
  SET tokens = tokens + token_amount 
  WHERE user_id = target_user_id
  RETURNING tokens INTO new_token_balance;
  
  -- Determine new level based on token balance
  SELECT CASE 
    WHEN new_token_balance >= 1000 THEN 'Champion Citizen'
    WHEN new_token_balance >= 500 THEN 'Active Citizen' 
    WHEN new_token_balance >= 200 THEN 'Engaged Citizen'
    WHEN new_token_balance >= 50 THEN 'Aware Citizen'
    ELSE 'New Citizen'
  END INTO new_level;
  
  -- Update user level
  UPDATE public.profiles 
  SET level = new_level 
  WHERE user_id = target_user_id;
  
  -- Create coin transaction record
  INSERT INTO public.coin_transactions (
    user_id, 
    transaction_type, 
    amount, 
    description,
    description_hindi
  ) VALUES (
    target_user_id,
    'earned',
    token_amount,
    COALESCE(description_text, 'Tokens earned for ' || action_type),
    COALESCE(description_text, action_type || ' के लिए टोकन अर्जित')
  );
  
  RETURN json_build_object(
    'success', true,
    'new_balance', new_token_balance,
    'new_level', new_level
  );
END;
$$;

-- Update existing triggers to use new token system
DROP TRIGGER IF EXISTS update_user_stats_trigger ON public.reports;

CREATE OR REPLACE FUNCTION public.update_user_stats_mobile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile stats when report is created
  IF TG_OP = 'INSERT' THEN
    -- Grant tokens for report submission
    PERFORM public.grant_tokens_for_action(
      NEW.user_id, 
      'report_submission', 
      10, 
      'Report submission reward'
    );
    
    -- Update report count
    UPDATE public.profiles 
    SET total_reports = total_reports + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  END IF;
  
  -- Grant bonus tokens when report is resolved
  IF TG_OP = 'UPDATE' AND OLD.status != 'resolved' AND NEW.status = 'resolved' THEN
    -- Grant resolution bonus tokens
    PERFORM public.grant_tokens_for_action(
      NEW.user_id, 
      'report_resolution', 
      50, 
      'Report resolution bonus'
    );
    
    -- Update verified reports count
    UPDATE public.profiles 
    SET verified_reports = verified_reports + 1
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the new trigger
CREATE TRIGGER update_user_stats_mobile_trigger
  AFTER INSERT OR UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_mobile();

-- Create RLS policies for new mobile features
CREATE POLICY "Users can redeem rewards" 
ON public.user_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for mobile app
ALTER TABLE public.reports REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.user_rewards REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.reports;
ALTER publication supabase_realtime ADD TABLE public.profiles;
ALTER publication supabase_realtime ADD TABLE public.user_rewards;