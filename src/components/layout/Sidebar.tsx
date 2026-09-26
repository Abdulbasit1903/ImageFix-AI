import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Cpu,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageRoute } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo, currentUser, signOut } = useApp();

  const navItems: Array<{
    id: PageRoute;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-diagnosis', label: 'New Diagnosis', icon: PlusCircle },
    { id: 'history', label: 'Diagnosis History', icon: History },
    { id: 'saved-devices', label: 'Saved Devices', icon: Cpu },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col justify-between shrink-0 min-h-screen sticky top-0 h-screen select-none z-20">
      <div>
        {/* Brand header matching Stitch */}
        <div className="p-6 border-b border-[#f1f5f9]">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-start gap-3 text-left group w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center shadow-md shadow-[#4f46e5]/25 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-[#131b2e] leading-tight flex items-center gap-1">
                <span>FixIt AI</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold">
                  PRO
                </span>
              </div>
              <div className="font-mono text-[10px] tracking-wider uppercase text-[#777587] mt-0.5 font-medium">
                Diagnostic Engine v2.4
              </div>
            </div>
          </button>

          {/* New Diagnosis Primary CTA Button */}
          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="w-full mt-5 py-2.5 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm shadow-[#4f46e5]/30 transition-all hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ New Diagnosis</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentRoute === item.id ||
              (item.id === 'settings' && currentRoute === 'profile') ||
              (item.id === 'new-diagnosis' &&
                (currentRoute === 'ai-analysis' ||
                  currentRoute === 'followup-questions' ||
                  currentRoute === 'troubleshooting-guide' ||
                  currentRoute === 'troubleshoot-chat')) ||
              (item.id === 'history' && currentRoute === 'diagnosis-detail');

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#eaedff] text-[#3525cd] shadow-xs'
                    : 'text-[#464555] hover:bg-[#f8fafc] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#3525cd]' : 'text-[#777587]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3525cd]"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile dock at bottom matching Stitch */}
      <div className="p-4 border-t border-[#f1f5f9] bg-[#faf8ff]">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-[#e2e8f0]">
          <button
            onClick={() => navigateTo('profile')}
            className="flex items-center gap-2.5 text-left flex-1 min-w-0"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#e2e8f0] shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#131b2e] truncate flex items-center gap-1">
                <span>{currentUser.name}</span>
              </div>
              <div className="font-mono text-[10px] tracking-wide text-[#3525cd] font-semibold uppercase flex items-center gap-1">
                <span>{currentUser.tier.replace('HARDWARE ', '')}</span>
              </div>
            </div>
          </button>

          <button
            onClick={signOut}
            title="Sign Out"
            className="p-1.5 text-[#777587] hover:text-[#ba1a1a] hover:bg-[#fee2e2] rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
