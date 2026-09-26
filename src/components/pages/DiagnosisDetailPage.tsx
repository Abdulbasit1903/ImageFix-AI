import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Trash2,
  Sparkles,
  Check,
  RotateCcw,
  Zap,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DiagnosisDetailPage: React.FC = () => {
  const {
    currentCase,
    markDiagnosisResolved,
    deleteDiagnosis,
    toggleStepStatus,
    navigateTo,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);

  if (!currentCase) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#777587]">Diagnosis record not found.</p>
        <button
          onClick={() => navigateTo('history')}
          className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-xs font-semibold"
        >
          View History
        </button>
      </div>
    );
  }

  const steps = currentCase.troubleshootingSteps || [];
  const completedStepsCount = steps.filter((s) => s.status === 'completed').length;
  const isResolved = currentCase.status === 'resolved';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Top Bar with Back and Share matching Stitch Image 31 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('history')}
          className="p-2 text-[#464555] hover:text-[#131b2e] hover:bg-white rounded-xl border border-[#e2e8f0] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Device Detail</span>
        </button>

        <div className="flex items-center gap-2">
          {copiedLink && (
            <span className="font-mono text-[10px] text-[#059669] bg-[#ecfdf5] px-2 py-0.5 rounded">
              Link Copied!
            </span>
          )}
          <button
            onClick={handleShare}
            title="Share Case"
            className="p-2 text-[#464555] hover:text-[#131b2e] hover:bg-white rounded-xl border border-[#e2e8f0] transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Case Header Details */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-[#131b2e]">
            Case #{currentCase.caseNumber}
          </h1>

          <span
            className={`px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isResolved
                ? 'bg-[#ecfdf5] text-[#059669]'
                : 'bg-[#eaedff] text-[#3525cd]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isResolved ? 'bg-[#10b981]' : 'bg-[#3525cd] animate-pulse'
              }`}
            ></span>
            <span>{isResolved ? 'RESOLVED' : 'ACTIVE • IN PROGRESS'}</span>
          </span>
        </div>

        <p className="font-mono text-xs text-[#777587]">
          {currentCase.timestampDisplay} • v2.4 Core Engine
        </p>
      </div>

      {/* PCB Optical Telemetry Image Feed matching Stitch */}
      <div className="rounded-2xl overflow-hidden border border-[#c7c4d8] shadow-sm bg-black relative">
        <div className="aspect-16/9 sm:aspect-2/1 w-full relative">
          <img
            src={
              currentCase.imageUrl ||
              'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'
            }
            alt={currentCase.detectedDevice}
            className="w-full h-full object-cover"
          />

          {/* Visual Analysis bottom bar */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white font-mono text-[11px]">
            <span className="uppercase tracking-wider font-semibold">
              DEVICE PHOTO INSPECTION
            </span>
            <span className="px-2 py-0.5 rounded bg-[#4f46e5] text-white text-[10px] font-bold">
              Visual Analysis Feed
            </span>
          </div>
        </div>
      </div>

      {/* Device Title & Specs Box */}
      <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-[#131b2e]">
              {currentCase.detectedDevice}
            </h2>
            <div className="text-xs text-[#64748b] mt-0.5 font-mono">
              Founders Edition • GA102-200 Arch
            </div>
          </div>

          <span className="px-2.5 py-1 rounded bg-[#eaedff] text-[#3525cd] font-mono text-[11px] font-semibold uppercase shrink-0">
            {currentCase.deviceSubtype || currentCase.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {currentCase.hardwareSpecs?.map((spec, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
              <span className="text-[10px] font-mono uppercase text-[#777587] block font-semibold">
                {spec.label}
              </span>
              <span className="text-xs font-mono font-semibold text-[#131b2e] block mt-0.5 truncate">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reported Failure Behavior Box */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-2">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#3525cd]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reported Failure Behavior</span>
        </div>
        <p className="text-xs text-[#334155] leading-relaxed italic">
          "{currentCase.problemDescription}"
        </p>
        <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
            TDR Event 4101
          </span>
          <span className="px-2 py-0.5 rounded bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
            DirectX Crash D3D11
          </span>
        </div>
      </div>

      {/* AI Root Cause Card (Matches Stitch Image 31) */}
      <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#eaedff] text-[#3525cd] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#131b2e]">
                AI Root Cause
              </div>
              <div className="font-mono text-[10px] text-[#777587]">
                Multimodal AI visual classification
              </div>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] font-mono text-xs font-bold">
            94% Match HIGH CONFIDENCE
          </span>
        </div>

        {/* Primary Fault Isolated banner */}
        <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#dad7ff] space-y-2">
          <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ba1a1a] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
            <span>Primary Fault Isolated</span>
          </div>

          <h3 className="font-display font-bold text-base text-[#131b2e]">
            {currentCase.possibleCauses?.[0]?.cause ||
              'Degraded VRAM Thermal Pads causing 106°C junction runaway'}
          </h3>

          <p className="text-xs text-[#464555] leading-relaxed">
            {currentCase.possibleCauses?.[0]?.explanation ||
              'Micron GDDR6X operating envelope exceeded by +11°C. Memory throttling initiates safety trigger causing instantaneous display pipeline disconnect.'}
          </p>
        </div>

        {/* Secondary Diagnostic rail */}
        <div className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#3525cd]" />
            <div>
              <div className="text-[10px] font-mono text-[#777587] uppercase font-semibold">
                Secondary Diagnostic: 12V Transient Power
              </div>
              <div className="text-xs font-medium text-[#131b2e]">
                OSCILLOSCOPE RAIL VERIFICATION
              </div>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-[#059669] font-bold block">Nominal</span>
            <span className="text-[10px] text-[#777587]">±1.4%</span>
          </div>
        </div>
      </div>

      {/* Step Execution Audit Card (Matches Stitch Image 31) */}
      <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base text-[#131b2e]">
              Step Execution Audit
            </span>
          </div>
          <span className="font-mono text-xs text-[#3525cd] bg-[#eaedff] px-2 py-0.5 rounded font-semibold">
            {completedStepsCount} of {steps.length} Complete
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const isDone = step.status === 'completed';

            return (
              <div
                key={step.id}
                className="p-3.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleStepStatus(
                          currentCase.id,
                          step.id,
                          isDone ? 'pending' : 'completed'
                        )
                      }
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-[#10b981] border-[#10b981] text-white'
                          : 'bg-white border-[#c7c4d8]'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <div className="font-display font-bold text-xs text-[#131b2e]">
                        Step {step.stepNumber}: {step.title}
                      </div>
                      <p className="text-[11px] text-[#464555] mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase shrink-0 ${
                      isDone
                        ? 'bg-[#ecfdf5] text-[#059669]'
                        : 'bg-[#eaedff] text-[#3525cd]'
                    }`}
                  >
                    {isDone ? 'VERIFIED OK' : 'PENDING ACTION'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Transcript Log Preview matching Stitch Image 31 */}
      <div className="p-6 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#3525cd]" />
            <h3 className="font-display font-bold text-base text-[#131b2e]">
              Diagnostic Transcript
            </h3>
          </div>
          <button
            onClick={() => navigateTo('troubleshoot-chat', currentCase.id)}
            className="text-xs font-semibold text-[#3525cd] hover:underline"
          >
            View Full Log
          </button>
        </div>

        <div className="space-y-2 p-3.5 bg-[#faf8ff] rounded-xl border border-[#e2e8f0] text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#777587]">
              USER
            </span>
            <p className="text-[#131b2e]">
              "{currentCase.chatHistory?.[0]?.content ||
                'Shoots right up to 106°C within 40 seconds of launching FurMark.'}"
            </p>
          </div>

          <div className="pt-2 border-t border-[#e2e8f0] space-y-1">
            <span className="font-mono text-[10px] uppercase font-bold text-[#3525cd]">
              IMAGEFIX AI
            </span>
            <p className="text-[#334155] leading-relaxed">
              "{currentCase.chatHistory?.[1]?.content ||
                'That confirms dedicated VRAM thermal breakdown. The factory thermal putty on your RTX 3080 has dried out, isolating heat dissipation from the sub-plate.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar matching Stitch Image 31 */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e8f0] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => navigateTo('troubleshoot-chat', currentCase.id)}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <span>Continue Troubleshooting</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => markDiagnosisResolved(currentCase.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              isResolved
                ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                : 'bg-[#10b981] hover:bg-[#059669] text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isResolved ? 'Resolved' : 'Mark Resolved'}</span>
          </button>
        </div>
      </div>

      {/* Delete Diagnosis button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this diagnosis record?')) {
              deleteDiagnosis(currentCase.id);
            }
          }}
          className="text-xs text-[#ba1a1a] hover:text-[#93000a] inline-flex items-center gap-1.5 font-mono font-semibold hover:underline"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Diagnosis</span>
        </button>
      </div>
    </div>
  );
};
