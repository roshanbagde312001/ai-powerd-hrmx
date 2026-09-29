"use client";

import React from "react";
import { Sparkles, Settings, BookOpen, Cpu } from "lucide-react";

interface NavbarProps {
  provider: "zoho" | "keka";
  onSwitchProvider: (p: "zoho" | "keka") => void;
  selectedModel: string;
  onOpenSettings: () => void;
  onOpenPolicies: () => void;
  hasNvidiaKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  provider,
  onSwitchProvider,
  selectedModel,
  onOpenSettings,
  onOpenPolicies,
  hasNvidiaKey,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-slate-900 tracking-tight text-lg">NovaHR Copilot</h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              POC v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Enterprise AI HR Assistant · Zoho People & Keka HRMS
          </p>
        </div>
      </div>

      {/* Middle: HRMS Provider Switcher */}
      <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
        <button
          onClick={() => onSwitchProvider("zoho")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            provider === "zoho"
              ? "bg-white text-orange-600 shadow-sm font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Zoho People
        </button>
        <button
          onClick={() => onSwitchProvider("keka")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            provider === "keka"
              ? "bg-white text-blue-600 shadow-sm font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Keka HRMS
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Model Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <Cpu className="w-3.5 h-3.5 text-indigo-500" />
          <span className="font-mono text-[11px] max-w-[130px] truncate" title={selectedModel}>
            {selectedModel.split("/").pop()}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              hasNvidiaKey ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
            }`}
            title={hasNvidiaKey ? "NVIDIA NIM API Active" : "Local Smart HR Dispatcher Active"}
          />
        </div>

        {/* HR Handbook Policies Drawer Button */}
        <button
          onClick={onOpenPolicies}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">HR Handbook</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors relative"
          title="LLM Settings & API Key"
        >
          <Settings className="w-4 h-4" />
          {!hasNvidiaKey && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};
