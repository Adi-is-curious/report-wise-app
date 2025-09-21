import { Home, FileText, MapPin, Users, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navigationItems = [
    { label: t("home"), icon: Home, path: "/" },
    { label: t("reportIssue"), icon: FileText, path: "/report" },
    { label: t("activeCases"), icon: MapPin, path: "/map" },
    { label: t("community"), icon: Users, path: "/community" },
    { label: t("profile"), icon: User, path: "/dashboard" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navigationItems.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-government-green bg-government-light' 
                  : 'text-muted-foreground hover:text-government-green hover:bg-government-light/50'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${isActive ? 'text-government-green' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-government-green' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;