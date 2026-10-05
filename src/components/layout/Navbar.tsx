import React from 'react';
import { Search, Bell, Activity, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentUser, navigateTo, setIsSearchModalOpen, currentRoute } = useApp();

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Mobile brand & title */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          aria-label="Go to the dashboard"
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-2 font-display font-bold text-lg text-[#131b2e]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shadow-sm shadow-[#4f46e5]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>ImageFix<span className="text-[#4f46e5]">.AI</span></span>
        </button>
      </div>

      {/* Desktop Search Bar matching Stitch */}
      <div className="hidden lg:flex items-center flex-1 max-w-xl">
        <button
          type="button"
          aria-label="Open search"
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-[#464555] bg-[#f8fafc] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#777587] group-hover:text-[#4f46e5] transition-colors" />
            <span className="text-[#64748b]">Search diagnoses, devices, symptoms...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-white border border-[#c7c4d8] text-[#464555] px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 lg:gap-5">
        {/* Engine status indicator matching Stitch */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#dad7ff] text-[#3525cd] font-mono text-[11px] tracking-wider uppercase font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
          <span>AI Engine Online • Visual Diagnostics</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          title="Notifications"
          aria-label="Open recent diagnostics"
          className="relative p-2 text-[#464555] hover:text-[#131b2e] hover:bg-[#f2f3ff] rounded-full transition-colors"
          onClick={() => navigateTo('history')}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4f46e5] rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Avatar Button */}
        <button
          type="button"
          onClick={() => navigateTo('profile')}
          className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#4f46e5]/40 transition-all"
          title={`${currentUser.name} (${currentUser.tier})`}
          aria-label={`Open profile for ${currentUser.name}`}
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#e2e8f0]"
          />
        </button>
      </div>
    </header>
  );
};
