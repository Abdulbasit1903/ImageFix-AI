import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Cpu,
  Gauge,
  Lock,
  Key,
  ShieldCheck,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
  Bell,
  Activity,
  Download,
  Database,
  Trash2,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    settings,
    updateSettings,
    clearAllCache,
    signOut,
    diagnoses,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [avatarInput, setAvatarInput] = useState(currentUser.avatarUrl);

  const [cacheClearedNotice, setCacheClearedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      email: emailInput,
      avatarUrl: avatarInput,
    });
    setIsEditingProfile(false);
  };

  const handleExportHistory = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(diagnoses, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagefix-diagnoses-dump-${Date.now()}.json`;
      a.click();
    } else {
      // Simple CSV export
      const rows = [
        ['Case ID', 'Device', 'Category', 'Status', 'Timestamp', 'Problem'],
        ...diagnoses.map((d) => [
          d.caseNumber,
          `"${d.detectedDevice}"`,
          `"${d.category}"`,
          d.status,
          `"${d.timestampDisplay}"`,
          `"${d.problemDescription.replace(/"/g, '""')}"`,
        ]),
      ];
      const csvContent = rows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imagefix-diagnoses-${Date.now()}.csv`;
      a.click();
    }
  };

  const handleClearCache = () => {
    if (confirm('Clear local offline cache and reset sample cases?')) {
      clearAllCache();
      setCacheClearedNotice(true);
      setTimeout(() => setCacheClearedNotice(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="font-mono text-xs uppercase font-bold text-[#3525cd] tracking-widest">
          SETTINGS & PREFERENCES
        </h1>
        <div className="font-display font-bold text-2xl text-[#131b2e] mt-0.5">
          User Profile & System Guardrails
        </div>
      </div>

      {cacheClearedNotice && (
        <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-xs text-[#065f46] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>Local offline cache successfully flushed and reset.</span>
        </div>
      )}

      {/* User Avatar Card matching Stitch Image 1 */}
      <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
          />
          <button
            onClick={() => {
              const newUrl = prompt('Enter image URL for avatar:', currentUser.avatarUrl);
              if (newUrl) updateProfile({ avatarUrl: newUrl });
            }}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-md hover:bg-[#4338ca] transition-colors cursor-pointer"
            title="Change photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5 font-display font-bold text-xl text-[#131b2e]">
            <span>{currentUser.name}</span>
            <CheckCircle2 className="w-4 h-4 text-[#3525cd]" />
          </div>
          <div className="text-xs text-[#777587] font-mono mt-0.5">
            {currentUser.email}
          </div>
        </div>

        {/* Tier and ID Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] font-semibold">
          <span className="px-3 py-1 rounded-full bg-[#eaedff] text-[#3525cd] uppercase tracking-wider flex items-center gap-1">
            <span>🏆</span>
            <span>{currentUser.tier}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#f1f5f9] text-[#464555] uppercase tracking-wider">
            ID: {currentUser.proId}
          </span>
        </div>

        {/* Edit profile details button */}
        {!isEditingProfile ? (
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-4 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile Details</span>
          </button>
        ) : (
          <form onSubmit={handleSaveProfile} className="w-full max-w-sm space-y-2 pt-2 text-left">
            <div>
              <label className="text-[10px] font-mono text-[#777587] block uppercase">Full Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-[#777587] block uppercase">Email Address</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-1.5 bg-[#4f46e5] text-white text-xs font-semibold rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 border text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3 Metric Stats Badges matching Stitch Image 1 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="font-display font-bold text-2xl text-[#131b2e]">
            {currentUser.stats.solvedCount}
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#777587] tracking-wider">
            SOLVED
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center mb-1">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="font-display font-bold text-2xl text-[#131b2e]">
            {currentUser.stats.devicesCount}
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#777587] tracking-wider">
            DEVICES
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#3525cd] flex items-center justify-center mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="font-display font-bold text-2xl text-[#131b2e]">
            {currentUser.stats.accuracyRate}
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#777587] tracking-wider">
            ACCURACY
          </span>
        </div>
      </div>

      {/* Section: SECURITY & CREDENTIALS matching Stitch Image 1 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#3525cd] px-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Credentials</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm divide-y divide-[#f1f5f9]">
          {/* Email */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#777587] flex items-center justify-center">
                @
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Email Address</div>
                <div className="text-xs text-[#777587] font-mono">{currentUser.email}</div>
              </div>
            </div>
            <Lock className="w-4 h-4 text-[#777587]" />
          </div>

          {/* Password */}
          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#faf8ff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#777587] flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Change Password</div>
                <div className="text-xs text-[#777587]">Last updated 3 months ago</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#777587]" />
          </div>

          {/* 2FA */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Two-Factor Authentication (2FA)</div>
                <div className="text-xs text-[#059669] font-medium flex items-center gap-1">
                  <span>●</span> Enabled (Authenticator App)
                </div>
              </div>
            </div>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669]">
              CONFIGURED
            </span>
          </div>
        </div>
      </div>

      {/* Section: PREFERENCES matching Stitch Image 1 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#3525cd] px-1">
          <Activity className="w-4 h-4" />
          <span>Preferences</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 space-y-4">
          {/* Appearance Theme */}
          <div>
            <div className="text-xs font-semibold text-[#131b2e] mb-2">Appearance Theme</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'bg-[#eaedff] text-[#3525cd] border-[#3525cd]'
                    : 'bg-[#faf8ff] text-[#464555] border-[#e2e8f0]'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'bg-[#eaedff] text-[#3525cd] border-[#3525cd]'
                    : 'bg-[#faf8ff] text-[#464555] border-[#e2e8f0]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'system' })}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  settings.theme === 'system'
                    ? 'bg-[#eaedff] text-[#3525cd] border-[#3525cd]'
                    : 'bg-[#faf8ff] text-[#464555] border-[#e2e8f0]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>System</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Safety Warning Level</div>
                <div className="text-xs text-[#777587]">Strict (Recommended)</div>
              </div>
            </div>

            <button
              onClick={() =>
                updateSettings({
                  safetyWarningLevel:
                    settings.safetyWarningLevel === 'strict' ? 'standard' : 'strict',
                })
              }
              className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase bg-[#eaedff] text-[#3525cd] hover:bg-[#dad7ff] transition-colors"
            >
              {settings.safetyWarningLevel.toUpperCase()} &gt;
            </button>
          </div>

          {/* Push Notifications */}
          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Push Notifications</div>
                <div className="text-xs text-[#777587]">Device alerts & diagnostic status</div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => updateSettings({ pushNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#cbd5e1] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4f46e5]"></div>
            </label>
          </div>

          {/* Diagnostic Session Logs */}
          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Diagnostic Session Logs</div>
                <div className="text-xs text-[#777587]">Save local troubleshooting history</div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.diagnosticTelemetryLogs}
                onChange={(e) =>
                  updateSettings({ diagnosticTelemetryLogs: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#cbd5e1] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4f46e5]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Section: DATA & ACCOUNT matching Stitch Image 1 */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#3525cd] px-1">
          <Database className="w-4 h-4" />
          <span>Data & Account</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm divide-y divide-[#f1f5f9]">
          {/* Export JSON / CSV */}
          <div
            onClick={() => handleExportHistory('json')}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#faf8ff] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Export Diagnosis History</div>
                <div className="text-xs text-[#777587]">
                  CSV / JSON diagnostic dumps ({diagnoses.length} records)
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#777587]" />
          </div>

          {/* Clear Cache */}
          <div
            onClick={handleClearCache}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#faf8ff] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#777587] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Clear Local Cache</div>
                <div className="text-xs text-[#777587]">
                  Free up cached diagnostic guides and images
                </div>
              </div>
            </div>
            <span className="font-mono text-xs text-[#777587]">14.2 MB</span>
          </div>

          {/* Delete Account */}
          <div
            onClick={() => {
              if (confirm('Permanently delete your ImageFix AI profile and diagnoses?')) {
                signOut();
              }
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#fee2e2]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#ba1a1a]">Delete Account</div>
                <div className="text-xs text-[#777587]">
                  Permanently remove diagnosis history and account
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ba1a1a]" />
          </div>
        </div>
      </div>

      {/* Sign Out Button matching Stitch Image 1 */}
      <div>
        <button
          onClick={signOut}
          className="w-full py-3 bg-white hover:bg-[#f8fafc] text-[#334155] hover:text-[#ba1a1a] border border-[#e2e8f0] font-semibold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of ImageFix AI</span>
        </button>
      </div>

      {/* Footer matching Stitch Image 1 */}
      <div className="text-center space-y-1 font-mono text-[10px] text-[#777587] pt-4">
        <div>ImageFix AI v2.4.9 • Hardware & Electronics Diagnostic Assistant</div>
        <div className="flex justify-center gap-3 text-[#464555]">
          <span>Terms of Service</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Safety Disclaimers</span>
        </div>
        <div className="text-[9px] uppercase tracking-wider text-[#059669] font-bold pt-1">
          IMAGEFIX AI MULTIMODAL ASSISTANT • CONSUMER SAFETY COMPLIANT
        </div>
      </div>
    </div>
  );
};
