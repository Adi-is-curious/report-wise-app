import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Star, 
  Gift, 
  TrendingUp,
  CheckCircle,
  Clock,
  Trophy,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Rewards = () => {
  const [userPoints] = useState(340);
  const { toast } = useToast();

  const achievements = [
    {
      id: 1,
      title: "First Reporter",
      description: "Submit your first community report",
      icon: Award,
      earned: true,
      points: 50,
      earnedDate: "2024-01-10"
    },
    {
      id: 2,
      title: "Community Helper",
      description: "Get 10 upvotes on your reports",
      icon: Star,
      earned: true,
      points: 100,
      earnedDate: "2024-01-18"
    },
    {
      id: 3,
      title: "Issue Resolver",
      description: "Have 5 reports successfully resolved",
      icon: CheckCircle,
      earned: true,
      points: 150,
      earnedDate: "2024-01-20"
    },
    {
      id: 4,
      title: "Civic Champion",
      description: "Submit 20 community reports",
      icon: Trophy,
      earned: false,
      points: 200,
      progress: 60,
      current: 12,
      target: 20
    },
    {
      id: 5,
      title: "Community Voice",
      description: "Receive 100 total upvotes",
      icon: TrendingUp,
      earned: false,
      points: 300,
      progress: 89,
      current: 89,
      target: 100
    }
  ];

  const availableRewards = [
    {
      id: 1,
      title: "Free Bus Pass",
      description: "1-month unlimited public transportation",
      pointsCost: 500,
      category: "Transportation",
      available: true,
      popularity: "Most Popular"
    },
    {
      id: 2,
      title: "Community Center Day Pass",
      description: "Full day access to recreational facilities",
      pointsCost: 200,
      category: "Recreation",
      available: true
    },
    {
      id: 3,
      title: "Civic Recognition Certificate",
      description: "Official recognition for community service",
      pointsCost: 300,
      category: "Recognition",
      available: true
    },
    {
      id: 4,
      title: "Local Business Voucher",
      description: "$25 credit at participating local businesses",
      pointsCost: 400,
      category: "Shopping",
      available: true,
      popularity: "Limited Time"
    },
    {
      id: 5,
      title: "Premium City Services",
      description: "Priority scheduling for city services",
      pointsCost: 600,
      category: "Services",
      available: false
    },
    {
      id: 6,
      title: "City Council Meeting Invitation",
      description: "VIP invitation to monthly city council meetings",
      pointsCost: 800,
      category: "Civic Engagement",
      available: false
    }
  ];

  const pointsHistory = [
    { date: "2024-01-23", action: "Report upvoted", points: 10 },
    { date: "2024-01-22", action: "Issue resolved", points: 50 },
    { date: "2024-01-20", action: "Achievement unlocked", points: 150 },
    { date: "2024-01-18", action: "Community comment", points: 5 },
    { date: "2024-01-15", action: "Report submitted", points: 25 }
  ];

  const redeemReward = (rewardId: number, pointsCost: number, title: string) => {
    if (userPoints >= pointsCost) {
      toast({
        title: "Reward redeemed!",
        description: `You have successfully redeemed ${title}. Check your email for details.`,
      });
    } else {
      toast({
        title: "Insufficient points",
        description: `You need ${pointsCost - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Transportation": return "bg-government-blue text-white";
      case "Recreation": return "bg-success text-success-foreground";
      case "Recognition": return "bg-government-accent text-white";
      case "Shopping": return "bg-warning text-warning-foreground";
      case "Services": return "bg-government-navy text-white";
      case "Civic Engagement": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-government-navy">Rewards & Achievements</h1>
        <p className="text-muted-foreground">Earn points for making your community better</p>
      </div>

      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-government-blue to-government-accent text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
              <div className="flex items-center gap-2">
                <Zap className="h-8 w-8" />
                <span className="text-4xl font-bold">{userPoints}</span>
                <span className="text-xl">points</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Next milestone</p>
              <p className="text-lg font-semibold">500 points</p>
              <Progress value={(userPoints / 500) * 100} className="w-32 mt-2 bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-government-blue" />
            Achievements
          </CardTitle>
          <CardDescription>
            Unlock achievements by actively participating in your community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center justify-between p-4 border rounded-lg ${
                achievement.earned ? 'bg-success/5 border-success/20' : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  achievement.earned ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <achievement.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-government-navy">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {!achievement.earned && achievement.progress && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{achievement.current}/{achievement.target}</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2 w-32" />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className={achievement.earned ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {achievement.earned ? "Earned" : "Locked"}
                </Badge>
                <p className="text-sm font-medium text-government-blue mt-1">
                  +{achievement.points} points
                </p>
                {achievement.earned && achievement.earnedDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-government-blue" />
            Available Rewards
          </CardTitle>
          <CardDescription>
            Redeem your points for valuable rewards and benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className={`border rounded-lg p-4 space-y-3 ${
                  reward.available ? 'hover:shadow-md transition-shadow' : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Badge className={getCategoryColor(reward.category)}>
                    {reward.category}
                  </Badge>
                  {reward.popularity && (
                    <Badge variant="outline" className="text-xs">
                      {reward.popularity}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-government-navy">{reward.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-government-blue" />
                    <span className="font-medium">{reward.pointsCost} points</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={!reward.available || userPoints < reward.pointsCost}
                    onClick={() => redeemReward(reward.id, reward.pointsCost, reward.title)}
                  >
                    {userPoints >= reward.pointsCost && reward.available ? "Redeem" : "Insufficient"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-government-blue" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent point earning activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pointsHistory.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-success font-medium">
                  <span>+{activity.points}</span>
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;