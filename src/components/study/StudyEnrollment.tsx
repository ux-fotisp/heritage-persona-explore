import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Users, Brain, Heart, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { enrollInStudy, giveStudyConsent, StudyParticipant } from '@/lib/studyStorage';
import { useToast } from '@/hooks/use-toast';

interface StudyEnrollmentProps {
  onEnrollmentComplete: (participant: StudyParticipant) => void;
}

export function StudyEnrollment({ onEnrollmentComplete }: StudyEnrollmentProps) {
  const [step, setStep] = useState<'info' | 'demographics' | 'consent'>('info');
  const [demographicData, setDemographicData] = useState({
    age: '',
    gender: '',
    nationality: '',
    travelExperience: ''
  });
  const [consent, setConsent] = useState({
    dataCollection: false,
    emotionTracking: false,
    followUpContact: false,
    dataRetention: false
  });
  const { toast } = useToast();

  const handleEnroll = () => {
    const participant = enrollInStudy(demographicData);
    const consentGiven = giveStudyConsent(consent);
    
    if (consentGiven) {
      toast({
        title: "Successfully enrolled!",
        description: "You're now part of the cultural heritage experience study."
      });
      onEnrollmentComplete(participant);
    } else {
      toast({
        title: "Enrollment failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const allConsentGiven = Object.values(consent).every(Boolean);

  if (step === 'info') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cultural Heritage Experience Study
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Study Overview</h3>
            <p className="text-muted-foreground mb-4">
              We're conducting research on how different personality types experience cultural heritage sites. 
              Your participation will help us understand visitor experiences and improve cultural tourism.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Brain className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">ACUX Typology</div>
                <div className="text-sm text-muted-foreground">Personality assessment</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Emotion Tracking</div>
                <div className="text-sm text-muted-foreground">Geneva Emotion Wheel</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Experience Evaluation</div>
                <div className="text-sm text-muted-foreground">UEQ-S questionnaire</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Micro-Diary Studies</div>
                <div className="text-sm text-muted-foreground">Pre/post/follow-up</div>
              </div>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Participation is voluntary and you can withdraw at any time. All data is anonymized and stored locally on your device.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={() => setStep('demographics')} className="flex-1">
              Participate in Study
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'demographics') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Demographics (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age Range</Label>
              <Select value={demographicData.age} onValueChange={(value) => 
                setDemographicData(prev => ({ ...prev, age: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-25">18-25</SelectItem>
                  <SelectItem value="26-35">26-35</SelectItem>
                  <SelectItem value="36-45">36-45</SelectItem>
                  <SelectItem value="46-55">46-55</SelectItem>
                  <SelectItem value="56-65">56-65</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={demographicData.gender} onValueChange={(value) => 
                setDemographicData(prev => ({ ...prev, gender: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              placeholder="Your nationality"
              value={demographicData.nationality}
              onChange={(e) => setDemographicData(prev => ({ ...prev, nationality: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="travel-experience">Travel Experience</Label>
            <Select value={demographicData.travelExperience} onValueChange={(value) => 
              setDemographicData(prev => ({ ...prev, travelExperience: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Your travel experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novice">Novice (1-5 trips)</SelectItem>
                <SelectItem value="intermediate">Intermediate (6-15 trips)</SelectItem>
                <SelectItem value="experienced">Experienced (16-30 trips)</SelectItem>
                <SelectItem value="expert">Expert (30+ trips)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setStep('consent')} className="flex-1">
              Continue
            </Button>
            <Button variant="outline" onClick={() => setStep('info')}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Consent Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="data-collection"
              checked={consent.dataCollection}
              onCheckedChange={(checked) => 
                setConsent(prev => ({ ...prev, dataCollection: checked as boolean }))
              }
            />
            <div>
              <Label htmlFor="data-collection" className="text-sm font-medium">
                Data Collection
              </Label>
              <p className="text-sm text-muted-foreground">
                I consent to the collection of my responses to questionnaires and evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="emotion-tracking"
              checked={consent.emotionTracking}
              onCheckedChange={(checked) => 
                setConsent(prev => ({ ...prev, emotionTracking: checked as boolean }))
              }
            />
            <div>
              <Label htmlFor="emotion-tracking" className="text-sm font-medium">
                Emotion Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                I consent to tracking my emotional responses using the Geneva Emotion Wheel.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="follow-up-contact"
              checked={consent.followUpContact}
              onCheckedChange={(checked) => 
                setConsent(prev => ({ ...prev, followUpContact: checked as boolean }))
              }
            />
            <div>
              <Label htmlFor="follow-up-contact" className="text-sm font-medium">
                Follow-up Studies
              </Label>
              <p className="text-sm text-muted-foreground">
                I consent to being contacted for follow-up research (optional).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="data-retention"
              checked={consent.dataRetention}
              onCheckedChange={(checked) => 
                setConsent(prev => ({ ...prev, dataRetention: checked as boolean }))
              }
            />
            <div>
              <Label htmlFor="data-retention" className="text-sm font-medium">
                Data Retention
              </Label>
              <p className="text-sm text-muted-foreground">
                I understand that anonymized data will be stored locally and used for research purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleEnroll} 
            disabled={!allConsentGiven}
            className="flex-1"
          >
            Complete Enrollment
          </Button>
          <Button variant="outline" onClick={() => setStep('demographics')}>
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}