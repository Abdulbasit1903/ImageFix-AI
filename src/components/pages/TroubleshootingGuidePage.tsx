import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Check,
  RotateCcw,
  Wrench,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TroubleshootingGuidePage: React.FC = () => {
  const { currentCase, toggleStepStatus, markDiagnosisResolved, navigateTo } = useApp();

  if (!currentCase) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-[#777587]">No active case found.</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-xs font-semibold"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const steps = currentCase.troubleshootingSteps || [];
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const isAllCompleted = completedCount === steps.length;
  const isCaseResolved = currentCase.status === 'resolved';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase font-semibold">
            <span className="text-[#3525cd]">Case #{currentCase.caseNumber}</span>
            <span>•</span>
            <span className={isCaseResolved ? 'text-[#059669]' : 'text-[#ba1a1a]'}>
              {isCaseResolved ? 'Resolved Case' : 'Active In Progress'}
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1">
            Troubleshooting Guide
          </h1>
          <p className="text-xs text-[#777587] mt-0.5">
            Sequential bench execution guide for <strong className="text-[#131b2e]">{currentCase.detectedDevice}</strong>.
          </p>
        </div>

        {/* Action button to mark entire diagnosis resolved or continue */}
        <div className="flex items-center gap-2">
          {isCaseResolved ? (
            <div className="px-4 py-2 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Problem Solved</span>
            </div>
          ) : (
            <button
              onClick={() => markDiagnosisResolved(currentCase.id)}
              className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Problem Solved</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('troubleshoot-chat', currentCase.id)}
            className="px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Continue Troubleshooting</span>
          </button>
        </div>
      </div>

      {/* Progress Card matching Stitch Step Execution Audit */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-base text-[#131b2e]">
            <Wrench className="w-4 h-4 text-[#4f46e5]" />
            <span>Step Execution Audit</span>
            <span className="font-mono text-xs text-[#3525cd] bg-[#eaedff] px-2 py-0.5 rounded">
              {completedCount} of {steps.length} Complete
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            Indicate whether each step passed and whether it solved the underlying hardware fault.
          </p>
        </div>

        <div className="w-full sm:w-48 space-y-1.5">
          <div className="flex justify-between font-mono text-[10px] text-[#777587]">
            <span>VERIFICATION PROGRESS</span>
            <span>{Math.round((completedCount / (steps.length || 1)) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4f46e5] rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / (steps.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Safety Callout Box */}
      {currentCase.safetyWarning?.hasCriticalHazard && (
        <div className="p-4 rounded-xl bg-[#fffbeb] border-l-4 border-[#f59e0b] text-xs text-[#92400e] flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#78350f]">Safety Protocol Enforcement: </span>
            {currentCase.safetyWarning.warningMessage}
          </div>
        </div>
      )}

      {/* Step by Step Execution Cards */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isSolved = step.solvedTheProblem;

          return (
            <div
              key={step.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                isSolved
                  ? 'bg-[#ecfdf5]/40 border-[#a7f3d0] shadow-xs ring-2 ring-[#10b981]/20'
                  : isDone
                  ? 'bg-white border-[#e2e8f0] shadow-xs'
                  : 'bg-[#faf8ff] border-[#e2e8f0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Status Toggle Checkbox */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleStepStatus(
                        currentCase.id,
                        step.id,
                        isDone ? 'pending' : 'completed',
                        isDone ? false : step.solvedTheProblem
                      )
                    }
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-[#10b981] border-[#10b981] text-white shadow-xs'
                        : 'bg-white border-[#c7c4d8] text-transparent hover:border-[#4f46e5]'
                    }`}
                    title={isDone ? 'Mark as incomplete' : 'Mark step as verified'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-bold text-base text-[#131b2e]">
                        Step {step.stepNumber}: {step.title}
                      </span>

                      {/* Safety Level Badge */}
                      <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f1f5f9] text-[#464555] border border-[#e2e8f0]">
                        {step.safetyLevel}
                      </span>

                      {/* Solved Flag */}
                      {isSolved && (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] uppercase">
                          ✓ Solved Issue
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#464555] leading-relaxed">
                      {step.description}
                    </p>

                    {step.specs && (
                      <div className="font-mono text-[11px] text-[#3525cd] bg-[#eaedff] px-2.5 py-1 rounded-md w-fit mt-2">
                        {step.specs}
                      </div>
                    )}

                    {step.resolvedStatusNote && isDone && (
                      <div className="text-[11px] text-[#059669] font-mono mt-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Audit Note: {step.resolvedStatusNote}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Resolution Controls */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  <span className="text-[11px] text-[#777587] font-medium hidden sm:inline">
                    Did this step solve the problem?
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        toggleStepStatus(currentCase.id, step.id, 'completed', true)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer flex items-center gap-1 ${
                        isSolved
                          ? 'bg-[#10b981] text-white shadow-xs'
                          : 'bg-white border border-[#e2e8f0] text-[#059669] hover:bg-[#ecfdf5]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Yes, Solved</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleStepStatus(currentCase.id, step.id, 'completed', false)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        isDone && !isSolved
                          ? 'bg-[#f1f5f9] text-[#464555] border border-[#cbd5e1]'
                          : 'bg-white border border-[#e2e8f0] text-[#777587] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <span>No, Still Faulty</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unresolved Escalation Banner (Requirements 12 & 13) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#eaedff] to-[#f2f3ff] border border-[#dad7ff] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-[#3525cd]" />
            <h3 className="font-display font-bold text-base text-[#131b2e]">
              Did these steps solve the problem?
            </h3>
          </div>
          <p className="text-xs text-[#464555] max-w-lg">
            If your device is working normally, mark it as resolved. If the issue persists, continue into the ImageFix AI troubleshooting chat for further guidance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isCaseResolved && (
            <button
              onClick={() => markDiagnosisResolved(currentCase.id)}
              className="px-5 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Problem Solved</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('troubleshoot-chat', currentCase.id)}
            className="px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/30 cursor-pointer transition-transform hover:scale-105"
          >
            <span>Continue Troubleshooting</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
