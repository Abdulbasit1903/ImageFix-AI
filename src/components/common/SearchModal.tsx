import React, { useState, useEffect } from 'react';
import { Search, X, Cpu, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, diagnoses, savedDevices, navigateTo } = useApp();
  const [query, setQuery] = useState('');

  // Handle keyboard shortcut CMD+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredDiagnoses = query.trim()
    ? diagnoses.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.caseNumber.toLowerCase().includes(query.toLowerCase()) ||
          d.problemDescription.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase())
      )
    : diagnoses.slice(0, 3);

  const filteredDevices = query.trim()
    ? savedDevices.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase()) ||
          d.specsSummary.toLowerCase().includes(query.toLowerCase())
      )
    : savedDevices.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#131b2e]/40 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search diagnostics and devices"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#c7c4d8] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e2e8f0]">
          <label htmlFor="global-search-input" className="sr-only">
            Search diagnostics and devices
          </label>
          <Search className="w-5 h-5 text-[#4f46e5] mr-3 shrink-0" aria-hidden="true" />
          <input
            id="global-search-input"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, device models, symptoms, or error codes..."
            className="w-full text-base bg-transparent text-[#131b2e] placeholder-[#777587] outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search query"
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#f1f5f9] rounded-md text-[#777587] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-2 py-1 text-xs bg-[#f2f3ff] text-[#3525cd] rounded font-mono font-medium"
            aria-label="Close search dialog"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSearchModalOpen(false);
                navigateTo('new-diagnosis');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 text-[#3525cd] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>+ Start New Diagnosis</span>
            </button>
            <button
              onClick={() => {
                setIsSearchModalOpen(false);
                navigateTo('history');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-xs font-medium transition-colors"
            >
              <span>View All 12 History Logs</span>
            </button>
          </div>

          {/* Diagnoses Section */}
          <div>
            <div className="font-mono text-xs uppercase font-semibold text-[#777587] tracking-wider px-2 mb-2">
              Diagnostic Cases ({filteredDiagnoses.length})
            </div>
            <div className="space-y-1">
              {filteredDiagnoses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigateTo('diagnosis-detail', c.id);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#f2f3ff] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={c.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=120&q=80'}
                      alt={c.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#3525cd]">
                          {c.caseNumber}
                        </span>
                        <span className="text-sm font-semibold text-[#131b2e] truncate">
                          {c.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-semibold ${
                            c.status === 'resolved'
                              ? 'bg-[#ecfdf5] text-[#059669]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] truncate mt-0.5">
                        {c.problemDescription}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#777587] group-hover:text-[#3525cd] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Saved Hardware Devices */}
          <div>
            <div className="font-mono text-xs uppercase font-semibold text-[#777587] tracking-wider px-2 mb-2">
              Hardware Lab Profiles ({filteredDevices.length})
            </div>
            <div className="space-y-1">
              {filteredDevices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setIsSearchModalOpen(false);
                    navigateTo('saved-devices');
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#f2f3ff] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {d.tag}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#131b2e] truncate">
                        {d.name}
                      </div>
                      <p className="text-xs text-[#64748b] truncate mt-0.5">
                        {d.specsSummary}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#3525cd] px-2 py-0.5 rounded bg-white border border-[#dad7ff]">
                    {d.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
