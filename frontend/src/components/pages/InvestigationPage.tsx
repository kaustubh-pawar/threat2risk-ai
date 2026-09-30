"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Shield, Clock, FileText, Server, Crosshair, ShieldCheck, Lightbulb, Gauge, Activity, ChevronRight, Network, GitBranch } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { severityText, severityColor, evidenceColor, evidenceLabel } from '@/utils/severity';

export function InvestigationPage() {
  const router = useRouter();
  const { incident, risk, blastRadius, attackGraph } = useSelectedIncident();

  const sections: { label: string; icon: typeof Clock; href: string }[] = [
    { label: 'Timeline', icon: Clock, href: '/attack-timeline' },
    { label: 'Attack Graph', icon: Network, href: '/attack-graph' },
    { label: 'MITRE', icon: Crosshair, href: '/mitre' },
    { label: 'Risk', icon: Gauge, href: '/risk' },
    { label: 'Blast Radius', icon: Server, href: '/blast-radius' },
    { label: 'GRC', icon: ShieldCheck, href: '/grc' },
    { label: 'Evidence', icon: FileText, href: '/evidence' },
    { label: 'Recommendations', icon: Lightbulb, href: '/recommendations' },
  ];

  return (
    <div>
      <PageHeader title="Investigation" subtitle={`${incident.id} · ${incident.title}`} icon={<AlertTriangle className="w-5 h-5" />} />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel-strong p-6 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-risk-critical/60 to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-slate-500">INCIDENT</span>
              <span className="font-mono text-sm font-bold text-cyber-cyan">{incident.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">{incident.status.replace(/_/g, ' ')}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{incident.title}</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{incident.summary}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Risk</div><div className={`text-2xl font-bold font-mono ${severityColor(incident.severity)}`}>{severityText(incident.severity)}</div></div>
            <div className="text-center"><div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Score</div><div className="text-2xl font-bold font-mono text-risk-critical">{risk.risk_score}<span className="text-sm text-slate-600">/100</span></div></div>
            <div className="text-center"><div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Confidence</div><div className="text-2xl font-bold font-mono text-cyber-cyan">{risk.confidence}<span className="text-sm text-slate-600">%</span></div></div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SectionCard title="Affected Assets">
          <div className="space-y-2">{incident.affected_assets.map((a) => (
            <div key={a} className="flex items-center gap-2 font-mono text-xs text-slate-300"><Server className="w-3.5 h-3.5 text-cyber-cyan/60" />{a}</div>
          ))}</div>
        </SectionCard>
        <SectionCard title="Affected Users">
          <div className="space-y-2">{incident.affected_users.map((u) => (
            <div key={u} className="flex items-center gap-2 font-mono text-xs text-slate-300"><Shield className="w-3.5 h-3.5 text-cyber-cyan/60" />{u}</div>
          ))}</div>
        </SectionCard>
        <SectionCard title="Network Indicators">
          <div className="space-y-1 font-mono text-[10px]">
            <div className="text-slate-500 mb-1">SOURCE IPs</div>
            {incident.source_ips.map((ip) => <div key={ip} className="text-slate-300">{ip}</div>)}
            <div className="text-slate-500 mt-2 mb-1">DESTINATION IPs</div>
            {incident.destination_ips.map((ip) => <div key={ip} className="text-slate-300">{ip}</div>)}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => router.push(s.href)} className="glass-panel p-4 hover:border-cyber-cyan/30 transition-all group text-left">
              <Icon className="w-5 h-5 text-cyber-cyan/70 mb-2 group-hover:text-cyber-cyan transition-colors" />
              <div className="text-sm font-semibold text-slate-200 group-hover:text-cyber-cyan transition-colors">{s.label}</div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-all mt-1" />
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Evidence">
          <div className="space-y-3">
            {(incident.evidence ?? []).map((e, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border flex-shrink-0 ${evidenceColor(e.type)}`}>{evidenceLabel(e.type)}</span>
                <div><div className="text-sm font-semibold text-slate-200">{e.title}</div><div className="text-xs text-slate-400 mt-0.5">{e.detail}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Attack Graph Summary">
          <div className="flex items-center gap-2 py-2 overflow-x-auto">
            {attackGraph.nodes.map((n, i) => (
              <div key={n.id} className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg bg-ink-800/60 border border-ink-700 font-mono text-xs text-slate-300">{n.label}</div>
                {i < attackGraph.nodes.length - 1 && <ChevronRight className="w-4 h-4 text-slate-600" />}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50">
            <div className="font-mono text-[10px] text-slate-500 mb-2">BLAST RADIUS</div>
            <div className="text-sm text-slate-300">{blastRadius.affected_assets.length} assets · {blastRadius.critical_assets.length} critical · Spread: {blastRadius.potential_spread.slice(0, 2).join(', ')}</div>
          </div>
          <div className="mt-4">
            <div className="font-mono text-[10px] text-slate-500 mb-2">RECOMMENDED ACTIONS</div>
            {(incident.recommendations ?? []).slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-2 py-1.5 text-xs text-slate-300"><Activity className="w-3.5 h-3.5 text-cyber-cyan" />{r.action}</div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
