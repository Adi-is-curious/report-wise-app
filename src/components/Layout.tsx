import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  MapPin, 
  Users, 
  User, 
  FileText, 
  Award,
  LogOut,
  Globe,
  Bell
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut, loading } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const navigationItems = [
    { label: t("home"), icon: Home, path: "/" },
    { label: t("reportIssue"), icon: FileText, path: "/report" },
    { label: t("activeCases"), icon: MapPin, path: "/map" },
    { label: t("community"), icon: Users, path: "/community" },
    { label: t("myReports"), icon: User, path: "/dashboard" },
    { label: t("rewards"), icon: Award, path: "/rewards" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLanguageChange = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-government-green flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-sm font-bold text-white">CC</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-6">
                  <h2 className="text-lg font-semibold text-government-green">
                    CivicConnect
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your voice in local governance
                  </p>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActivePath(item.path) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
                <div className="border-t p-4">
                  <div className="mb-4 px-2">
                    <p className="text-sm font-medium text-government-green">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t("signOut")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-2 flex-1">
            <div className="h-8 w-8 rounded bg-government-green flex items-center justify-center">
              <span className="text-sm font-bold text-white">CC</span>
            </div>
            <h1 className="text-xl font-semibold text-government-green">
              CivicConnect
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/notifications")}
              className="text-government-green hover:bg-government-light"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageChange}
              className="text-government-green hover:bg-government-light"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'हिं' : 'EN'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Layout;