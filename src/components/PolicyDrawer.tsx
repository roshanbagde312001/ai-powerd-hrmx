"use client";

import React from "react";
import { X, BookOpen, HeartPulse, Laptop, Compass, Scale, ChevronRight } from "lucide-react";

interface PolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAboutPolicy: (prompt: string) => void;
}

export const PolicyDrawer: React.FC<PolicyDrawerProps> = ({
  isOpen,
  onClose,
  onAskAboutPolicy,
}) => {
  if (!isOpen) return null;

  const policies = [
    {
      title: "Leave & Attendance Policy",
      icon: Compass,
      desc: "Accrual rate of 1.5 days/mo, 15 days EL carry-forward, sandwich rule, and mandatory medical certificate after 2 sick days.",
      prompt: "What are the rules regarding Earned Leave carry forward and sick leave medical certificates?"
    },
    {
      title: "Group Health Insurance & GMC",
      icon: HeartPulse,
      desc: "₹5 Lakhs base family floater, Day 1 pre-existing condition cover, ₹85,000 maternity C-section, cashless across 8,500+ network hospitals.",
      prompt: "Explain our Group Medical Cover, room rent limits, and how to get cashless hospital admission."
    },
    {
      title: "Hybrid Work & WFH Policy",
      icon: Laptop,
      desc: "3 days office, 2 days remote. ₹25,000 one-time home ergonomics allowance and ₹1,500 monthly broadband reimbursement.",
      prompt: "What is the procedure and limit for claiming home ergonomics equipment and internet reimbursement?"
    },
    {
      title: "Travel & Expense Policy",
      icon: Compass,
      desc: "Tier-1 city hotel cap ₹5,500/night, daily per diem ₹1,800, personal vehicle mileage rate (₹10/km for car, ₹5/km for bike).",
      prompt: "What are the travel hotel accommodation limits and per diem rates for Bangalore and Mumbai?"
    },
    {
      title: "POSH & Workplace Safety",
      icon: Scale,
      desc: "Zero tolerance against harassment, Internal Complaints Committee (ICC) headed by Priya Nair, 90-day resolution timeline.",
      prompt: "What is the POSH complaint filing process and who is on the Internal Complaints Committee?"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Corporate HR Handbook</h3>
              <p className="text-[11px] text-slate-400">Indexed & Searchable via AI RAG Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policies List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          <p className="text-xs text-slate-500">
            Click on any policy document to immediately prompt the NovaHR Copilot for a detailed breakdown:
          </p>

          {policies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  onAskAboutPolicy(p.prompt);
                  onClose();
                }}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-emerald-700 shadow-sm shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-emerald-800">
                        {p.title}
                      </h4>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 text-center">
          NovaCorp Enterprise HR Policies · Last Revised September 2026
        </div>
      </div>
    </div>
  );
};
