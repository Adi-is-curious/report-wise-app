import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  description: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  is_anonymous: boolean;
  is_recurring: boolean;
  upvotes: number;
  downvotes: number;
  views: number;
  media_urls: string[];
  admin_notes?: string;
  resolution_notes?: string;
  estimated_resolution_date?: string;
  actual_resolution_date?: string;
  assigned_department?: string;
  priority_score: number;
  is_duplicate: boolean;
  parent_report_id?: string;
  ai_analysis?: any;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name?: string;
    avatar_url?: string;
  } | null;
  categories: {
    name: string;
    name_hindi: string;
    icon?: string;
    color: string;
  } | null;
}

export interface Category {
  id: number;
  name: string;
  name_hindi: string;
  description?: string;
  icon?: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles!user_id (
            full_name,
            avatar_url
          ),
          categories!category_id (
            name,
            name_hindi,
            icon,
            color
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data as any) || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    }
  };

  const createReport = async (report: {
    category_id: number;
    title: string;
    description: string;
    location_name: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    urgency_level: string;
    is_anonymous?: boolean;
    is_recurring?: boolean;
    media_urls?: string[];
  }) => {
    if (!user) return { error: new Error('User not authenticated') };

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...report,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Report Submitted!",
        description: "Your report has been submitted successfully. You earned 10 coins!",
        variant: "default"
      });

      // Refresh reports
      await fetchReports();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
      return { error };
    }
  };

  const voteOnReport = async (reportId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('report_id', reportId)
        .single();

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (error) throw error;
      } else {
        // Create new vote
        const { error } = await supabase
          .from('votes')
          .insert({
            user_id: user.id,
            report_id: reportId,
            vote_type: voteType
          });

        if (error) throw error;
      }

      toast({
        title: voteType === 'upvote' ? "Upvoted!" : "Downvoted!",
        description: "Your vote has been recorded",
        variant: "default"
      });

      // Refresh reports to get updated vote counts
      await fetchReports();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReports(), fetchCategories()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          fetchReports();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    reports,
    categories,
    loading,
    createReport,
    voteOnReport,
    refetch: fetchReports
  };
};