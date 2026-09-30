"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBarChart, FileText, ShieldCheck, Monitor, AlertTriangle, Loader2, CheckCircle2, Download, Filter, Shield } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { reports, demoIncident, securityEvents } from '@/data/simData';
import { generateReportPDF, type ReportTargetItem } from '@/utils/pdfGenerator';
import { severityClass, severityText } from '@/utils/severity';
import type { Severity } from '@/types';

const reportTypeConfig = {
  technical: { icon: FileText, label: 'Technical Investigation Report', color: 'text-cyber-cyan', desc: 'Incident, timeline, evidence, affected systems, techniques, findings, risk, recommendations' },
  grc: { icon: ShieldCheck, label: 'Risk / GRC Report', color: 'text-cyber-violet', desc: 'Risk, business impact, potential control areas, framework insights, recommendations' },
  executive: { icon: Monitor, label: 'Executive Report', color: 'text-risk-high', desc: 'What happened, how serious, what is affected, business impact, what to do' },
  threat: { icon: AlertTriangle, label: 'Threat Report', color: 'text-risk-critical', desc: 'Incident summary, evidence, affected systems, timeline, risk, techniques, actions' },
};

export function Reports() {
  const { audio } = useApp();
  const [selectedId, setSelectedId] = useState<string>(demoIncident.id);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());

  // Available options combining full demo incident & security events
  const options: ReportTargetItem[] = [
    {
      id: demoIncident.id,
      name: demoIncident.title,
      event_type: 'Correlated Security Incident',
      severity: demoIncident.severity,
      user: 'admin01',
      asset: 'AUTH-SRV-01 / FIN-DB-01',
      source_ip: '10.10.10.5',
      timestamp: '10 Aug 2026, 10:01 UTC',
      raw_log: 'Compromised admin account used to access and exfiltrate customer financial database records.',
    },
    ...securityEvents.map((evt) => ({
      id: evt.id,
      name: evt.event_type.replace(/_/g, ' ').toUpperCase(),
      event_type: evt.event_type,
      severity: evt.severity,
      user: evt.user,
      asset: evt.asset || evt.host || 'WORKSTATION-01',
      source_ip: evt.source_ip,
      timestamp: evt.timestamp,
      raw_log: evt.raw_log,
    })),
  ];

  const selectedItem = options.find((opt) => opt.id === selectedId) || options[0];

  const handleGenerate = (reportId: string, type: 'technical' | 'grc' | 'executive' | 'threat') => {
    audio.play('click');
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => new Set(prev).add(reportId));
      audio.play('reportGenerate');
      generateReportPDF(type, selectedItem);
    }, 2500);
  };

  const handleDownload = (type: 'technical' | 'grc' | 'executive' | 'threat') => {
    audio.play('click');
    generateReportPDF(type, selectedItem);
  };

  return (
    <div>
      <PageHeader
        title="Report Center"
        subtitle="Event-Wise Investigation & Security Report Generation Engine"
        icon={<FileBarChart className="w-5 h-5" />}
      />

      {/* Event Selection Control Panel */}
      <SectionCard className="mb-6 border-cyber-cyan/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="section-title flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyber-cyan" />
              Event-Wise Target Selector
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an active security event or correlated incident to generate tailored PDF reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400">Target Event:</label>
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setGenerated(new Set()); // Reset generated states for new event selection
                audio.play('click');
              }}
              className="bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-xs font-mono text-cyber-cyan focus:outline-none focus:border-cyber-cyan/50 cursor-pointer min-w-[280px]"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.id} — {opt.name} ({opt.severity?.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Event Telemetry Summary Box */}
        <div className="p-4 rounded-xl bg-ink-900/80 border border-ink-700/80 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Selected Target ID</span>
            <span className="text-cyber-cyan font-bold text-sm">{selectedItem.id}</span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Severity Level</span>
            <span className={severityClass((selectedItem.severity || 'medium') as Severity)}>
              {severityText((selectedItem.severity || 'medium') as Severity)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Target Asset / User</span>
            <span className="text-slate-200">{selectedItem.asset} ({selectedItem.user})</span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block uppercase">Source IP</span>
            <span className="text-slate-300">{selectedItem.source_ip}</span>
          </div>

          <div className="md:col-span-4 pt-2 border-t border-ink-800 text-[11px] text-slate-400">
            <span className="text-slate-500 font-bold">Telemetry Payload: </span>
            <code className="text-cyber-cyan/90 bg-ink-950 px-2 py-0.5 rounded border border-ink-700">
              {selectedItem.raw_log}
            </code>
          </div>
        </div>
      </SectionCard>

      {/* 4 Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => {
          const cfg = reportTypeConfig[report.type];
          const Icon = cfg.icon;
          const isGenerating = generating === report.id;
          const isGenerated = generated.has(report.id);
          return (
            <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <SectionCard>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg border border-current ${cfg.color} bg-current/10 flex items-center justify-center`} style={{ background: 'rgba(0,229,255,0.05)' }}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cfg.desc}</p>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-500 mb-3 space-y-0.5 bg-ink-900/50 p-2 rounded border border-ink-800">
                  <div className="flex items-center justify-between">
                    <span>REPORT FORM: <strong className="text-slate-300">{report.id}</strong></span>
                    <span className="text-cyber-cyan">TARGET: {selectedItem.id}</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan">
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating {selectedItem.id} report...
                      </div>
                      <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.4 }} />
                      </div>
                    </motion.div>
                  ) : isGenerated ? (
                    <motion.div key="generated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
                        <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                        <span className="font-mono text-xs text-cyber-green">{selectedItem.id} REPORT READY</span>
                      </div>
                      <button
                        onClick={() => handleDownload(report.type)}
                        className="p-2 rounded-lg bg-ink-800 border border-ink-600 hover:border-cyber-cyan/40 transition-colors"
                        title={`Download ${selectedItem.id} PDF Report`}
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => handleGenerate(report.id, report.type)}
                      className="btn-cyber w-full"
                    >
                      <FileBarChart className="w-4 h-4" /> GENERATE REPORT FOR {selectedItem.id}
                    </motion.button>
                  )}
                </AnimatePresence>
              </SectionCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
