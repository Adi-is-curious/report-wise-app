-- Fix RLS policies for tables that were missing them

-- Add missing policies for coin_transactions (allow users to insert through triggers)
CREATE POLICY "System can insert coin transactions" ON public.coin_transactions
  FOR INSERT WITH CHECK (true);

-- Add missing policies for notifications (allow system to insert)
CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);