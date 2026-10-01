"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Sliders
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from "recharts";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"1d" | "1w" | "1m" | "6m" | "1y">("1w");
  const [activeSegment, setActiveSegment] = useState<string>("Gold / Critical");

  // Telemetry metric cards inspired by reference images (gold/dark minimalist widgets & purple gradient charts)
  const keyMetrics = [
    {
      title: "Completed Telemetry Signals",
      value: "18,311,925",
      change: "+14.2%",
      isPositive: true,
      subtext: "Ingested via Wazuh & NetFlow",
      tag: "Au / Active",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40"
    },
    {
      title: "Active Attack Campaign",
      value: "93.62%",
      change: "-2.4%",
      isPositive: false,
      subtext: "Incident Correlation Confidence",
      tag: "CRITICAL",
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/40"
    },
    {
      title: "Data Exfiltration Volume",
      value: "1.45 GB",
      change: "+20.66%",
      isPositive: true,
      subtext: "FIN-DB-01 -> 198.51.100.77",
      tag: "Exfil Target",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40"
    },
    {
      title: "Mean Time To Detect (MTTD)",
      value: "3m 42s",
      change: "-35.0%",
      isPositive: true,
      subtext: "Automated Correlation Speed",
      tag: "Optimal",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
    }
  ];

  // Animated Area Chart Data for Ingestion Telemetry Trends
  const areaData = [
    { time: "Mon", events: 1200000, alerts: 1400, riskScore: 45 },
    { time: "Tue", events: 1900000, alerts: 2100, riskScore: 52 },
    { time: "Wed", events: 1500000, alerts: 1800, riskScore: 48 },
    { time: "Thu", events: 3400000, alerts: 4900, riskScore: 91 },
    { time: "Fri", events: 2800000, alerts: 3200, riskScore: 78 },
    { time: "Sat", events: 2100000, alerts: 2400, riskScore: 64 },
    { time: "Sun", events: 1831192, alerts: 1950, riskScore: 58 },
  ];

  // Pie chart data for MITRE Tactic Distribution
  const pieData = [
    { name: "Credential Access", value: 25, color: "#F59E0B" },
    { name: "Privilege Escalation", value: 30, color: "#EF4444" },
    { name: "Collection", value: 25, color: "#8B5CF6" },
    { name: "Exfiltration", value: 20, color: "#3B82F6" },
  ];

  // Bar chart data for Asset Risk Exposure
  const assetData = [
    { name: "FIN-DB-01", score: 95 },
    { name: "DC-01", score: 92 },
    { name: "AUTH-SRV-01", score: 85 },
    { name: "WEB-GATEWAY", score: 45 },
    { name: "HR-APP-02", score: 32 },
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Statistical Telemetry & Performance Analytics"
        subtitle="High-density visual telemetry dashboard inspired by gold/dark minimalist widgets & purple gradient analytics"
      />

      {/* Time Range Selector Rail */}
      <div className="flex items-center justify-between glass-card p-3 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 pl-2">
            <BarChart2 className="w-4 h-4 text-amber-400" /> Statistical Sampling Period:
          </span>
          {(["1d", "1w", "1m", "6m", "1y"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
                timeRange === range
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Live Ingestion: <strong className="text-white font-mono">2.4k events/sec</strong></span>
        </div>
      </div>

      {/* Top Hero Cards Grid (Minimalist Dark Gold & Contrast Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((m, idx) => (
          <div key={idx} className="glass-card p-5 border border-slate-800/80 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${m.badgeColor}`}>
                {m.tag}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold font-mono">
                {m.isPositive ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> {m.change}
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> {m.change}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">{m.title}</span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-mono">{m.value}</h2>
              <p className="text-[10px] text-slate-500 font-medium">{m.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytical Section: Large Purple Gradient Area Chart & Dark Gold Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Large Visual Chart (Purple Glass Theme from reference image) */}
        <div className="col-span-1 lg:col-span-8 glass-card p-6 border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-purple-950/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Completed Telemetry Signals & Threat Progression
              </h3>
              <p className="text-xs text-slate-400">18,311,925 Total Analyzed Records (Weekly Aggregation)</p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> Ingested Events</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> Risk Score Spike</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "12px", fontSize: "12px", color: "#F8FAFC" }} />
                <Area type="monotone" dataKey="events" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                <Area type="monotone" dataKey="riskScore" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Minimalist Dark Gold Active Targets & Alert Panel */}
        <div className="col-span-4 glass-card p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" /> Target Asset Telemetry
              </h3>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Au / Active
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">FIN-DB-01</span>
                  <span className="text-amber-400 font-bold">$2,800.00 / Valuation</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Current Exposure: <strong>Critical (95/100)</strong></span>
                  <span className="text-red-400 font-bold">+20.66% Exfil</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">Silver / DC-01</span>
                  <span className="text-slate-300 font-bold">$32.83 / Target Index</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Domain Privileges: <strong>Domain Admin</strong></span>
                  <span className="text-amber-400 font-bold">+1.30% Escalation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Total Monitored Target Value</span>
            <h4 className="text-xl font-bold font-mono text-white">$1,140.11 / Target Weight</h4>
          </div>
        </div>
      </div>

      {/* Lower Row: MITRE Distribution & Asset Risk Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MITRE Tactic Distribution Pie */}
        <div className="col-span-1 lg:col-span-5 glass-card p-6 border border-slate-800">
          <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" />
            MITRE ATT&CK Tactic Distribution (%)
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-800 text-[11px]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-300 truncate">{p.name}: <strong>{p.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Risk Score Bar Chart */}
        <div className="col-span-1 lg:col-span-7 glass-card p-6 border border-slate-800">
          <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            Asset Criticality & Risk Score Ranking
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetData} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? "#EF4444" : entry.score > 50 ? "#F59E0B" : "#3B82F6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
