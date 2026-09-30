"use client";

import { motion } from 'framer-motion';
import { FileText, CheckCircle2, HelpCircle, AlertCircle, XCircle } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { demoIncident } from '@/data/simData';
import { evidenceColor, evidenceLabel } from '@/utils/severity';
import type { EvidenceType } from '@/types';

const evidenceIcons: Record<EvidenceType, typeof CheckCircle2> = { confirmed: CheckCircle2, inferred: AlertCircle, possible: HelpCircle, unknown: XCircle };
const evidenceDescriptions: Record<EvidenceType, string> = { confirmed: 'What the system actually observed', inferred: 'What the system infers from evidence', possible: 'Possible activity based on patterns', unknown: 'Not yet confirmed — requires investigation' };

export function AttackNarrative() {
  return (
    <div>
      <PageHeader title="Attack Narrative" subtitle={`Incident ${demoIncident.id} · AI-generated attack story`} icon={<FileText className="w-5 h-5" />} />
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {(Object.keys(evidenceDescriptions) as EvidenceType[]).map((type) => {
          const Icon = evidenceIcons[type];
          return <div key={type} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${evidenceColor(type)}`}><Icon className="w-3.5 h-3.5" /><span className="font-mono text-[10px] uppercase tracking-wider font-semibold">{evidenceLabel(type)}</span><span className="text-[10px] text-slate-500 hidden md:inline">— {evidenceDescriptions[type]}</span></div>;
        })}
      </div>
      <SectionCard>
        <div className="space-y-4">
          {(demoIncident.narrative ?? []).map((section, i) => {
            const Icon = evidenceIcons[section.label];
            return <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${evidenceColor(section.label)}`}><Icon className="w-5 h-5" /></div>
              <div className="flex-1 pt-1"><span className={`font-mono text-[10px] uppercase tracking-wider font-semibold ${evidenceColor(section.label).split(' ')[0]}`}>{evidenceLabel(section.label)}</span><p className="text-sm text-slate-300 mt-1 leading-relaxed">{section.text}</p></div>
            </motion.div>;
          })}
        </div>
      </SectionCard>
      <SectionCard className="mt-6" title="Executive Summary">
        <p className="text-sm text-slate-300 leading-relaxed">A privileged user account (<span className="font-mono text-cyber-cyan">admin01</span>) may have been compromised after multiple failed authentication attempts. A successful login was followed by privileged access and PowerShell execution. The account subsequently accessed a sensitive database and initiated a suspicious data transfer. This sequence may indicate unauthorized access followed by privilege escalation and possible data exfiltration.</p>
        <div className="mt-4 p-4 rounded-lg bg-risk-critical/5 border border-risk-critical/20"><div className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-risk-critical flex-shrink-0 mt-0.5" /><div><p className="text-sm font-semibold text-risk-critical mb-1">Important Note</p><p className="text-xs text-slate-400">The AI distinguishes between confirmed evidence, inferred behavior, possible activity, and unknown information. Speculation is never presented as confirmed fact. The analyst must validate findings before taking action.</p></div></div></div>
      </SectionCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Evidence', desc: 'What the system actually observed', icon: CheckCircle2, color: 'text-cyber-green' },
          { label: 'Analysis', desc: 'What the system infers from that evidence', icon: AlertCircle, color: 'text-cyber-cyan' },
          { label: 'Recommendation', desc: 'What the system suggests the analyst investigate', icon: HelpCircle, color: 'text-risk-high' },
        ].map((item, i) => { const Icon = item.icon; return <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-5"><Icon className={`w-6 h-6 ${item.color} mb-3`} /><h3 className="text-sm font-bold text-white mb-1">{item.label}</h3><p className="text-xs text-slate-400">{item.desc}</p></motion.div>; })}
      </div>
    </div>
  );
}
