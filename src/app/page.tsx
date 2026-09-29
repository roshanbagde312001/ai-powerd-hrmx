"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { EmployeeSidebar, EmployeeProfile, LeaveBalances, AttendanceData } from "@/components/EmployeeSidebar";
import { ChatArea, ChatMessageItem } from "@/components/ChatArea";
import { SettingsModal } from "@/components/SettingsModal";
import { PolicyDrawer } from "@/components/PolicyDrawer";

const API_BASE = "http://localhost:8000";

export default function Home() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeProfile | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalances | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [provider, setProvider] = useState<"zoho" | "keka">("zoho");
  
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Settings & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("meta/llama-3.1-70b-instruct");
  const [availableModels, setAvailableModels] = useState<Array<{ id: string; name: string }>>([
    { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B Instruct (Recommended)" },
    { id: "meta/llama-3.1-8b-instruct", name: "Llama 3.1 8B Instruct (Ultra Fast)" },
    { id: "nvidia/llama-3.1-nemotron-70b-instruct", name: "NVIDIA Llama 3.1 Nemotron 70B" },
    { id: "mistralai/mistral-nemo-12b-instruct", name: "Mistral NeMo 12B Instruct" },
  ]);

  // Load initial settings and employee list
  useEffect(() => {
    const savedKey = localStorage.getItem("novahr_nvidia_key") || "";
    const savedModel = localStorage.getItem("novahr_selected_model") || "meta/llama-3.1-70b-instruct";
    if (savedKey) setApiKey(savedKey);
    
    // Auto-migrate away from deprecated llama-3.3-70b-instruct
    let modelToUse = savedModel;
    if (modelToUse.includes("llama-3.3") || !modelToUse) {
      modelToUse = "meta/llama-3.1-70b-instruct";
      localStorage.setItem("novahr_selected_model", modelToUse);
    }
    setSelectedModel(modelToUse);

    fetchEmployees();
    fetchModels();
  }, []);

  // When active employee changes, load their dashboard
  useEffect(() => {
    if (currentEmployee) {
      fetchEmployeeData(currentEmployee.id);
    }
  }, [currentEmployee]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/employees`);
      const data = await res.json();
      if (data.employees && data.employees.length > 0) {
        setEmployees(data.employees);
        setCurrentEmployee(data.employees[0]);
      }
      if (data.active_provider) {
        setProvider(data.active_provider as "zoho" | "keka");
      }
    } catch (err) {
      console.error("Failed to fetch employees, using local fallback seed", err);
      // Fallback local seed if backend is booting
      const fallbackList: EmployeeProfile[] = [
        {
          id: "EMP001",
          zoho_id: "ZH-10023",
          keka_id: "KEKA-5091",
          name: "Aarav Sharma",
          email: "aarav.sharma@novacorp.com",
          designation: "Senior Full-Stack Engineer",
          department: "Engineering",
          team: "Core Platform",
          role: "Individual Contributor",
          location: "Bangalore, India",
          reporting_manager_name: "Vikram Malhotra",
          date_of_joining: "2022-03-15",
          employment_type: "Full-Time Permanent",
          work_mode: "Hybrid (3 days office, 2 days WFH)",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        },
        {
          id: "EMP002",
          zoho_id: "ZH-10045",
          keka_id: "KEKA-5112",
          name: "Sneha Patel",
          email: "sneha.patel@novacorp.com",
          designation: "Senior Product Designer",
          department: "Design",
          team: "User Experience",
          role: "Individual Contributor",
          location: "Mumbai, India",
          reporting_manager_name: "Anita Rao",
          date_of_joining: "2021-08-01",
          employment_type: "Full-Time Permanent",
          work_mode: "Hybrid (3 days office, 2 days WFH)",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        }
      ];
      setEmployees(fallbackList);
      setCurrentEmployee(fallbackList[0]);
    }
  };

  const fetchEmployeeData = async (empId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/employee/${empId}`);
      if (res.ok) {
        const data = await res.json();
        setLeaveBalances(data.leaves);
        setAttendanceData(data.attendance);
      }
    } catch (err) {
      console.error("Failed to fetch employee dashboard data", err);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/models`);
      if (res.ok) {
        const data = await res.json();
        if (data.models) setAvailableModels(data.models);
      }
    } catch (err) {
      console.error("Failed to load models list", err);
    }
  };

  const handleSwitchProvider = async (p: "zoho" | "keka") => {
    setProvider(p);
    try {
      await fetch(`${API_BASE}/api/provider`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: p }),
      });
    } catch (err) {
      console.error("Failed to switch provider on backend", err);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("novahr_nvidia_key", key);
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("novahr_selected_model", modelId);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !currentEmployee) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const payload = {
        messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        employee_id: currentEmployee.id,
        model: selectedModel,
        api_key: apiKey || undefined,
      };

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      let replyContent = data.reply;
      if (data.nvidia_error) {
        replyContent = `> ⚠️ **NVIDIA NIM Notice**: \`${data.nvidia_error}\`\n> *Seamlessly handled by NovaHR Engine fallback.*\n\n` + replyContent;
      }

      const assistantMsg: ChatMessageItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        toolTraces: data.tool_traces,
        modelUsed: data.model_used,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh employee balances in case leave was applied or status changed!
      fetchEmployeeData(currentEmployee.id);
    } catch (err: unknown) {
      console.error("Chat error", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      const errorMsg: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Connection Notice**: Unable to connect to the backend server (${errMsg}). Ensure the FastAPI server is running on port 8000.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        provider={provider}
        onSwitchProvider={handleSwitchProvider}
        selectedModel={selectedModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPolicies={() => setIsPoliciesOpen(true)}
        hasNvidiaKey={Boolean(apiKey)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Employee Context & Real-time Live Balances */}
        <EmployeeSidebar
          employees={employees}
          currentEmployee={currentEmployee}
          onSelectEmployee={(emp) => {
            setCurrentEmployee(emp);
            // Optionally clear or keep chat history
          }}
          leaveBalances={leaveBalances}
          attendanceData={attendanceData}
          provider={provider}
          onSendPreset={handleSendMessage}
        />

        {/* Center: AI Copilot Chat Interface */}
        <ChatArea
          messages={messages}
          currentEmployee={currentEmployee}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          provider={provider}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        availableModels={availableModels}
      />

      {/* Corporate Policies Handbook Drawer */}
      <PolicyDrawer
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        onAskAboutPolicy={handleSendMessage}
      />
    </div>
  );
}
