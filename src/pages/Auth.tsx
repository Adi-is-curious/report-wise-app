import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, sendOTP, verifyOTP, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      // Keep user on auth page to show success message
    }
    
    setLoading(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate("/");
    }
    
    setLoading(false);
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!showOtpInput) {
      const { error } = await sendOTP(phone);
      if (!error) {
        setShowOtpInput(true);
      }
    } else {
      const { error } = await verifyOTP(phone, otp);
      if (!error) {
        navigate("/");
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-government-light to-government-green/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 text-government-green"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>
          
          <div className="h-16 w-16 rounded-full bg-government-green flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-government-green">CivicConnect</h1>
          <p className="text-muted-foreground mt-2">
            {t("authSubtitle") || "Your voice in local governance"}
          </p>
        </div>

        <Card className="shadow-lg border-government-light/50">
          <CardHeader>
            <CardTitle className="text-center text-government-green">
              {t("getStarted") || "Get Started"}
            </CardTitle>
            <CardDescription className="text-center">
              {t("authDescription") || "Sign in to report issues and connect with your community"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {t("email") || "Email"}
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {t("phone") || "Phone"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">{t("signIn") || "Sign In"}</TabsTrigger>
                    <TabsTrigger value="signup">{t("signUp") || "Sign Up"}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">{t("email") || "Email"}</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">{t("password") || "Password"}</Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-government-green hover:bg-government-green/90"
                        disabled={loading}
                      >
                        {loading ? t("signingIn") || "Signing In..." : t("signIn") || "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">{t("fullName") || "Full Name"}</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t("enterFullName") || "Enter your full name"}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">{t("email") || "Email"}</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">{t("password") || "Password"}</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-government-green hover:bg-government-green/90"
                        disabled={loading}
                      >
                        {loading ? t("signingUp") || "Signing Up..." : t("signUp") || "Sign Up"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4">
                <form onSubmit={handlePhoneAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phoneNumber") || "Phone Number"}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      disabled={showOtpInput}
                    />
                  </div>
                  
                  {showOtpInput && (
                    <div className="space-y-2">
                      <Label htmlFor="otp">{t("verificationCode") || "Verification Code"}</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        required
                        maxLength={6}
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-government-green hover:bg-government-green/90"
                    disabled={loading}
                  >
                    {loading 
                      ? (showOtpInput ? t("verifying") || "Verifying..." : t("sendingOTP") || "Sending OTP...")
                      : (showOtpInput ? t("verifyCode") || "Verify Code" : t("sendOTP") || "Send OTP")
                    }
                  </Button>
                  
                  {showOtpInput && (
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowOtpInput(false);
                        setOtp("");
                      }}
                    >
                      {t("changeNumber") || "Change Number"}
                    </Button>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t("authFooter") || "By continuing, you agree to our Terms of Service and Privacy Policy"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
