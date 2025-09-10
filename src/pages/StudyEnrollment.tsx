import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/navigation/AppHeader';
import { StudyEnrollment as StudyEnrollmentComponent } from '@/components/study/StudyEnrollment';
import { ACUXQuestionnaire } from '@/components/study/ACUXQuestionnaire';
import { getStudyParticipant, isEnrolledInStudy, StudyParticipant, ACUXPersonality } from '@/lib/studyStorage';

export default function StudyEnrollment() {
  const [participant, setParticipant] = useState<StudyParticipant | null>(null);
  const [showACUX, setShowACUX] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const existing = getStudyParticipant();
    if (existing && existing.consentGiven) {
      if (existing.acuxPersonality) {
        // Already completed, redirect to profile
        navigate('/profile');
        return;
      } else {
        // Enrolled but no ACUX assessment yet
        setParticipant(existing);
        setShowACUX(true);
      }
    }
  }, [navigate]);

  const handleEnrollmentComplete = (newParticipant: StudyParticipant) => {
    setParticipant(newParticipant);
    setShowACUX(true);
  };

  const handleACUXComplete = (personality: ACUXPersonality) => {
    navigate('/profile?studyComplete=true');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        {!showACUX ? (
          <StudyEnrollmentComponent onEnrollmentComplete={handleEnrollmentComplete} />
        ) : (
          <ACUXQuestionnaire onComplete={handleACUXComplete} />
        )}
      </main>
    </div>
  );
}