import { useState } from "react";
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
  LogOut 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Report Issue", icon: FileText, path: "/report" },
    { label: "Active Cases", icon: MapPin, path: "/map" },
    { label: "Community", icon: Users, path: "/community" },
    { label: "My Reports", icon: User, path: "/dashboard" },
    { label: "Rewards", icon: Award, path: "/rewards" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

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
                  <h2 className="text-lg font-semibold text-government-blue">
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
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => handleNavigation("/login")}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-government-blue flex items-center justify-center">
              <span className="text-sm font-bold text-white">CC</span>
            </div>
            <h1 className="text-xl font-semibold text-government-blue">
              CivicConnect
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;