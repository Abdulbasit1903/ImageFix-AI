import React from 'react';
import {
  LayoutDashboard,
  SearchCode,
  History,
  Laptop,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageRoute } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();

  const tabs: Array<{
    id: PageRoute;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-diagnosis', label: 'Diagnose', icon: SearchCode },
    { id: 'history', label: 'History', icon: History },
    { id: 'saved-devices', label: 'Devices', icon: Laptop },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#e2e8f0] z-40 px-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentRoute === tab.id ||
          (tab.id === 'new-diagnosis' &&
            (currentRoute === 'ai-analysis' ||
              currentRoute === 'followup-questions' ||
              currentRoute === 'troubleshooting-guide' ||
              currentRoute === 'troubleshoot-chat')) ||
          (tab.id === 'history' && currentRoute === 'diagnosis-detail') ||
          (tab.id === 'settings' && currentRoute === 'profile');

        return (
          <button
            key={tab.id}
            onClick={() => navigateTo(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all ${
              isActive ? 'text-[#3525cd]' : 'text-[#777587] hover:text-[#131b2e]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#eaedff]' : ''}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
