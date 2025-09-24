import React, { useState, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  FileText, 
  Users, 
  Award, 
  Bell,
  Plus,
  Clock,
  TrendingUp,
  CheckCircle,
  Calendar,
  User,
  Camera,
  MessageSquare,
  ThumbsUp,
  Eye,
  Image,
  ArrowUp,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  Wifi,
  Globe,
  Languages
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jharkhandEmblem from "@/assets/jharkhand-emblem.jpg";
import LeafletMap from "@/components/LeafletMap";

// Types
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  tokens: number | null;
  level: string | null;
  total_reports: number | null;
  verified_reports: number | null;
  coins: number | null;
  avatar_url?: string | null;
  city?: string | null;
  state?: string | null;
  phone_number?: string | null;
  is_admin?: boolean | null;
  community_score?: number | null;
  created_at?: string;
  updated_at?: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  category_id: number;
  location_name: string;
  urgency_level: string;
  upvotes: number;
  downvotes: number;
  views: number;
  created_at: string;
  user_id: string;
  categories?: {
    name: string;
    color: string;
  } | null;
  profiles?: {
    full_name: string;
  } | null;
}

interface Reward {
  id: number;
  title: string;
  description: string;
  coins_required: number;
  category: string;
  is_available: boolean;
  image_url?: string;
}

