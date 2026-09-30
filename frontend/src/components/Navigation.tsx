"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3,
  ShieldAlert, 
  Flame, 
  Crosshair, 
  Activity, 
  Grid, 
  FileCheck2, 
  FileText, 
  Bot, 
  Settings,
  ShieldCheck
} from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Alerts", href: "/alerts", icon: ShieldAlert },
    { name: "Incidents", href: "/incidents", icon: Flame },
    { name: "Investigation", href: "/incidents/INC-2026-0042", icon: Crosshair },
    { name: "Risk Assessment", href: "/risk", icon: Activity },
    { name: "MITRE ATT&CK", href: "/mitre", icon: Grid },
    { name: "GRC / ISO / NIST", href: "/grc", icon: FileCheck2 },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "AI Assistant", href: "/ai", icon: Bot },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 glass-panel rounded-3xl p-4 flex flex-col justify-between z-50 border border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-3 mb-6 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
              THREAT2RISK <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Risk Intelligence Platform</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-xs text-white">
            SA
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">Bee Analyst</p>
            <p className="text-[10px] text-slate-400 truncate">SOC Lead Analyst</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
