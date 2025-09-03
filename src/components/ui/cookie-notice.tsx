import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = 'ccim_cookie_consent';

interface CookieNoticeProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export function CookieNotice({ onAccept, onDecline }: CookieNoticeProps) {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // Show notice on first visit or if no consent given
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to ensure proper rendering
      const timer = setTimeout(() => {
        setShowNotice(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowNotice(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowNotice(false);
    onDecline?.();
  };

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-background/98 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <Card className="max-w-4xl mx-auto p-6 shadow-card">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 text-primary mt-1">
            <Cookie className="h-5 w-5" />
            <Shield className="h-4 w-4" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                Privacy-Respecting Cookies
              </h3>
              <p className="text-sm text-muted-foreground">
                We use essential cookies to save your travel persona preferences locally on your device. 
                <strong> Your data stays private</strong> - it's not shared with third parties or external services. 
                These cookies help us provide a personalized experience by remembering your preferences across visits.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleAccept}
                className="flex-1 sm:flex-none"
              >
                Accept & Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDecline}
                className="flex-1 sm:flex-none"
              >
                Decline Cookies
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              By accepting, you agree to the storage of cookies for personalizing your heritage site experience.
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDecline}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export const getCookieConsent = (): 'accepted' | 'declined' | null => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent as 'accepted' | 'declined' | null;
};

export const hasCookieConsent = (): boolean => {
  return getCookieConsent() === 'accepted';
};