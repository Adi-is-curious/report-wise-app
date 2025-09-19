import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import civicHeroImage from "@/assets/civic-hero.jpg";

const Home = () => {
  const navigate = useNavigate();

  const quickStats = [
    { label: "Active Reports", value: "127", icon: FileText, color: "bg-government-blue" },
    { label: "Resolved This Month", value: "89", icon: CheckCircle, color: "bg-success" },
    { label: "Community Members", value: "2.4K", icon: Users, color: "bg-government-accent" },
    { label: "Avg Response Time", value: "2.3 days", icon: Clock, color: "bg-warning" },
  ];

  const recentReports = [
    {
      id: 1,
      title: "Broken streetlight on Main St",
      status: "In Progress",
      location: "Downtown",
      upvotes: 15,
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Pothole causing traffic issues",
      status: "Pending",
      location: "Oak Avenue",
      upvotes: 23,
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "Graffiti removal needed",
      status: "Resolved",
      location: "Park District",
      upvotes: 8,
      timeAgo: "1 day ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-success text-success-foreground";
      case "In Progress": return "bg-government-blue text-white";
      case "Pending": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-government-blue to-government-accent">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${civicHeroImage})` }}
        ></div>
        <div className="relative text-center space-y-6 py-16 px-8 text-white">
          <h1 className="text-5xl font-bold">
            Welcome to CivicConnect
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Your voice in local governance. Report issues, track progress, and build a better community together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/report")}
              className="bg-white text-government-blue hover:bg-white/90"
            >
              <FileText className="mr-2 h-5 w-5" />
              Report an Issue
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/map")}
              className="border-white text-white hover:bg-white/10"
            >
              <MapPin className="mr-2 h-5 w-5" />
              View Active Cases
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-government-navy">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Community Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-government-blue" />
                Recent Community Reports
              </CardTitle>
              <CardDescription>
                Latest issues reported by your neighbors
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/community")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate("/community")}
            >
              <div className="space-y-1">
                <h4 className="font-medium text-government-navy">{report.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{report.location}</span>
                  <span>•</span>
                  <span>{report.timeAgo}</span>
                  <span>•</span>
                  <span>{report.upvotes} votes</span>
                </div>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/report")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-government-blue">
              <FileText className="h-5 w-5" />
              Quick Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quickly report issues in your neighborhood with photo and location tagging.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/map")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-government-blue">
              <MapPin className="h-5 w-5" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View all active cases in your area with real-time status updates.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/community")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-government-blue">
              <Users className="h-5 w-5" />
              Community Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Engage with your community by voting and commenting on local issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;