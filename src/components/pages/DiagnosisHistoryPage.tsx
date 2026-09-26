import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Filter,
  PlusCircle,
  Download,
  Calendar,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiagnosisHistoryPage: React.FC = () => {
  const { diagnoses, navigateTo, setCurrentCase } = useApp();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = diagnoses.filter((d) => d.status === 'active').length;
  const resolvedCount = diagnoses.filter((d) => d.status === 'resolved').length;

  const filteredCases = diagnoses.filter((c) => {
    if (filterTab === 'active' && c.status !== 'active') return false;
    if (filterTab === 'resolved' && c.status !== 'resolved') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.detectedDevice.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.problemDescription.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Title Header matching Stitch Image 27 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e]">
            Diagnosis History
          </h1>
          <p className="text-xs text-[#777587] mt-0.5">
            Archived and active device troubleshooting sessions
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#f2f3ff] text-[#3525cd] font-mono text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>{diagnoses.length} LOGS</span>
        </div>
      </div>

      {/* Search Input Bar with CMD+K badge matching Stitch */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#777587] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search diagnoses by device or issue..."
          className="w-full pl-10 pr-16 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-xs sm:text-sm text-[#131b2e] placeholder-[#777587] outline-none focus:border-[#4f46e5] shadow-2xs"
        />
        <div className="absolute right-3 top-2.5 font-mono text-[10px] text-[#777587] bg-[#f1f5f9] border border-[#e2e8f0] px-1.5 py-0.5 rounded">
          CMD+K
        </div>
      </div>

      {/* Filter Tabs matching Stitch Image 27 */}
      <div className="flex items-center gap-2 p-1 bg-[#eaedff]/60 rounded-xl w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'all'
              ? 'bg-white text-[#3525cd] shadow-xs'
              : 'text-[#464555] hover:text-[#131b2e]'
          }`}
        >
          <span>All</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#f2f3ff] text-[#3525cd]">
            {diagnoses.length}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('active')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'active'
              ? 'bg-white text-[#ba1a1a] shadow-xs'
              : 'text-[#464555] hover:text-[#131b2e]'
          }`}
        >
          <span>Active</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#ba1a1a]">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setFilterTab('resolved')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'resolved'
              ? 'bg-white text-[#059669] shadow-xs'
              : 'text-[#464555] hover:text-[#131b2e]'
          }`}
        >
          <span>Resolved</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#059669]">
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-[#e2e8f0] text-center space-y-3">
            <Search className="w-8 h-8 text-[#94a3b8] mx-auto" />
            <h3 className="font-display font-bold text-base text-[#131b2e]">No diagnosis records found</h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              You haven't run any diagnostic sessions matching this filter yet. Upload a photo to diagnose a device.
            </p>
            <button
              onClick={() => navigateTo('new-diagnosis')}
              className="mt-2 px-4 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Start New Diagnosis
            </button>
          </div>
        ) : (
          filteredCases.map((item) => {
          const isActive = item.status === 'active';

          return (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm hover:border-[#c7c4d8] transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80'}
                    alt={item.detectedDevice}
                    className="w-12 h-12 rounded-xl object-cover border border-[#e2e8f0] shrink-0"
                  />
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#131b2e]">
                      {item.detectedDevice}
                    </h2>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#777587]">
                      {item.timestampDisplay}
                    </div>
                  </div>
                </div>

                {/* Status badge matching Stitch */}
                {isActive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                    <span>Troubleshooting</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Resolved</span>
                  </span>
                )}
              </div>

              {/* Reported problem callout block */}
              <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] text-xs text-[#334155] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#777587] shrink-0 mt-0.5" />
                <span>{item.problemDescription}</span>
              </div>

              {/* Verified step or resolution pill */}
              {item.status === 'resolved' && (
                <div className="p-2.5 rounded-xl bg-[#f2f3ff] text-xs text-[#3525cd] font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  <span className="truncate">
                    {item.problemSummary || 'Verified resolution steps completed.'}
                  </span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]">
                <div className="font-mono text-xs text-[#464555] flex items-center gap-2">
                  {isActive ? (
                    <span className="text-[#3525cd] flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      Stage 03: VRAM Stress Test
                    </span>
                  ) : (
                    <span className="text-[#777587]">
                      {item.troubleshootingSteps.length} steps verified
                    </span>
                  )}
                </div>

                {isActive ? (
                  <button
                    onClick={() => {
                      setCurrentCase(item);
                      navigateTo('diagnosis-detail', item.id);
                    }}
                    className="px-4 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3525cd] font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Diagnosis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentCase(item);
                      navigateTo('diagnosis-detail', item.id);
                    }}
                    className="text-xs font-semibold text-[#464555] hover:text-[#3525cd] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Summary</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
