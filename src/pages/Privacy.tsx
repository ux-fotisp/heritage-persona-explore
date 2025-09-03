import { AppHeader } from "@/components/navigation/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Cookie, Database, Users, Lock, Eye } from "lucide-react";

const Privacy = () => {
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