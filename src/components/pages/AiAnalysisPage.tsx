import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Eye,
  Check,
  Search,
  Cpu,
  Layers,
  HelpCircle,
  Wrench,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiAnalysisPage: React.FC = () => {
  const { currentCase, navigateTo } = useApp();

  if (!currentCase) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#777587]">No active diagnosis found.</p>
        <button
          onClick={() => navigateTo('new-diagnosis')}
          className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-xs font-semibold"
        >
          Start New Diagnosis
        </button>
      </div>
    );
  }

  const hasFollowUps = currentCase.followUpQuestions && currentCase.followUpQuestions.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#3525cd] uppercase font-semibold">
            <span>Case #{currentCase.caseNumber}</span>
            <span>•</span>
            <span className="text-[#059669] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              Visual Diagnosis Complete
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1">
            AI Diagnosis Results
          </h1>
          <p className="text-xs text-[#777587] mt-0.5">
            Gemini multimodal analysis combining uploaded device photo with reported symptoms.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          {hasFollowUps ? (
            <button
              onClick={() => navigateTo('followup-questions', currentCase.id)}
              className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/25 transition-all cursor-pointer"
            >
              <span>Answer Follow-up Questions ({currentCase.followUpQuestions.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigateTo('troubleshooting-guide', currentCase.id)}
              className="px-5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/25 transition-all cursor-pointer"
            >
              <span>View Troubleshooting Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prominent Safety Warning Banner (Mandatory safety requirement) */}
      {currentCase.safetyWarning && currentCase.safetyWarning.hasCriticalHazard && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#fffbeb] border-l-4 border-[#f59e0b] shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fde68a] text-[#b45309] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#b45309] px-2 py-0.5 rounded bg-[#fef3c7]">
                  Safety Warning • {currentCase.safetyWarning.hazardType.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-[#78350f] mt-1">
                {currentCase.safetyWarning.warningTitle}
              </h3>
              <p className="text-xs text-[#92400e] mt-1 leading-relaxed">
                {currentCase.safetyWarning.warningMessage}
              </p>
            </div>
          </div>

          {currentCase.safetyWarning.protocolNotes && currentCase.safetyWarning.protocolNotes.length > 0 && (
            <div className="pt-2 border-t border-[#fde68a] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#78350f]">
              {currentCase.safetyWarning.protocolNotes.map((note, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                  <span className="truncate">{note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detected Device & Visual Inspection Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Visual Inspection Image */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#3525cd] font-bold">DEVICE PHOTO INSPECTION</span>
            <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold text-[10px]">
              Visual Analysis Feed
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-[#c7c4d8] aspect-4/3 bg-black flex items-center justify-center">
            <img
              src={currentCase.imageUrl || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'}
              alt={currentCase.detectedDevice}
              className="w-full h-full object-cover"
            />

            {/* Overlaid bounding box badges if present */}
            {currentCase.opticalTelemetry?.visualBoundingBoxLabels?.map((box, i) => (
              <div
                key={i}
                className={`absolute border-2 rounded p-1 text-[10px] font-mono text-white ${
                  i === 0
                    ? 'top-[22%] left-[26%] w-[42%] h-[42%] border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'bottom-[18%] right-[14%] border-[#f59e0b] bg-[#f59e0b]/20'
                }`}
              >
                <div className="bg-black/80 px-1 py-0.5 rounded w-fit text-[9px] font-bold truncate">
                  {box.label}
                </div>
              </div>
            ))}

            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              <span>Visual Inspection Analyzed</span>
            </div>
          </div>

          <div className="text-[11px] text-[#464555] leading-relaxed">
            {currentCase.opticalTelemetry?.ambientConditionNotes || 'Visual characteristics captured from user upload.'}
          </div>
        </div>

        {/* Detected Device Overview & Specs */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#3525cd] font-mono text-[11px] font-semibold uppercase">
                {currentCase.deviceSubtype || currentCase.category}
              </span>

              {/* Confidence Badge */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#777587]">Confidence:</span>
                <span className="px-2.5 py-1 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] font-mono font-bold text-xs">
                  {currentCase.confidence}% High Confidence
                </span>
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl text-[#131b2e] mt-2">
              {currentCase.detectedDevice}
            </h2>

            {/* Hardware Specs grid */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {currentCase.hardwareSpecs?.map((spec, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#faf8ff] border border-[#e2e8f0]">
                  <span className="text-[10px] font-mono text-[#777587] block uppercase">{spec.label}</span>
                  <span className="text-xs font-semibold text-[#131b2e] font-mono truncate block mt-0.5">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Summary Box */}
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-1">
            <div className="font-mono text-[10px] uppercase font-bold text-[#777587]">
              Reported Failure Behavior
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              "{currentCase.problemDescription}"
            </p>
          </div>
        </div>
      </div>

      {/* Visual Observations (Explicit requirement) */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#3525cd]" />
            <h3 className="font-display font-bold text-lg text-[#131b2e]">
              Visual Observations
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#777587]">
            What can reasonably be observed from the image
          </span>
        </div>

        <div className="space-y-2">
          {currentCase.visualObservations?.map((obs, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e8f0] text-xs text-[#334155] flex items-start gap-2.5 leading-relaxed"
            >
              <div className="w-2 h-2 rounded-full bg-[#3525cd] shrink-0 mt-1.5"></div>
              <span>{obs}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Possible Causes Ranked as High, Medium, Low (Explicit requirement) */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3525cd]" />
            <h3 className="font-display font-bold text-lg text-[#131b2e]">
              Possible Causes (Ranked by Likelihood)
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#777587]">
            Potential explanations based on the image and description
          </span>
        </div>

        <div className="space-y-3">
          {currentCase.possibleCauses?.map((cause, idx) => {
            const isHigh = cause.likelihood === 'High';
            const isMedium = cause.likelihood === 'Medium';

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isHigh
                    ? 'bg-[#eaedff]/40 border-[#c7c4d8] shadow-xs'
                    : isMedium
                    ? 'bg-white border-[#e2e8f0]'
                    : 'bg-[#faf8ff] border-[#f1f5f9]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Likelihood Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider ${
                        isHigh
                          ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                          : isMedium
                          ? 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]'
                          : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'
                      }`}
                    >
                      {cause.likelihood} Likelihood
                    </span>

                    {cause.badgeText && (
                      <span className="font-mono text-[10px] text-[#3525cd] font-semibold uppercase">
                        {cause.badgeText}
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-display font-bold text-sm text-[#131b2e] mt-2">
                  Possible cause: {cause.cause}
                </div>
                <p className="text-xs text-[#464555] mt-1 leading-relaxed">
                  {cause.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Checks (Explicit requirement) */}
      {currentCase.recommendedChecks && currentCase.recommendedChecks.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              <h3 className="font-display font-bold text-lg text-[#131b2e]">
                Recommended Checks
              </h3>
            </div>
            <span className="font-mono text-[11px] text-[#777587]">
              Safe things the user can check
            </span>
          </div>

          <div className="space-y-2">
            {currentCase.recommendedChecks.map((check, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#ecfdf5]/60 border border-[#a7f3d0] text-xs text-[#065f46] flex items-start gap-2.5 leading-relaxed font-medium"
              >
                <Check className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-sm text-[#131b2e]">
            {hasFollowUps
              ? `Follow-up Questions Available (${currentCase.followUpQuestions.length})`
              : 'Troubleshooting Plan Prepared'}
          </div>
          <p className="text-xs text-[#777587]">
            {hasFollowUps
              ? 'Answering these quick questions helps Gemini isolate the exact component failure.'
              : 'Execute the verified step-by-step repair guide to solve the issue.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('new-diagnosis')}
            className="px-4 py-2.5 text-xs font-semibold text-[#464555] hover:text-[#131b2e] hover:bg-[#f1f5f9] rounded-xl transition-colors"
          >
            Re-run Scan
          </button>

          {hasFollowUps ? (
            <button
              onClick={() => navigateTo('followup-questions', currentCase.id)}
              className="px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/30 cursor-pointer"
            >
              <span>Continue to Follow-up Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigateTo('troubleshooting-guide', currentCase.id)}
              className="px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/30 cursor-pointer"
            >
              <span>View Troubleshooting Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
