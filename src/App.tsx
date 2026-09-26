import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/common/SearchModal';

import { LandingPage } from './components/pages/LandingPage';
import { SignInPage, SignUpPage } from './components/pages/AuthPages';
import { DashboardPage } from './components/pages/DashboardPage';
import { NewDiagnosisPage } from './components/pages/NewDiagnosisPage';
import { AiAnalysisPage } from './components/pages/AiAnalysisPage';
import { FollowUpQuestionsPage } from './components/pages/FollowUpQuestionsPage';
import { TroubleshootingGuidePage } from './components/pages/TroubleshootingGuidePage';
import { AiTroubleshootChatPage } from './components/pages/AiTroubleshootChatPage';
import { DiagnosisHistoryPage } from './components/pages/DiagnosisHistoryPage';
import { DiagnosisDetailPage } from './components/pages/DiagnosisDetailPage';
import { SavedDevicesPage } from './components/pages/SavedDevicesPage';
import { SettingsPage } from './components/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute, isAuthenticated, isAuthLoading } = useApp();

  // Show loading indicator while session is being verified on startup
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#4f46e5]/25 border-t-[#4f46e5] rounded-full animate-spin"></div>
          <span className="font-mono text-xs text-[#777587]">Verifying Supabase session...</span>
        </div>
      </div>
    );
  }

  // Public unauthenticated routes
  if (currentRoute === 'landing') {
    return (
      <>
        <LandingPage />
        <SearchModal />
      </>
    );
  }

  if (currentRoute === 'signin') {
    return (
      <>
        <SignInPage />
        <SearchModal />
      </>
    );
  }

  if (currentRoute === 'signup') {
    return (
      <>
        <SignUpPage />
        <SearchModal />
      </>
    );
  }

  // Fallback for unauthenticated access to protected dashboard pages: redirect to Sign In
  if (!isAuthenticated) {
    return (
      <>
        <SignInPage />
        <SearchModal />
      </>
    );
  }

  // Authenticated App Shell with Sidebar & Navbar
  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardPage />;
      case 'new-diagnosis':
        return <NewDiagnosisPage />;
      case 'ai-analysis':
        return <AiAnalysisPage />;
      case 'followup-questions':
        return <FollowUpQuestionsPage />;
      case 'troubleshooting-guide':
        return <TroubleshootingGuidePage />;
      case 'troubleshoot-chat':
        return <AiTroubleshootChatPage />;
      case 'history':
        return <DiagnosisHistoryPage />;
      case 'diagnosis-detail':
        return <DiagnosisDetailPage />;
      case 'saved-devices':
        return <SavedDevicesPage />;
      case 'profile':
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {renderCurrentView()}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>

      {/* Global Command Palette */}
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
