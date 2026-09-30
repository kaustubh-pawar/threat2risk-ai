"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { AttackGraphCanvas } from "@/components/AttackGraphCanvas";
import { AIWidget } from "@/components/AIWidget";
import { fetchIncident, simulateWhatIf, generateReport } from "@/lib/api";
import { Incident } from "@/types";
import { 
  Flame, 
  Clock, 
  ShieldAlert, 
  Grid, 
  FileCheck2, 
  Bot, 
  FileText, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  User,
  ExternalLink,
  Download
} from "lucide-react";

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incidentId = params.id || "INC-2026-0042";
  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "graph" | "evidence" | "mitre" | "risk" | "grc" | "ai" | "reports">("overview");
  
  // What-If Simulator state
  const [mfa, setMfa] = useState(false);
  const [segmentation, setSegmentation] = useState(false);
  const [dlp, setDlp] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<any>(null);

  useEffect(() => {
    fetchIncident(incidentId).then(setIncident);
  }, [incidentId]);

  const handleSimulate = async (newMfa: boolean, newSeg: boolean, newDlp: boolean) => {
    setMfa(newMfa);
    setSegmentation(newSeg);
    setDlp(newDlp);
    const res = await simulateWhatIf(incidentId, {
      mfa_enabled: newMfa,
      network_segmented: newSeg,
      db_dlp_enforced: newDlp
    });
    if (res) setSimulatedResult(res.simulated_risk_assessment);
  };

  if (!incident) return <div className="p-8 text-slate-400">Loading Incident Command Workspace...</div>;

  const currentRisk = simulatedResult || incident.risk_assessment || { overall_score: incident.risk_score || 92, classification: incident.severity || 'CRITICAL', is_simulated: false, factors: [] };

  return (
    <div className="space-y-6">
      {/* Top Incident Banner Header */}
      <div className="glass-card p-6 border border-slate-800 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
              {incident.incident_id || incident.id}
            </span>
            <h1 className="text-lg font-bold text-white">{incident.title}</h1>
            <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold font-mono">
              {incident.severity}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> First Seen: {incident.first_seen?.substring(11, 19) || incident.first_seen}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> Last Seen: {incident.last_seen?.substring(11, 19) || incident.last_seen}</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-purple-400" /> Users: {(incident.users_involved || incident.affected_users || []).join(", ")}</span>
            <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-cyan-400" /> Hosts: {(incident.hosts_affected || incident.affected_assets || []).join(", ")}</span>
          </div>
        </div>

        {/* Explainable Risk Badge */}
        <div className="text-right p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className={`text-2xl font-extrabold ${currentRisk.overall_score >= 75 ? "text-red-400" : "text-amber-400"}`}>
            {currentRisk.overall_score} / 100
          </span>
          <p className="text-[10px] text-slate-400 font-semibold uppercase">
            {currentRisk.is_simulated ? "Simulated Risk Score" : "Actual Risk Score"}
          </p>
        </div>
      </div>

      {/* Navigation Context Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { id: "overview", label: "Overview & Timeline", icon: Flame },
          { id: "graph", label: "Attack Topology Graph", icon: Grid },
          { id: "evidence", label: "Evidence Ledger", icon: CheckCircle2 },
          { id: "mitre", label: "MITRE ATT&CK", icon: ShieldAlert },
          { id: "risk", label: "Explainable Risk & What-If", icon: Sliders },
          { id: "grc", label: "GRC & ISO/NIST", icon: FileCheck2 },
          { id: "ai", label: "Grounded AI Assistant", icon: Bot },
          { id: "reports", label: "Reports & Exports", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & TIMELINE */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 glass-card p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Chronological Attack Progression Timeline
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(incident.events || []).map((evt: any, idx: number) => (
                <div key={evt.event_id || idx} className="relative flex items-start justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className={`absolute -left-6 top-3.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                    evt.severity === "critical" ? "bg-red-500" : evt.severity === "high" ? "bg-orange-500" : "bg-amber-500"
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{evt.timestamp?.substring(11, 19) || evt.timestamp}</span>
                      <h4 className="text-xs font-bold text-white">{evt.event_type?.replace("_", " ")?.toUpperCase() || ''}</h4>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-slate-300">
                        {evt.host}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 font-mono">{evt.command || evt.raw_log}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-5 space-y-6">
            <AttackGraphCanvas graph={incident.attack_graph} />
            <AIWidget incidentId={incident.incident_id || incident.id} />
          </div>
        </div>
      )}

      {/* TAB 2: ATTACK TOPOLOGY GRAPH */}
      {activeTab === "graph" && (
        <div className="space-y-4">
          <AttackGraphCanvas graph={incident.attack_graph} />
        </div>
      )}

      {/* TAB 3: EVIDENCE LEDGER */}
      {activeTab === "evidence" && (
        <div className="glass-card p-5 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Evidence Ledger Claims
          </h3>

          <div className="space-y-3">
            {(incident.evidence_ledger || []).map((entry: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{entry.claim}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px]">
                      {(entry.evidence_ids || []).join(", ")}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{entry.reasoning}</p>
                  <p className="text-[10px] text-slate-500">Source: {entry.source} | Recorded at: {entry.timestamp}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400">{int(entry.confidence * 100)}%</span>
                  <p className="text-[9px] text-slate-500">Confidence Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MITRE ATT&CK */}
      {activeTab === "mitre" && (
        <div className="glass-card p-5 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400" /> Mapped MITRE ATT&CK Techniques
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {(incident.mitre_mappings || []).map((m: any, idx: number) => (
              <div key={m.technique_id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-400">{m.technique_id}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                    {m.tactic}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{m.technique_name}</h4>
                <p className="text-[11px] text-slate-300">{m.description}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Chain Position: #{m.position_in_chain}</span>
                  <span>Confidence: {int(m.confidence * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EXPLAINABLE RISK & WHAT-IF SIMULATOR */}
      {activeTab === "risk" && (
        <div className="grid grid-cols-12 gap-6">
          {/* Factor Breakdown */}
          <div className="col-span-7 glass-card p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Explainable Risk Factor Weights</h3>
              <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${currentRisk.overall_score >= 75 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
                Score: {currentRisk.overall_score} / 100 ({currentRisk.classification})
              </span>
            </div>

            <div className="space-y-3">
              {(currentRisk.factors || []).map((f: any) => (
                <div key={f.factor} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{f.factor} ({int(f.weight * 100)}% weight)</span>
                    <span className="font-mono text-blue-400">{f.weighted_score?.toFixed(1)} pts</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${f.score}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive What-If Controls */}
          <div className="col-span-5 glass-card p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" /> Interactive What-If Countermeasure Simulator
            </h3>
            <p className="text-[11px] text-slate-400">Toggle security controls to recalculate simulated risk posture in real-time</p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Enforce Privileged Hardware MFA</span>
                  <span className="text-[10px] text-slate-400">Mitigates credential theft impact</span>
                </div>
                <input
                  type="checkbox"
                  checked={mfa}
                  onChange={(e) => handleSimulate(e.target.checked, segmentation, dlp)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Strict Egress Micro-segmentation</span>
                  <span className="text-[10px] text-slate-400 font-normal">Blocks external C2 exfiltration</span>
                </div>
                <input
                  type="checkbox"
                  checked={segmentation}
                  onChange={(e) => handleSimulate(mfa, e.target.checked, dlp)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-white block">Database Activity DLP Inspection</span>
                  <span className="text-[10px] text-slate-400 font-normal">Prevents unencrypted dump exports</span>
                </div>
                <input
                  type="checkbox"
                  checked={dlp}
                  onChange={(e) => handleSimulate(mfa, segmentation, e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
              </label>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">Simulator Output Explanation:</span>
              <p className="text-[11px] text-slate-400 mt-1">{currentRisk.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GRC & ISO/NIST */}
      {activeTab === "grc" && (
        <div className="glass-card p-5 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" /> ISO 27001 & NIST 800-53 Control Gaps
          </h3>

          <div className="space-y-4">
            {(incident.grc_findings || []).map((g: any, idx: number) => (
              <div key={g.control_id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">{g.control_id}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                    {g.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{g.control_name} ({g.framework})</h4>
                <p className="text-[11px] text-slate-300"><strong className="text-slate-400">Business Risk:</strong> {g.business_risk}</p>
                <p className="text-[11px] text-slate-300"><strong className="text-slate-400">Recommendation:</strong> {g.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GROUNDED AI ASSISTANT */}
      {activeTab === "ai" && (
        <div className="max-w-3xl mx-auto">
          <AIWidget incidentId={incident.incident_id} />
        </div>
      )}

      {/* TAB 8: REPORTS & EXPORTS */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-3 gap-4">
          {["technical", "risk", "executive"].map((rpt) => (
            <div key={rpt} className="glass-card p-5 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white uppercase">{rpt} Report</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Generated specifically for {rpt === "technical" ? "SOC Analysts" : rpt === "risk" ? "CISO & Compliance" : "Executive Management"}
                </p>
              </div>

              <button
                onClick={async () => {
                  const res = await generateReport(rpt as any, incident.incident_id);
                  if (res) alert(`Report Generated: ${res.report_id} - ${res.title}`);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Generate & Download {rpt.toUpperCase()} PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function int(val: number) {
  return Math.round(val);
}
