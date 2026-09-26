import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Cpu,
  PlusCircle,
  Clock,
  Laptop,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Filter,
  Check,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    diagnoses,
    savedDevices,
    navigateTo,
    setCurrentCase,
  } = useApp();

  const [deviceFilter, setDeviceFilter] = useState('All');

  // Compute live counts
  const totalCount = diagnoses.length;
  const activeCount = diagnoses.filter((d) => d.status === 'active').length;
  const resolvedCount = diagnoses.filter((d) => d.status === 'resolved').length;
  const savedCount = savedDevices.length;

  // Active case for spotlight banner (RTX 3080 or first active case)
  const activeSpotlightCase = diagnoses.find((d) => d.status === 'active') || diagnoses[0];

  const filteredDiagnoses = deviceFilter === 'All'
    ? diagnoses
    : diagnoses.filter((d) => d.category.toLowerCase().includes(deviceFilter.toLowerCase()));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Header matching Stitch Image 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#464555]">
            <span className="font-bold text-[#3525cd]">DIAGNOSTIC WORKBENCH</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#059669] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              AI Engine Online
            </span>
            <span>•</span>
            <span>ImageFix v2.4</span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1 flex items-center gap-2">
            <span>Welcome back, {currentUser.name.split(' ')[0]}</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-[#777587] mt-0.5 font-mono">
            AI-powered visual troubleshooting for computers and consumer electronics
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('history')}
            className="px-3.5 py-2 text-xs font-semibold text-[#131b2e] bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[#777587]" />
            <span>Diagnosis History</span>
          </button>

          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#4f46e5] hover:bg-[#4338ca] rounded-lg shadow-sm shadow-[#4f46e5]/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Diagnose a New Device</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards matching Stitch */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Diagnoses */}
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#777587] font-semibold">
              Total Diagnoses
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#131b2e] mt-2">
            {totalCount < 10 ? `0${totalCount}` : totalCount}
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold">
              +4 this month
            </span>
            {/* Sparkline curve */}
            <svg className="w-14 h-4 text-[#3525cd]" viewBox="0 0 50 14" fill="none">
              <path d="M0 12 L12 9 L24 11 L36 4 L48 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Resolved Issues */}
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#777587] font-semibold">
              Resolved Issues
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#131b2e] mt-2">
            {resolvedCount < 10 ? `0${resolvedCount}` : resolvedCount}
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#ecfdf5] text-[#059669] font-semibold">
              86% success rate
            </span>
            <span className="text-[#777587]">Avg repair: 28m</span>
          </div>
        </div>

        {/* Active Diagnoses */}
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#777587] font-semibold">
              Active Diagnoses
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#ba1a1a] mt-2">
            {activeCount < 10 ? `0${activeCount}` : activeCount}
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#fee2e2] text-[#ba1a1a] font-semibold">
              Action Required
            </span>
            <span className="text-[#ba1a1a] truncate font-medium">VRAM Thermal Flag</span>
          </div>
        </div>

        {/* Saved Devices */}
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#777587] font-semibold">
              Saved Devices
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#f2f3ff] text-[#3525cd] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-display font-bold text-3xl text-[#131b2e] mt-2">
            {savedCount < 10 ? `0${savedCount}` : savedCount}
          </div>
          <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between font-mono text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold">
              Registered Hardware
            </span>
            <span className="text-[#777587]">Workbench ready</span>
          </div>
        </div>
      </div>

      {/* Active Case Spotlight Card (Matches Stitch Image 3) */}
      {activeSpotlightCase && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-[#c7c4d8]">
                <img
                  src={activeSpotlightCase.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80'}
                  alt={activeSpotlightCase.detectedDevice}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#3b82f6] border border-white"></span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold uppercase">
                    CASE #{activeSpotlightCase.caseNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-semibold uppercase">
                    HOTSPOT {activeSpotlightCase.hotspotTemp || '104°C'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#464555] font-semibold uppercase">
                    PCIE GEN4 X16
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#131b2e]">
                  {activeSpotlightCase.detectedDevice}
                </h3>
                <p className="text-xs text-[#464555] max-w-2xl leading-relaxed">
                  Reported: {activeSpotlightCase.problemDescription}
                </p>
              </div>
            </div>

            {/* Telemetry quick sensors + Resume CTA */}
            <div className="flex items-center gap-4 self-end lg:self-center">
              <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] font-mono text-xs">
                <div className="text-center">
                  <span className="text-[#777587] block text-[10px]">CORE TEMP</span>
                  <span className="font-bold text-sm text-[#131b2e]">42°C</span>
                  <span className="text-[9px] text-[#059669] block">Normal Idle</span>
                </div>
                <div className="w-px h-8 bg-[#e2e8f0]"></div>
                <div className="text-center">
                  <span className="text-[#ba1a1a] block text-[10px] font-bold">VRAM JUNCTION</span>
                  <span className="font-bold text-sm text-[#ba1a1a]">104°C</span>
                  <span className="text-[9px] text-[#ba1a1a] block font-semibold">Exceeds Spec</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentCase(activeSpotlightCase);
                  navigateTo('troubleshooting-guide', activeSpotlightCase.id);
                }}
                className="px-5 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm shadow-[#4f46e5]/30 transition-all shrink-0 cursor-pointer"
              >
                <span>Resume Diagnosis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Segmented Step Progress Bar matching Stitch */}
          <div className="pt-3 border-t border-[#f1f5f9] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-[#131b2e]">
                <strong className="text-[#3525cd]">Step 3 of 4:</strong> Stress-testing VRAM thermal pads & heatsink mounting pressure
              </span>
              <span className="font-mono text-xs font-semibold text-[#3525cd]">
                60% COMPLETE
              </span>
            </div>

            {/* Segmented bar */}
            <div className="grid grid-cols-4 gap-1.5 h-2">
              <div className="bg-[#4f46e5] rounded-full"></div>
              <div className="bg-[#4f46e5] rounded-full"></div>
              <div className="bg-[#4f46e5]/80 rounded-full animate-pulse"></div>
              <div className="bg-[#e2e8f0] rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Diagnostic Cases Table matching Stitch Image 3 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-lg text-[#131b2e]">
              Recent Diagnostic Cases
            </h2>
            <p className="text-xs text-[#777587]">
              Review recent device diagnoses, resolution summaries, and repair status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#131b2e] outline-none font-medium cursor-pointer"
            >
              <option value="All">All Devices</option>
              <option value="Computer Component">Computer Component</option>
              <option value="3D Printer">3D Printer</option>
              <option value="Laptop">Laptop</option>
              <option value="Router / Networking">Router / Networking</option>
              <option value="Computer">Computer</option>
            </select>

            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(diagnoses, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `imagefix-cases-${Date.now()}.json`;
                a.click();
              }}
              title="Export Cases JSON"
              className="p-1.5 text-[#464555] hover:text-[#131b2e] hover:bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] font-mono text-[10px] uppercase tracking-wider text-[#777587]">
                <th className="py-2.5 px-3">Device</th>
                <th className="py-2.5 px-3">Reported Problem</th>
                <th className="py-2.5 px-3">Device Category</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredDiagnoses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-[#94a3b8]" />
                      <p className="text-xs font-semibold text-[#131b2e]">No diagnostic cases found</p>
                      <p className="text-[11px] text-[#64748b]">Upload a device photo to start your first visual AI diagnosis.</p>
                      <button
                        onClick={() => navigateTo('new-diagnosis')}
                        className="mt-1 px-3 py-1.5 bg-[#4f46e5] text-white text-xs font-semibold rounded-lg hover:bg-[#4338ca] transition-colors cursor-pointer"
                      >
                        Diagnose a Device
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDiagnoses.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => {
                    setCurrentCase(c);
                    navigateTo('diagnosis-detail', c.id);
                  }}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=100&q=80'}
                        alt={c.detectedDevice}
                        className="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0] shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-sm text-[#131b2e] group-hover:text-[#3525cd] transition-colors">
                          {c.detectedDevice}
                        </div>
                        <div className="font-mono text-[10px] text-[#777587]">
                          {c.hardwareSpecs?.[0]?.value || `Case #${c.caseNumber}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    <div className="text-[#334155] line-clamp-1">{c.problemDescription}</div>
                    <div className="font-mono text-[11px] mt-0.5 font-semibold">
                      {c.status === 'resolved' ? (
                        <span className="text-[#059669]">
                          Resolved: {c.problemSummary ? c.problemSummary.replace('Resolved: ', '') : 'Fixed'}
                        </span>
                      ) : (
                        <span className="text-[#ba1a1a]">
                          {c.problemSummary || 'Investigation in progress'}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-1 rounded bg-[#f1f5f9] border border-[#e2e8f0] font-mono text-[11px] text-[#475569]">
                      {c.telemetryProfile || `${c.category}`}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-[#777587]">
                    {c.timestampDisplay}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered Hardware Lab Dock (Matches Stitch Image 3) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#3525cd]" />
            <h3 className="font-display font-bold text-base text-[#131b2e]">
              Registered Hardware Lab Dock ({savedDevices.length} Profiles)
            </h3>
          </div>

          <button
            onClick={() => navigateTo('saved-devices')}
            className="text-xs font-semibold text-[#3525cd] hover:underline flex items-center gap-1"
          >
            <span>Manage Lab Profiles</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scroll cards */}
        {savedDevices.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#777587]">
            No saved devices registered yet.{' '}
            <button
              onClick={() => navigateTo('saved-devices')}
              className="text-[#3525cd] font-semibold hover:underline cursor-pointer"
            >
              Add a device to your lab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {savedDevices.map((dev) => (
              <button
                key={dev.id}
                onClick={() => navigateTo('saved-devices')}
                className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] hover:border-[#3525cd] hover:bg-[#f2f3ff] transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#eaedff] text-[#3525cd] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {dev.tag}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#131b2e] truncate group-hover:text-[#3525cd]">
                    {dev.name.split(' (')[0]}
                  </div>
                  <div className="font-mono text-[10px] text-[#777587] truncate">
                    {dev.status === 'Active Issue' ? (
                      <span className="text-[#ba1a1a] font-semibold">1 Active Case</span>
                    ) : (
                      <span>Ready • Verified</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
