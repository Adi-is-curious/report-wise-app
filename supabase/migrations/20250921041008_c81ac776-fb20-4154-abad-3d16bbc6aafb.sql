-- Create comprehensive database schema for CivicConnect

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT DEFAULT 'Jharkhand',
  coins INTEGER DEFAULT 0,
  total_reports INTEGER DEFAULT 0,
  verified_reports INTEGER DEFAULT 0,
  community_score INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table for issue types
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_hindi TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#10B981',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, name_hindi, description, icon) VALUES
('Infrastructure', 'बुनियादी ढांचा', 'Roads, bridges, utilities', 'Construction'),
('Sanitation', 'स्वच्छता', 'Waste management, cleanliness', 'Trash2'),
('Traffic', 'यातायात', 'Traffic signals, parking, congestion', 'Car'),
('Environment', 'पर्यावरण', 'Pollution, tree cutting, noise', 'Leaf'),
('Public Safety', 'सार्वजनिक सुरक्षा', 'Street lighting, security concerns', 'Shield'),
('Water Supply', 'जल आपूर्ति', 'Water shortages, quality issues', 'Droplets'),
('Electricity', 'बिजली', 'Power outages, faulty connections', 'Zap'),
('Healthcare', 'स्वास्थ्य सेवा', 'Medical facilities, ambulance services', 'Heart'),
('Education', 'शिक्षा', 'School infrastructure, resources', 'GraduationCap'),
('Others', 'अन्य', 'Other civic issues', 'MoreHorizontal');

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 1,
  downvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  media_urls TEXT[],
  admin_notes TEXT,
  resolution_notes TEXT,
  estimated_resolution_date DATE,
  actual_resolution_date DATE,
  assigned_department TEXT,
  priority_score INTEGER DEFAULT 0,
  is_duplicate BOOLEAN DEFAULT FALSE,
  parent_report_id UUID REFERENCES public.reports(id),
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table to track user votes
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, report_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_official BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment votes table
CREATE TABLE public.comment_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Create rewards table
CREATE TABLE public.rewards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_hindi TEXT NOT NULL,
  description TEXT NOT NULL,
  description_hindi TEXT NOT NULL,
  coins_required INTEGER NOT NULL,
  category TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  total_available INTEGER,
  times_redeemed INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample rewards
INSERT INTO public.rewards (title, title_hindi, description, description_hindi, coins_required, category, total_available) VALUES
('Government Certificate', 'सरकारी प्रमाण पत्र', 'Official recognition certificate', 'आधिकारिक मान्यता प्रमाण पत्र', 100, 'recognition', 100),
('CivicConnect T-Shirt', 'सिविककनेक्ट टी-शर्ट', 'Official CivicConnect merchandise', 'आधिकारिक सिविककनेक्ट वस्तु', 50, 'merchandise', 50),
('City Tour Pass', 'शहर भ्रमण पास', 'Free guided city tour', 'मुफ्त निर्देशित शहर भ्रमण', 200, 'experience', 25);

-- Create user rewards redemptions table
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id INTEGER NOT NULL REFERENCES public.rewards(id),
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'delivered'))
);

-- Create coin transactions table
CREATE TABLE public.coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.reports(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  description_hindi TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.reports(id),
  title TEXT NOT NULL,
  title_hindi TEXT NOT NULL,
  message TEXT NOT NULL,
  message_hindi TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('report_update', 'comment', 'reward', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Reports policies
CREATE POLICY "Reports are viewable by everyone" ON public.reports
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own reports" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
  FOR UPDATE USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Users can view all votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Comment votes policies
CREATE POLICY "Users can view all comment votes" ON public.comment_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own comment votes" ON public.comment_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment votes" ON public.comment_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Rewards policies (public read)
CREATE POLICY "Rewards are viewable by everyone" ON public.rewards
  FOR SELECT USING (true);

-- User rewards policies
CREATE POLICY "Users can view their own reward redemptions" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reward redemptions" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Coin transactions policies
CREATE POLICY "Users can view their own coin transactions" ON public.coin_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions and triggers
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update user coins and stats
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile stats when report is created
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET total_reports = total_reports + 1,
        coins = coins + 10
    WHERE user_id = NEW.user_id;
    
    -- Add coin transaction
    INSERT INTO public.coin_transactions (user_id, report_id, transaction_type, amount, description, description_hindi)
    VALUES (NEW.user_id, NEW.id, 'earned', 10, 'Report submission reward', 'रिपोर्ट सबमिशन पुरस्कार');
    
    RETURN NEW;
  END IF;
  
  -- Update verified reports when status changes to resolved
  IF TG_OP = 'UPDATE' AND OLD.status != 'resolved' AND NEW.status = 'resolved' THEN
    UPDATE public.profiles 
    SET verified_reports = verified_reports + 1,
        coins = coins + 50
    WHERE user_id = NEW.user_id;
    
    -- Add bonus coin transaction
    INSERT INTO public.coin_transactions (user_id, report_id, transaction_type, amount, description, description_hindi)
    VALUES (NEW.user_id, NEW.id, 'bonus', 50, 'Report resolution bonus', 'रिपोर्ट समाधान बोनस');
    
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_report_stats_update
  AFTER INSERT OR UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats();

-- Create indexes for better performance
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_category_id ON public.reports(category_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_urgency ON public.reports(urgency_level);
CREATE INDEX idx_reports_location ON public.reports(latitude, longitude);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_votes_report_id ON public.votes(report_id);
CREATE INDEX idx_comments_report_id ON public.comments(report_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_coin_transactions_user_id ON public.coin_transactions(user_id);

-- Enable real-time for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;