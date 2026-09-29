"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Briefcase,
  MapPin,
  ChevronDown,
  Building,
  AlertCircle
} from "lucide-react";

export interface EmployeeProfile {
  id: string;
  zoho_id: string;
  keka_id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  team: string;
  role: string;
  location: string;
  reporting_manager_name: string;
  date_of_joining: string;
  employment_type: string;
  work_mode: string;
  avatar: string;
}

export interface LeaveBalances {
  fiscal_year: string;
  leave_types: {
    earned_leave?: { balance: number; total_credited: number; used: number };
    casual_leave?: { balance: number; total_credited: number; used: number; pending_approval?: number };
    sick_leave?: { balance: number; total_credited: number; used: number };
    compensatory_off?: { balance: number };
  };
}

export interface AttendanceData {
  current_month: string;
  metrics: {
    total_working_days: number;
    days_present: number;
    days_wfh: number;
    days_in_office: number;
    missing_punches: number;
    attendance_percentage: string;
    avg_work_hours: string;
  };
  recent_logs?: Array<{
    date: string;
    day: string;
    status: string;
    first_in: string;
    last_out: string;
    total_hours: string;
  }>;
}

interface EmployeeSidebarProps {
  employees: EmployeeProfile[];
  currentEmployee: EmployeeProfile | null;
  onSelectEmployee: (emp: EmployeeProfile) => void;
  leaveBalances: LeaveBalances | null;
  attendanceData: AttendanceData | null;
  provider: "zoho" | "keka";
  onSendPreset: (prompt: string) => void;
}

export const EmployeeSidebar: React.FC<EmployeeSidebarProps> = ({
  employees,
  currentEmployee,
  onSelectEmployee,
  leaveBalances,
  attendanceData,
  provider,
  onSendPreset,
}) => {
  if (!currentEmployee) return null;

  const lt = leaveBalances?.leave_types;
  const metrics = attendanceData?.metrics;

  return (
    <aside className="w-80 border-r border-slate-200 bg-white flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Persona Switcher Dropdown */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Active Employee Persona
        </label>
        <div className="relative">
          <select
            value={currentEmployee.id}
            onChange={(e) => {
              const found = employees.find((emp) => emp.id === e.target.value);
              if (found) onSelectEmployee(found);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 pr-8"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.designation})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={currentEmployee.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt={currentEmployee.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-slate-900 text-sm truncate">
              {currentEmployee.name}
            </h2>
            <p className="text-xs text-slate-500 truncate">{currentEmployee.designation}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                provider === "zoho"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {provider === "zoho" ? currentEmployee.zoho_id : currentEmployee.keka_id}
              </span>
              <span className="text-[10px] text-slate-400">· {currentEmployee.department}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Manager:
            </span>
            <span className="font-medium text-slate-700 truncate max-w-[130px]">
              {currentEmployee.reporting_manager_name || "Anita Rao"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location:
            </span>
            <span className="font-medium text-slate-700">{currentEmployee.location.split(",")[0]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Building className="w-3 h-3" /> Mode:
            </span>
            <span className="font-medium text-slate-700">{currentEmployee.work_mode.split("(")[0]}</span>
          </div>
        </div>
      </div>

      {/* Real-time Leave Balance Cards */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Live Leave Balances
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">FY 2026</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Earned Leave */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Earned (EL)</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                {lt?.earned_leave?.balance ?? 14}d
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Used: {lt?.earned_leave?.used ?? 4}</span>
              <span>Total: {lt?.earned_leave?.total_credited ?? 18}</span>
            </div>
          </div>

          {/* Casual Leave */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Casual (CL)</span>
              <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded">
                {lt?.casual_leave?.balance ?? 8}d
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Used: {lt?.casual_leave?.used ?? 3}</span>
              <span>Pending: {lt?.casual_leave?.pending_approval ?? 0}</span>
            </div>
          </div>

          {/* Sick Leave */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Sick (SL)</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                {lt?.sick_leave?.balance ?? 8}d
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
              <span>Used: {lt?.sick_leave?.used ?? 2}</span>
              <span>Total: 10</span>
            </div>
          </div>

          {/* Comp Off */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-600">Comp-Off</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                {lt?.compensatory_off?.balance ?? 1}d
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              <span>Valid for 60d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance & Biometric Status */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Attendance (Sep 2026)
          </h3>
          <span className="text-[11px] font-bold text-emerald-600">
            {metrics?.attendance_percentage ?? "95.4%"}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Days Present / Working</span>
            <span className="font-semibold text-slate-800">
              {metrics?.days_present ?? 19} / {metrics?.total_working_days ?? 22}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Office vs WFH</span>
            <span className="text-slate-700 font-medium">
              {metrics?.days_in_office ?? 11} Office · {metrics?.days_wfh ?? 8} WFH
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Average Hours</span>
            <span className="font-semibold text-indigo-600">
              {metrics?.avg_work_hours ?? "8h 42m"} / day
            </span>
          </div>
          {(metrics?.missing_punches ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>1 missing swipe requires regularization</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-4 flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          HRMS Quick Prompts
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => onSendPreset("What is my current casual and earned leave balance?")}
            className="w-full text-left text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all font-medium"
          >
            🌴 Check my leave balances
          </button>
          <button
            onClick={() => onSendPreset("Apply for casual leave for next Monday with reason 'Personal work'")}
            className="w-full text-left text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all font-medium"
          >
            📝 Apply for leave
          </button>
          <button
            onClick={() => onSendPreset("Explain our corporate health insurance coverage, maternity benefit, and cashless claim procedure")}
            className="w-full text-left text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all font-medium"
          >
            🏥 Health insurance & maternity
          </button>
          <button
            onClick={() => onSendPreset("Show my attendance swipe records and any missing punches")}
            className="w-full text-left text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all font-medium"
          >
            ⏱️ Check attendance & swipes
          </button>
          <button
            onClick={() => onSendPreset("What is the home ergonomics allowance and internet subsidy under WFH policy?")}
            className="w-full text-left text-xs text-slate-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 p-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all font-medium"
          >
            🏡 WFH & equipment allowance
          </button>
        </div>
      </div>
    </aside>
  );
};
