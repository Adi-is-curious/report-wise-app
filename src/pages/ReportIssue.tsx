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
  EyeOff,
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ReportIssue = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { categories, createReport, loading } = useReports();
  const { user } = useAuth();

  const urgencyLevels = [
    { value: "low", label: t("lowPriority") || "Low Priority", color: "bg-muted text-muted-foreground" },
    { value: "medium", label: t("mediumPriority") || "Medium Priority", color: "bg-government-yellow text-government-green" },
    { value: "high", label: t("highPriority") || "High Priority", color: "bg-destructive text-destructive-foreground" },
    { value: "critical", label: t("criticalEmergency") || "Critical/Emergency", color: "bg-destructive text-destructive-foreground animate-pulse" }
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("locationNotSupported") || "Geolocation not supported",
        description: t("browserNotSupported") || "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        toast({
          title: t("locationCaptured") || "Location captured!",
          description: t("locationSet") || "Your current location has been set",
          variant: "default"
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: t("locationError") || "Location error",
          description: t("unableToGetLocation") || "Unable to get your current location",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      toast({
        title: t("tooManyFiles") || "Too many files",
        description: t("maxFiveFiles") || "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }
    setSelectedFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t("authRequired") || "Authentication required",
        description: t("signInToSubmit") || "Please sign in to submit a report",
        variant: "destructive"
      });
      return;
    }

    if (!category || !title || !description || !location || !urgencyLevel) {
      toast({
        title: t("missingInfo") || "Missing information",
        description: t("fillAllFields") || "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files to Supabase storage if any
      let mediaUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `reports/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('CivicConnectstorage')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('CivicConnectstorage')
              .getPublicUrl(filePath);
            mediaUrls.push(publicUrl);
          }
        }
      }

      const { error } = await createReport({
        category_id: parseInt(category),
        title,
        description,
        location_name: location,
        latitude,
        longitude,
        urgency_level: urgencyLevel,
        is_anonymous: isAnonymous,
        is_recurring: isRecurring,
        media_urls: mediaUrls
      });

      if (!error) {
        // Reset form
        setCategory("");
        setTitle("");
        setDescription("");
        setLocation("");
        setUrgencyLevel("medium");
        setIsAnonymous(false);
        setIsRecurring(false);
        setSelectedFiles([]);
        setLatitude(undefined);
        setLongitude(undefined);
        
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyConfig = (level: string) => {
    return urgencyLevels.find(u => u.value === level) || urgencyLevels[1];
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-government-light rounded w-1/2 mx-auto mb-2"></div>
            <div className="h-4 bg-government-light rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-government-green">
          {t("reportAnIssue") || "Report an Issue"}
        </h1>
        <p className="text-muted-foreground">
          {t("helpImprove") || "Help improve your community by reporting local issues"}
        </p>
      </div>

      <Card className="shadow-lg border-government-light/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-government-green">
            <AlertTriangle className="h-5 w-5" />
            {t("issueDetails") || "Issue Details"}
          </CardTitle>
          <CardDescription>
            {t("provideDetails") || "Provide clear details to help us address your concern effectively"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">{t("issueCategory") || "Issue Category"} *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory") || "Select issue category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {t("language") === 'hi' ? cat.name_hindi : cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("issueTitle") || "Issue Title"} *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("briefDescription") || "Brief description of the issue"}
                required
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t("detailedDescription") || "Detailed Description"} *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("provideMoreDetails") || "Provide more details about the issue, when it started, its impact, etc."}
                required
                rows={4}
                maxLength={500}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">{t("location") || "Location"} *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t("streetAddress") || "Street address or landmark"}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  title={t("useCurrentLocation") || "Use current location"}
                  className="border-government-green text-government-green hover:bg-government-light"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-3">
              <Label>{t("urgencyLevel") || "Urgency Level"} *</Label>
              <div className="grid grid-cols-2 gap-2">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      urgencyLevel === level.value 
                        ? 'border-government-green bg-government-light' 
                        : 'hover:bg-government-light/50 border-government-light'
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
              <Label>{t("photosVideos") || "Photos/Videos"} ({t("optional") || "Optional"})</Label>
              <div className="border-2 border-dashed border-government-light rounded-lg p-6 text-center hover:border-government-green transition-colors">
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
                    <Upload className="h-8 w-8 mx-auto text-government-green" />
                    <p className="text-sm text-muted-foreground">
                      {t("clickToUpload") || "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("maxFiles") || "Max 5 files, up to 10MB each"}
                    </p>
                  </div>
                </label>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-government-light rounded">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-government-green" />
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
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Toggles */}
            <div className="space-y-4 p-4 bg-government-light/30 rounded-lg border border-government-light">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isAnonymous ? <EyeOff className="h-4 w-4 text-government-green" /> : <Eye className="h-4 w-4 text-government-green" />}
                    <Label htmlFor="anonymous">{t("submitAnonymously") || "Submit Anonymously"}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("identityNotVisible") || "Your identity will not be visible to the public"}
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
                    <RefreshCw className="h-4 w-4 text-government-green" />
                    <Label htmlFor="recurring">{t("recurringIssue") || "Recurring Issue"}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("repeatedProblem") || "This is a repeated or ongoing problem"}
                  </p>
                </div>
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-government-green hover:bg-government-green/90"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t("submittingReport") || "Submitting Report..."}
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {t("submitReport") || "Submit Report"}
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