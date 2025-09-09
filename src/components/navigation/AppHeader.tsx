import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ArrowLeft, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { BurgerMenu } from "./BurgerMenu";
import { NotificationDrawer } from "./NotificationDrawer";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  showBackButton?: boolean;
  backPath?: string;
  title?: string;
}

export function AppHeader({ showBackButton = true, backPath = "/", title }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Check if login should be opened based on URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('login') === 'true') {
      setIsLoginOpen(true);
      // Clean up the URL
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 pt-8 bg-background">
        <button 
          className="p-3 rounded-full bg-surface/20 backdrop-blur-sm"
          onClick={() => setIsBurgerMenuOpen(true)}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </button>
        
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface/20 backdrop-blur-sm border border-border"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
            <span className="text-foreground font-medium">Back</span>
          </button>
        )}

        {title && !showBackButton && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
        
        <div className="flex items-center gap-3">
          <button 
            className="p-3 rounded-full bg-surface/20 backdrop-blur-sm relative"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="h-6 w-6 text-foreground" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-xs text-destructive-foreground font-medium">3</span>
            </div>
          </button>

          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <button 
              className="p-3 rounded-full bg-surface/20 backdrop-blur-sm"
              onClick={() => setIsLoginOpen(true)}
            >
              <User className="h-6 w-6 text-foreground" />
            </button>
          )}
        </div>
      </div>

      <BurgerMenu 
        isOpen={isBurgerMenuOpen} 
        onClose={() => setIsBurgerMenuOpen(false)} 
      />
      
      <NotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
      
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}