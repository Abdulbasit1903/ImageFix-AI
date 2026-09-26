import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FollowUpQuestionsPage: React.FC = () => {
  const { currentCase, updateDiagnosis, navigateTo } = useApp();

  const questions = currentCase?.followUpQuestions || [];

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.selectedAnswer) {
        initial[q.id] = q.selectedAnswer;
      }
    });
    return initial;
  });

  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSaveAndContinue = async () => {
    setIsUpdating(true);

    // Update follow up questions with selected answers
    const updatedQuestions = questions.map((q) => ({
      ...q,
      selectedAnswer: answers[q.id] || customInputs[q.id] || q.selectedAnswer,
    }));

    updateDiagnosis(currentCase.id, {
      followUpQuestions: updatedQuestions,
    });

    setTimeout(() => {
      setIsUpdating(false);
      navigateTo('troubleshooting-guide', currentCase.id);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="font-mono text-xs text-[#3525cd] uppercase tracking-wider font-semibold">
          Step 2 of 3 • Diagnostic Refinement
        </div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#131b2e] mt-1">
          Follow-up Diagnostic Questions
        </h1>
        <p className="text-xs text-[#777587] mt-1">
          To distinguish between similar failure signatures on your <strong className="text-[#131b2e]">{currentCase.detectedDevice}</strong>, please answer these targeted observations.
        </p>
      </div>

      {/* Case Context banner */}
      <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] text-[#3525cd] font-mono font-bold text-xs flex items-center justify-center shrink-0">
            AI
          </div>
          <div>
            <div className="font-semibold text-xs text-[#131b2e]">
              Currently diagnosing: {currentCase.detectedDevice}
            </div>
            <div className="text-[11px] text-[#777587] truncate max-w-md">
              "{currentCase.problemDescription}"
            </div>
          </div>
        </div>
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#f2f3ff] text-[#3525cd] font-semibold">
          {questions.length} Questions
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selected = answers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#eaedff] text-[#3525cd] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-[#131b2e]">
                    {q.question}
                  </h3>
                  {q.contextHelp && (
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      💡 {q.contextHelp}
                    </p>
                  )}
                </div>
              </div>

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-2 pl-9">
                  {q.options.map((opt, optIdx) => {
                    const isChecked = selected === opt;
                    return (
                      <button
                        type="button"
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-[#eaedff] border-[#3525cd] text-[#131b2e] font-semibold ring-2 ring-[#4f46e5]/15'
                            : 'bg-[#faf8ff] border-[#e2e8f0] text-[#464555] hover:bg-white hover:border-[#cbd5e1]'
                        }`}
                      >
                        <span>{opt}</span>
                        {isChecked && (
                          <CheckCircle2 className="w-4 h-4 text-[#3525cd] shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Optional custom notes */}
              <div className="pl-9 pt-2">
                <input
                  type="text"
                  placeholder="Or enter specific symptom note..."
                  value={customInputs[q.id] || ''}
                  onChange={(e) =>
                    setCustomInputs((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-1.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#131b2e] outline-none focus:border-[#4f46e5]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <button
          onClick={() => navigateTo('ai-analysis', currentCase.id)}
          className="px-4 py-2 text-xs font-semibold text-[#464555] hover:text-[#131b2e] hover:bg-[#f1f5f9] rounded-xl transition-colors"
        >
          ← Back to Analysis
        </button>

        <button
          onClick={handleSaveAndContinue}
          disabled={isUpdating}
          className="px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-[#4f46e5]/30 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating Plan...</span>
            </>
          ) : (
            <>
              <span>Generate Step-by-Step Guide</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
