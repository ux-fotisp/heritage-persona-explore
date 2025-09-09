import { useState, useEffect } from "react";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Cookie, Database, Users, Lock, Eye, Settings, RefreshCw, Trash2 } from "lucide-react";
import { getCookieConsent, hasCookieConsent } from "@/components/ui/cookie-notice";
import { clearPersonaCookie, clearPersonaAssessmentCookie } from "@/lib/cookieStorage";
import { clearPersona, clearPersonaAssessment } from "@/lib/personaStorage";
import { useToast } from "@/hooks/use-toast";

const Privacy = () => {
  const [consentStatus, setConsentStatus] = useState<'accepted' | 'declined' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setConsentStatus(getCookieConsent());
  }, []);

  const handleChangeConsent = (newConsent: 'accepted' | 'declined') => {
    const COOKIE_CONSENT_KEY = 'ccim_cookie_consent';
    localStorage.setItem(COOKIE_CONSENT_KEY, newConsent);
    setConsentStatus(newConsent);
    
    if (newConsent === 'declined') {
      // Clear existing cookies when consent is withdrawn
      clearPersonaCookie();
      clearPersonaAssessmentCookie();
      toast({
        title: "Cookies Disabled",
        description: "Your persona data has been cleared and cookies have been disabled.",
      });
    } else {
      toast({
        title: "Cookies Enabled",
        description: "You can now save your persona preferences across sessions.",
      });
    }
  };

  const handleClearAllData = () => {
    // Clear all stored data
    clearPersonaCookie();
    clearPersonaAssessmentCookie();
    clearPersona();
    clearPersonaAssessment();
    
    // Clear other localStorage items
    localStorage.removeItem('plannedSites');
    localStorage.removeItem('favoritesList');
    
    toast({
      title: "All Data Cleared",
      description: "Your persona data and preferences have been completely removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Privacy Policy" backPath="/" />
      
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            Privacy First
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Privacy Matters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We are committed to protecting your privacy and being transparent about how we handle your data.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Cookie className="h-6 w-6 text-primary" />
              <CardTitle>Cookie Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use essential cookies to save your travel persona preferences locally on your device. 
                These cookies are:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Stored only on your device</li>
                <li>Not shared with third parties</li>
                <li>Used to personalize your experience</li>
                <li>Removable at any time through your browser settings</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>You have full control:</strong> You can accept or decline cookies when prompted. 
                Declining cookies means your preferences won't be saved between visits.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Controls Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-4">
              <Settings className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <CardTitle>Privacy Controls</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your cookie preferences and data
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-3">
                  <Cookie className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Cookie Status</p>
                    <p className="text-sm text-muted-foreground">
                      Controls whether your preferences are saved
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={consentStatus === 'accepted' ? 'default' : consentStatus === 'declined' ? 'destructive' : 'secondary'}
                >
                  {consentStatus === 'accepted' ? 'Enabled' : 
                   consentStatus === 'declined' ? 'Disabled' : 'Not Set'}
                </Badge>
              </div>

              {/* Cookie Controls */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Cookie Preferences</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => handleChangeConsent('accepted')}
                    variant={consentStatus === 'accepted' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    <Cookie className="h-4 w-4 mr-2" />
                    Enable Cookies
                  </Button>
                  <Button
                    onClick={() => handleChangeConsent('declined')}
                    variant={consentStatus === 'declined' ? 'destructive' : 'outline'}
                    className="flex-1"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Disable Cookies
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {consentStatus === 'accepted' 
                    ? 'Your persona preferences will be saved across sessions.'
                    : consentStatus === 'declined'
                    ? 'Your data will only be stored temporarily during your current session.'
                    : 'You haven\'t made a choice yet. Your preferences won\'t be saved.'}
                </p>
              </div>

              {/* Data Management */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-foreground">Data Management</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleClearAllData}
                    variant="outline"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clear all stored persona data, preferences, and trip plans from this device.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Data Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We collect minimal data to provide you with personalized heritage site recommendations:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What we collect:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Persona assessment responses</li>
                    <li>Site preferences and ratings</li>
                    <li>Visit schedules (optional)</li>
                    <li>Basic usage analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What we DON'T collect:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Personal identifying information</li>
                    <li>Location data without permission</li>
                    <li>Payment information</li>
                    <li>Social media profiles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Data Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, rent, or share your personal data with third parties, except:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>When required by law</li>
                <li>With your explicit consent</li>
                <li>Aggregated, anonymized data for research purposes (no individual identification possible)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your data is protected through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
                <li>Secure hosting infrastructure</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Eye className="h-6 w-6 text-primary" />
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your data (right to be forgotten)</li>
                <li>Withdraw consent at any time</li>
                <li>Export your data in a portable format</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, please contact us through the app or visit our support page.
              </p>
            </CardContent>
          </Card>

          <Separator />

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>
            <p className="text-sm text-muted-foreground">
              If you have questions about this privacy policy, please contact us through the app's support feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;