const MobileCivicApp = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  
  // State management
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIssueTab, setActiveIssueTab] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);

  // Form state for new reports
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category_id: 1,
    location_name: '',
    urgency_level: 'medium'
  });

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchReports();
      fetchUserReports();
      fetchRewards();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            full_name: user.email,
            tokens: 0,
            level: 'New Citizen',
            total_reports: 0,
            verified_reports: 0,
            coins: 0
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
        setProfile(newProfile as Profile);
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          categories(name, color),
          profiles!reports_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setReports((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchUserReports = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          categories(name, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserReports(data || []);
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const fetchRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_available', true)
        .order('coins_required', { ascending: true });
      
      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
    setLoading(false);
  };

  const submitReport = async () => {
    if (!user || !newReport.title || !newReport.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('reports')
        .insert([{
          ...newReport,
          user_id: user.id
        }]);
      
      if (error) throw error;
      
      toast.success("Report submitted successfully!");
      setNewReport({ title: '', description: '', category_id: 1, location_name: '', urgency_level: 'medium' });
      setShowReportForm(false);
      fetchUserReports();
      fetchReports();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report");
    }
  };

  const redeemReward = async (rewardId: number, coinsRequired: number) => {
    if (!profile || profile.coins < coinsRequired) {
      toast.error("Insufficient coins");
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('redeem_reward' as any, {
        reward_id_input: rewardId
      });
      
      if (error) throw error;
      
      const result = data as any;
      if (result?.success) {
        toast.success(`Reward redeemed! Code: ${result.redemption_code}`);
        fetchUserProfile(); // Refresh profile to update coin balance
      } else {
        toast.error(result?.error || "Failed to redeem reward");
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error("Failed to redeem reward");
    }
  };

  const voteOnReport = async (reportId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('votes')
        .upsert({
          user_id: user.id,
          report_id: reportId,
          vote_type: voteType
        });
      
      if (error) throw error;
      fetchReports();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-government-green text-white';
      case 'assigned': return 'bg-government-blue text-white';
      case 'in progress': return 'bg-government-orange text-white';
      case 'pending': return 'bg-government-yellow text-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const filterUserReports = (status: string) => {
    if (status === 'all') return userReports;
    return userReports.filter(report => report.status.toLowerCase() === status);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Civic Connect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-government-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={jharkhandEmblem} 
              alt="Government of Jharkhand"
              className="h-10 w-10 rounded-full bg-white p-1"
            />
            <div>
              <h1 className="text-xl font-bold">Civic Connect</h1>
              <p className="text-sm opacity-90">Government of Jharkhand</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm">
              <Wifi className="h-4 w-4" />
              <span>Online</span>
            </div>
            <Bell className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-6">
            {/* Welcome Section */}
            {!user && (
              <div className="text-center py-12 bg-gradient-to-br from-government-blue to-government-green rounded-2xl text-white">
                <div className="mb-6">
                  <User className="h-20 w-20 mx-auto mb-4 opacity-90" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Civic Connect</h2>
                <p className="text-lg opacity-90 mb-6">Report issues, track progress, and help build a better Jharkhand</p>
                <Button 
                  className="bg-white text-government-blue hover:bg-white/90"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* User Stats Cards */}
            {user && profile && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-government-blue text-white border-0">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-bold">{userReports.filter(r => r.status !== 'resolved').length}</div>
                    <div className="text-sm opacity-90">In Progress</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-government-orange text-white border-0">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-bold">{profile.tokens || 0}</div>
                    <div className="text-sm opacity-90">Your Points</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Community Impact Stats */}
            {user && (
              <div>
                <h3 className="text-xl font-bold mb-4">Community Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-government-blue">{reports.length}</div>
                      <div className="text-sm text-muted-foreground">Issues Reported</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-government-green">
                        {reports.filter(r => r.status === 'resolved').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Issues Resolved</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-24 flex-col bg-government-red hover:bg-government-red/90 text-white"
                  onClick={() => setShowReportForm(true)}
                >
                  <Plus className="h-8 w-8 mb-2" />
                  Report Issue
                </Button>
                
                <Button 
                  className="h-24 flex-col bg-government-green hover:bg-government-green/90 text-white"
                  onClick={() => setActiveTab('map')}
                >
                  <MapPin className="h-8 w-8 mb-2" />
                  View Map
                </Button>
                
                <Button 
                  className="h-24 flex-col bg-government-blue hover:bg-government-blue/90 text-white"
                  onClick={() => setActiveTab('community')}
                >
                  <Users className="h-8 w-8 mb-2" />
                  Community
                </Button>
                
                <Button 
                  className="h-24 flex-col bg-government-orange hover:bg-government-orange/90 text-white"
                  onClick={() => setActiveTab('rewards')}
                >
                  <Award className="h-8 w-8 mb-2" />
                  Rewards
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('community')}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-government-blue">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{report.title}</h4>
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="h-3 w-3 text-government-green" />
                          <span className="text-xs">{report.upvotes}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(report.status)} variant="secondary">
                            {report.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(report.created_at)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Issues Tab */}
        {activeTab === 'issues' && user && (
          <div className="p-4 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">My Issues</h2>
              <p className="text-muted-foreground">Track your reported civic issues</p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-government-red">{userReports.length}</div>
                  <div className="text-xs text-muted-foreground">Total Reports</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-government-green">
                    {userReports.filter(r => r.status === 'resolved').length}
                  </div>
                  <div className="text-xs text-muted-foreground">Resolved</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-xl font-bold text-government-blue">{profile?.tokens || 0}</div>
                  <div className="text-xs text-muted-foreground">Points Earned</div>
                </CardContent>
              </Card>
            </div>

            {/* Status Tabs */}
            <Tabs value={activeIssueTab} onValueChange={setActiveIssueTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger value="all" className="text-xs">
                  All Issues ({userReports.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending ({filterUserReports('pending').length})
                </TabsTrigger>
                <TabsTrigger value="assigned" className="text-xs">
                  Assigned ({filterUserReports('assigned').length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">
                  Resolved ({filterUserReports('resolved').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeIssueTab} className="space-y-4">
                {filterUserReports(activeIssueTab).map((report) => (
                  <Card key={report.id} className="border-l-4 border-l-government-blue">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold">{report.title}</h3>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        ID: CIV-{report.id.slice(0, 8).toUpperCase()}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {report.categories?.name || 'General'}
                        </Badge>
                        <Badge className={getStatusColor(report.status)} variant="secondary">
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm mb-3">
                        <p className="font-medium">{report.location_name}</p>
                        <p className="text-muted-foreground">{report.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{report.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Image className="h-3 w-3" />
                            <span>0</span>
                          </div>
                        </div>
                        <span>Last updated: {formatDate(report.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filterUserReports(activeIssueTab).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No issues in this category</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Community Feed</h2>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm">{report.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          by {report.profiles?.full_name || 'Anonymous'} • {formatDate(report.created_at)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {report.categories?.name || 'General'}
                      </Badge>
                      <Badge className={getStatusColor(report.status)} variant="secondary">
                        {report.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mb-3">{report.description}</p>
                    <p className="text-xs text-muted-foreground mb-4">📍 {report.location_name}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => voteOnReport(report.id, 'upvote')}
                          className="flex items-center space-x-1"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{report.upvotes}</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>0</span>
                        </Button>
                        
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{report.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Interactive Map</h2>
            <div className="bg-government-light rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-government-blue mb-4" />
                <p className="text-muted-foreground">Interactive map will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing {reports.length} active issues in your area
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="p-4 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Rewards</h2>
              <p className="text-muted-foreground">Redeem your earned coins</p>
            </div>

            {user && profile && (
                <Card className="bg-gradient-to-r from-government-blue to-government-green text-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold mb-2">{profile.tokens || 0}</div>
                    <div className="text-sm opacity-90">Available Coins</div>
                    <div className="text-xs opacity-75 mt-1">Level: {profile.level || 'New Citizen'}</div>
                  </CardContent>
                </Card>
            )}

            <div className="space-y-4">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{reward.title}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-government-blue">
                          {reward.coins_required}
                        </span>
                        <span className="text-xs text-muted-foreground">coins</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{reward.category}</Badge>
                      <Button 
                        size="sm"
                        disabled={!profile || (profile.tokens || 0) < reward.coins_required}
                        onClick={() => redeemReward(reward.id, reward.coins_required)}
                        className="bg-government-green hover:bg-government-green/90"
                      >
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Report New Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Issue title"
                value={newReport.title}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
              />
              
              <Textarea
                placeholder="Describe the issue..."
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              />
              
              <Input
                placeholder="Location"
                value={newReport.location_name}
                onChange={(e) => setNewReport({...newReport, location_name: e.target.value})}
              />
              
              <div className="flex space-x-2">
                <Button onClick={submitReport} className="flex-1">
                  Submit Report
                </Button>
                <Button variant="outline" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex items-center justify-around py-2 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'home' ? 'text-government-blue' : 'text-muted-foreground'
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'map' ? 'text-government-blue' : 'text-muted-foreground'
            }`}
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span className="text-xs">Map</span>
          </Button>
          
          {/* Central Report Button */}
          <Button
            onClick={() => setShowReportForm(true)}
            className="h-14 w-14 rounded-full bg-government-orange hover:bg-government-orange/90 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('issues')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'issues' ? 'text-government-blue' : 'text-muted-foreground'
            }`}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">My Issues</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('community')}
            className={`flex flex-col items-center p-2 ${
              activeTab === 'community' ? 'text-government-blue' : 'text-muted-foreground'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Community</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default MobileCivicApp;