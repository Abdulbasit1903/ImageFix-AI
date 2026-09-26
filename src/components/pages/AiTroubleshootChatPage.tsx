import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  ArrowLeft,
  Bot,
  User,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiTroubleshootChatPage: React.FC = () => {
  const { currentCase, addChatMessage, markDiagnosisResolved, navigateTo } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCase?.chatHistory]);

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

  const messages = currentCase.chatHistory || [];

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isSending) return;

    const query = userText.trim();
    setInputMessage('');
    addChatMessage(currentCase.id, {
      role: 'user',
      content: query,
    });

    setIsSending(true);

    try {
      const response = await fetch('/api/troubleshoot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: currentCase,
          messages: messages,
          userQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat service error');
      }

      const data = await response.json();
      addChatMessage(currentCase.id, {
        role: 'assistant',
        content: data.reply || 'Based on your reported symptoms, verify the power connection and cooling clearance.',
      });
    } catch (err) {
      console.error('Chat error:', err);
      addChatMessage(currentCase.id, {
        role: 'assistant',
        content: 'Recommended check: Ensure power is completely disconnected and inspect cables and cooling vents for blockages.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'What pad thicknesses should I buy for this cooler?',
    'How do I safely verify power connections?',
    'I smell burning near the inductors, what is the protocol?',
    'Fans spin at 100% with black screen. Is the core alive?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('troubleshooting-guide', currentCase.id)}
            className="p-2 text-[#464555] hover:text-[#131b2e] hover:bg-white rounded-xl border border-[#e2e8f0] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="font-mono text-xs text-[#3525cd] uppercase font-semibold">
              Live Diagnostic Session • Case #{currentCase.caseNumber}
            </div>
            <h1 className="font-display font-bold text-xl text-[#131b2e]">
              Hardware Assistant: {currentCase.detectedDevice}
            </h1>
          </div>
        </div>

        <button
          onClick={() => {
            markDiagnosisResolved(currentCase.id);
            navigateTo('diagnosis-detail', currentCase.id);
          }}
          className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark Resolved</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3 bg-[#fffbeb] rounded-xl border border-[#fde68a] flex items-center justify-between text-xs text-[#92400e]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0" />
          <span>
            <strong>Safety Notice:</strong> Disconnect AC power before opening enclosures or servicing internal components.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold text-[#b45309]">
          SAFETY COMPLIANT
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-4 sm:p-6 min-h-[480px] max-h-[580px] flex flex-col justify-between overflow-hidden">
        {/* Scrollable message feed */}
        <div className="overflow-y-auto space-y-4 pr-1 mb-4 flex-1">
          {/* Welcome message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-[#f2f3ff] border border-[#dad7ff] rounded-2xl rounded-tl-xs p-3.5 max-w-xl text-xs text-[#131b2e] leading-relaxed">
              <div className="font-mono text-[10px] font-bold text-[#3525cd] uppercase mb-1">
                ImageFix AI Assistant
              </div>
              I have analyzed the uploaded image and problem description for your <strong>{currentCase.detectedDevice}</strong>. Ask me anything about recommended checks, safety precautions, or next troubleshooting steps.
            </div>
          </div>

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                    isUser ? 'bg-[#131b2e]' : 'bg-[#4f46e5]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-3.5 max-w-xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#131b2e] text-white rounded-tr-xs'
                      : 'bg-[#faf8ff] border border-[#e2e8f0] text-[#131b2e] rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase ${
                        isUser ? 'text-[#dad7ff]' : 'text-[#3525cd]'
                      }`}
                    >
                      {isUser ? 'User' : 'ImageFix AI'}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-[#f2f3ff] rounded-2xl rounded-tl-xs p-3.5 text-xs text-[#3525cd] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono text-[11px]">Analyzing hardware specs & formulating safe bench procedure...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="pt-2 border-t border-[#f1f5f9] space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#777587]">
            <Zap className="w-3 h-3 text-[#f59e0b]" />
            <span>Quick Bench Queries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg bg-[#faf8ff] hover:bg-[#eaedff] border border-[#e2e8f0] hover:border-[#3525cd] text-[11px] text-[#464555] hover:text-[#3525cd] transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask ImageFix AI about test points, pad thickness, error codes, or safety..."
              className="flex-1 px-4 py-2.5 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl outline-none focus:border-[#4f46e5] text-[#131b2e]"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
