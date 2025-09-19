import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MapPin, 
  Upload, 
  AlertTriangle, 
  RefreshCw,
  Eye,
  EyeOff 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ReportIssue = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [urgencyLevel, setUrgencyLevel] = useState("medium");
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "Road Maintenance",
    "Street Lighting",
    "Sanitation",
    "Public Safety",
    "Parks & Recreation",
    "Utilities",
    "Traffic & Transportation",
    "Noise Complaints",
    "Environmental Issues",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority", color: "bg-muted text-muted-foreground" },
    { value: "medium", label: "Medium Priority", color: "bg-warning text-warning-foreground" },
    { value: "high", label: "High Priority", color: "bg-destructive text-destructive-foreground" },
    { value: "critical", label: "Critical/Emergency", color: "bg-destructive text-destructive-foreground animate-pulse" }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location captured",
            description: `Coordinates: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get current location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Report submitted successfully!",
        description: "Your issue has been logged and will be reviewed by the relevant department.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  const getUrgencyConfig = (level: string) => {
    return urgencyLevels.find(u => u.value === level) || urgencyLevels[1];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-government-navy">Report an Issue</h1>
        <p className="text-muted-foreground">
          Help improve your community by reporting local issues
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-government-blue" />
            Issue Details
          </CardTitle>
          <CardDescription>
            Provide clear details to help us address your concern effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Issue Category *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                required
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue, when it started, its impact, etc."
                required
                rows={4}
                maxLength={500}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Street address or landmark"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  title="Use current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-3">
              <Label>Urgency Level *</Label>
              <div className="grid grid-cols-2 gap-2">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      urgencyLevel === level.value 
                        ? 'border-government-blue bg-government-light' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => setUrgencyLevel(level.value)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{level.label}</span>
                      <Badge className={level.color}>
                        {level.value.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <Label>Photos/Videos (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max 5 files, up to 10MB each
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-accent rounded">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <Label htmlFor="anonymous">Submit Anonymously</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your identity will not be visible to the public
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    <Label htmlFor="repeated">Recurring Issue</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is a repeated or ongoing problem
                  </p>
                </div>
                <Switch
                  id="repeated"
                  checked={isRepeated}
                  onCheckedChange={setIsRepeated}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportIssue;