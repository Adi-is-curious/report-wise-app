import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Award,
  MapPin,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const userStats = [
    { label: "Reports Submitted", value: "12", icon: FileText, change: "+2 this month" },
    { label: "Issues Resolved", value: "8", icon: CheckCircle, change: "67% success rate" },
    { label: "Community Points", value: "340", icon: Award, change: "+45 this week" },
    { label: "Total Upvotes", value: "89", icon: TrendingUp, change: "Trending up" },
  ];

  const myReports = [
    {
      id: 1,
      title: "Broken streetlight on Elm Street",
      status: "Resolved",
      category: "Street Lighting",
      location: "Elm St & 3rd Ave",
      submittedDate: "2024-01-15",
      resolvedDate: "2024-01-18",
      assignedOfficer: "Officer Johnson",
      upvotes: 12,
      comments: 3,
      priority: "high"
    },
    {
      id: 2,
      title: "Pothole on Main Road",
      status: "In Progress",
      category: "Road Maintenance",
      location: "Main Rd & Oak St",
      submittedDate: "2024-01-20",
      assignedOfficer: "Maintenance Team A",
      upvotes: 8,
      comments: 2,
      priority: "medium"
    },
    {
      id: 3,
      title: "Graffiti on park bench",
      status: "Pending",
      category: "Public Safety",
      location: "Central Park",
      submittedDate: "2024-01-22",
      upvotes: 3,
      comments: 1,
      priority: "low"
    },
    {
      id: 4,
      title: "Overflowing trash bin",
      status: "Assigned",
      category: "Sanitation",
      location: "Market Square",
      submittedDate: "2024-01-23",
      assignedOfficer: "Sanitation Dept.",
      upvotes: 15,
      comments: 4,
      priority: "medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-success text-success-foreground";
      case "In Progress": return "bg-government-blue text-white";
      case "Assigned": return "bg-government-accent text-white";
      case "Pending": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "Resolved": return 100;
      case "In Progress": return 75;
      case "Assigned": return 50;
      case "Pending": return 25;
      default: return 0;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "medium": return <Clock className="h-4 w-4 text-warning" />;
      case "low": return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-government-navy">My Dashboard</h1>
        <p className="text-muted-foreground">Track your reports and community impact</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="text-2xl font-bold text-government-navy">{stat.value}</div>
                <stat.icon className="h-5 w-5 text-government-blue" />
              </div>
              <div className="text-sm font-medium">{stat.label}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-government-blue" />
                My Reports
              </CardTitle>
              <CardDescription>
                Track the status of your submitted issues
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/report")}>
              Submit New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {myReports.map((report) => (
            <div key={report.id} className="border rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-government-navy text-lg">
                      {report.title}
                    </h3>
                    {getPriorityIcon(report.priority)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {report.location}
                    </div>
                    <Badge variant="outline">{report.category}</Badge>
                    <span>Submitted: {new Date(report.submittedDate).toLocaleDateString()}</span>
                    {report.resolvedDate && (
                      <span>Resolved: {new Date(report.resolvedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  {report.assignedOfficer && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Assigned to: </span>
                      <span className="font-medium text-government-blue">{report.assignedOfficer}</span>
                    </div>
                  )}
                </div>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{getProgressValue(report.status)}%</span>
                </div>
                <Progress value={getProgressValue(report.status)} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {report.upvotes} upvotes
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {report.comments} comments
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/community")}>
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/report")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-government-blue">
              <FileText className="h-5 w-5" />
              Submit New Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Report a new issue in your community and help make it better.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/rewards")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-government-blue">
              <Award className="h-5 w-5" />
              View Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Check your points balance and available rewards for active participation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;