"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { demoIncident } from '@/data/simData';

const frameworkIcons = { GRC: Shield, 'ISO 27001': FileText, NIST: ShieldCheck };
const statusConfig = {
  review: { icon: AlertTriangle, color: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-risk-high/30', label: 'Area Requiring Review' },
  compliant: { icon: CheckCircle2, color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/30', label: 'Compliant' },
  gap: { icon: XCircle, color: 'text-risk-critical', bg: 'bg-risk-critical/10', border: 'border-risk-critical/30', label: 'Potential Gap' },
};

const nistLifecycle = ['Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

export function GRCPage() {
  const grcItems = demoIncident.grc ?? [];

  return (
    <div>
      <PageHeader title="GRC / ISO / NIST Intelligence" subtitle={`Incident ${demoIncident.id} · Compliance & control context`} icon={<ShieldCheck className="w-5 h-5" />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {(['GRC', 'ISO 27001', 'NIST'] as const).map((fw, i) => {
          const Icon = frameworkIcons[fw];
          const count = grcItems.filter((g) => g.framework === fw).length;
          return (
            <motion.div key={fw} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center"><Icon className="w-5 h-5 text-cyber-cyan" /></div>
                <div><h3 className="text-sm font-bold text-white">{fw}</h3><p className="font-mono text-[10px] text-slate-500">{count} control areas</p></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <SectionCard className="mb-6" title="NIST Cybersecurity Lifecycle">
        <div className="flex flex-col md:flex-row items-stretch gap-2">
          {nistLifecycle.map((phase, i) => {
            const relevant = grcItems.find((g) => g.framework === 'NIST' && g.area === phase);
            const status = relevant?.status ?? 'review';
            const cfg = statusConfig[status];
            return (
              <div key={phase} className="flex items-center gap-2 flex-1">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className={`flex-1 p-4 rounded-lg border ${cfg.bg} ${cfg.border} text-center`}>
                  <div className={`font-mono text-xs uppercase tracking-wider ${cfg.color} mb-1`}>{phase}</div>
                  {relevant ? <div className="text-[10px] text-slate-400">{relevant.control}</div> : <div className="text-[10px] text-slate-600">—</div>}
                </motion.div>
                {i < nistLifecycle.length - 1 && <div className="text-slate-600 hidden md:block">→</div>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Control Area Insights">
        <div className="space-y-3">
          {grcItems.map((insight, i) => {
            const Icon = frameworkIcons[insight.framework];
            const cfg = statusConfig[insight.status];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="p-4 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyber-cyan/60" />
                    <span className="font-mono text-xs text-cyber-cyan">{insight.framework}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-sm font-semibold text-slate-200">{insight.area}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                    <cfg.icon className="w-3 h-3" /> {cfg.label}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 mb-1">{insight.control}</div>
                <p className="text-xs text-slate-400">{insight.relevance}</p>
              </motion.div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard className="mt-6" title="Potential Control Gap">
        <div className="p-4 rounded-lg bg-risk-high/5 border border-risk-high/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Privileged account compromised</h3>
              <p className="text-xs text-slate-400 mb-2"><span className="text-risk-high font-semibold">Potential area requiring review:</span> Privileged Access Controls</p>
              <p className="text-xs text-slate-400"><span className="text-slate-300 font-semibold">Why?</span> The incident involved unauthorized activity through a privileged account. Review whether PAM controls adequately monitored and alerted on this access pattern, and whether MFA was enforced for privileged sessions.</p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
