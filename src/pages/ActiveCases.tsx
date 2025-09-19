import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageCircle,
  Clock,
  AlertTriangle 
} from "lucide-react";

const ActiveCases = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mockCases = [
    {
      id: 1,
      title: "Broken streetlight on Main St",
      description: "The streetlight has been out for 3 days, creating safety concerns for pedestrians.",
      category: "Street Lighting",
      status: "In Progress",
      location: "Main St & 5th Ave",
      upvotes: 15,
      comments: 3,
      reportedBy: "Sarah M.",
      timeAgo: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Large pothole causing traffic issues",
      description: "Deep pothole is forcing cars to swerve into oncoming traffic.",
      category: "Road Maintenance",
      status: "Pending",
      location: "Oak Avenue",
      upvotes: 23,
      comments: 7,
      reportedBy: "Anonymous",
      timeAgo: "4 hours ago",
      priority: "critical"
    },
    {
      id: 3,
      title: "Overflowing trash bin in park",
      description: "The trash bin has been overflowing for several days, attracting pests.",
      category: "Sanitation",
      status: "Assigned",
      location: "Central Park",
      upvotes: 8,
      comments: 2,
      reportedBy: "Mike R.",
      timeAgo: "6 hours ago",
      priority: "medium"
    },
    {
      id: 4,
      title: "Graffiti on public building",
      description: "Large graffiti covering the side of the community center.",
      category: "Public Safety",
      status: "Resolved",
      location: "Community Center",
      upvotes: 5,
      comments: 1,
      reportedBy: "Lisa K.",
      timeAgo: "1 day ago",
      priority: "low"
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-destructive";
      case "high": return "text-warning";
      case "medium": return "text-government-blue";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const categories = ["all", "Road Maintenance", "Street Lighting", "Sanitation", "Public Safety", "Parks & Recreation"];
  const statuses = ["all", "Pending", "Assigned", "In Progress", "Resolved"];

  const filteredCases = mockCases.filter(caseItem => {
    const matchesSearch = searchTerm === "" || 
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || caseItem.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || caseItem.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-government-navy">Active Cases</h1>
          <p className="text-muted-foreground">View and track all reported issues in your area</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredCases.length} of {mockCases.length} cases
        </div>
      </div>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-government-blue" />
            Interactive Map View
          </CardTitle>
          <CardDescription>
            Click on pins to view case details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-accent/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">Interactive map will be integrated here</p>
              <p className="text-sm text-muted-foreground">
                Google Maps API integration required
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === "all" ? "All Statuses" : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.map((caseItem) => (
          <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-government-navy text-lg">
                          {caseItem.title}
                        </h3>
                        <AlertTriangle className={`h-4 w-4 ${getPriorityColor(caseItem.priority)}`} />
                      </div>
                      <p className="text-muted-foreground mb-3">{caseItem.description}</p>
                    </div>
                    <Badge className={getStatusColor(caseItem.status)}>
                      {caseItem.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {caseItem.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {caseItem.timeAgo}
                    </div>
                    <span>•</span>
                    <span>Reported by {caseItem.reportedBy}</span>
                    <Badge variant="outline" className="text-xs">
                      {caseItem.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {caseItem.upvotes}
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {caseItem.comments}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveCases;