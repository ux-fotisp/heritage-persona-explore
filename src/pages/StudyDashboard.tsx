import React from 'react';
import { AppHeader } from '@/components/navigation/AppHeader';
import { StudyDashboard as StudyDashboardComponent } from '@/components/study/StudyDashboard';

export default function StudyDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment/10 via-background to-parchment/5">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-terracotta-foreground">
              Study Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your participation in the cultural heritage evaluation study
            </p>
          </div>
          
          <StudyDashboardComponent />
        </div>
      </main>
    </div>
  );
}