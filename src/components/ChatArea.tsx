"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Sparkles,
  Bot,
  Wrench,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { EmployeeProfile } from "./EmployeeSidebar";

export interface ToolTrace {
  tool: string;
  args: Record<string, unknown>;
  result_summary: string;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolTraces?: ToolTrace[];
  modelUsed?: string;
  timestamp: string;
}

interface ChatAreaProps {
  messages: ChatMessageItem[];
  currentEmployee: EmployeeProfile | null;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  provider: "zoho" | "keka";
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  currentEmployee,
  onSendMessage,
  isLoading,
  provider,
}) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTraces, setExpandedTraces] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTrace = (id: string) => {
    setExpandedTraces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const suggestionChips = [
    { label: "🌴 Leave Balances", prompt: "What is my casual, sick, and earned leave balance?" },
    { label: "🏥 Health Insurance", prompt: "Explain our corporate health insurance policy, sum insured, and maternity limits" },
    { label: "📝 Apply for Leave", prompt: "Apply for 1 day casual leave for next Monday with reason 'Personal work'" },
    { label: "🏡 WFH Allowance", prompt: "What is our home office equipment reimbursement policy and monthly internet allowance?" },
    { label: "⏱️ Attendance & Missing Punch", prompt: "Show my attendance for this month and any missing swipes" },
    { label: "📅 November Holidays", prompt: "List all upcoming company holidays for 2026" },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto pt-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 text-white shadow-xl shadow-emerald-500/20 mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Welcome back, {currentEmployee?.name || "Colleague"}!
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              I am your AI HR Copilot connected to{" "}
              <span className="font-semibold text-slate-700">
                {provider === "zoho" ? "Zoho People" : "Keka HRMS"}
              </span>
              . Ask me anything about leaves, attendance regularizations, payslips, or corporate HR policies.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="mt-8 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
                Frequently Asked HR Questions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(chip.prompt)}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all text-left group"
                  >
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
                      {chip.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {chip.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Assistant Avatar */}
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Tool Call Badges */}
                  {msg.toolTraces && msg.toolTraces.length > 0 && (
                    <div className="mb-2 w-full">
                      {msg.toolTraces.map((trace, tIdx) => {
                        const traceKey = `${msg.id}-${tIdx}`;
                        const isExp = expandedTraces[traceKey];
                        return (
                          <div
                            key={tIdx}
                            className="bg-emerald-50/80 border border-emerald-200/90 rounded-lg text-[11px] overflow-hidden mb-1.5 transition-all"
                          >
                            <button
                              onClick={() => toggleTrace(traceKey)}
                              className="w-full flex items-center justify-between px-2.5 py-1 text-emerald-800 font-medium hover:bg-emerald-100/50"
                            >
                              <div className="flex items-center gap-1.5">
                                <Wrench className="w-3 h-3 text-emerald-600" />
                                <span className="font-mono">
                                  {trace.tool} ({provider.toUpperCase()} API)
                                </span>
                              </div>
                              {isExp ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            </button>
                            {isExp && (
                              <div className="px-2.5 py-1.5 border-t border-emerald-200/60 bg-white/70 font-mono text-[10px] text-slate-700">
                                <div><strong className="text-emerald-700">Args:</strong> {JSON.stringify(trace.args)}</div>
                                <div className="mt-0.5"><strong className="text-emerald-700">Result:</strong> {trace.result_summary}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm shadow-sm relative group ${
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white border border-slate-200/80 text-slate-800 rounded-bl-none prose-hrms"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => copyText(msg.id, msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-opacity"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Meta footer: Model & timestamp */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-slate-500">
                          {msg.modelUsed.split("/").pop()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <img
                    src={currentEmployee?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                    alt="User"
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 mt-1 shrink-0"
                  />
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Querying {provider.toUpperCase()} data & running reasoning...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Ask NovaHR anything as ${currentEmployee?.name || "employee"}...`}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Press Enter to send · Shift+Enter for new line</span>
          <span>Source: {provider === "zoho" ? "Zoho People API" : "Keka HR API"}</span>
        </div>
      </div>
    </div>
  );
};
