"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Monitor, AlertTriangle, Server, Search, TrendingUp, ShieldCheck, Lightbulb, ChevronRight } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useCountUp } from '@/hooks/useAnimations';
import { demoIncident, affectedAssets } from '@/data/simData';

export function ExecutiveDashboard() {
  const router = useRouter();
  const { audio } = useApp();

  return (
    <div>
      <PageHeader title="Executive Dashboard" subtitle="CISO / Management security posture overview" icon={<Monitor className="w-5 h-5" />} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ExecStat label="Critical Incidents" value={8} icon={AlertTriangle} color="critical" />
        <ExecStat label="High-Risk Incidents" value={21} icon={AlertTriangle} color="high" />
        <ExecStat label="Affected Critical Assets" value={5} icon={Server} color="blue" />
        <ExecStat label="Open Investigations" value={12} icon={Search} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Business Impact">
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-risk-critical/5 border border-risk-critical/20">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-risk-critical" /><span className="text-sm font-semibold text-white">Potential Data Breach</span></div>
              <p className="text-xs text-slate-400">Customer database accessed — 45,000 records potentially exposed via outbound data transfer (2.3 GB).</p>
            </div>
            <div className="p-4 rounded-lg bg-risk-high/5 border border-risk-high/20">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-risk-high" /><span className="text-sm font-semibold text-white">Operational Risk</span></div>
              <p className="text-xs text-slate-400">Domain Admin account compromised — attacker has elevated access to critical infrastructure.</p>
            </div>
            <div className="p-4 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20">
              <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-cyber-cyan" /><span className="text-sm font-semibold text-white">Financial Exposure</span></div>
              <p className="text-xs text-slate-400">Potential regulatory fines and customer notification costs if PII exposure is confirmed.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Top Risks">
          <div className="space-y-2">
            {(demoIncident.riskFactors ?? []).slice(0, 5).map((factor, i) => (
              <motion.div key={factor.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500 w-5">{i + 1}</span>
                <span className="text-sm text-slate-300 flex-1">{factor.name}</span>
                <div className="w-24 h-1.5 bg-ink-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-risk-high to-risk-critical" style={{ width: `${factor.score}%` }} /></div>
                <span className="font-mono text-xs text-slate-400 w-8 text-right">{factor.score}</span>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Critical Assets">
          <div className="space-y-2">
            {affectedAssets.filter((a) => a.criticality === 'critical').map((asset, i) => (
              <motion.div key={asset.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <Server className="w-4 h-4 text-cyber-cyan/60" />
                <span className="text-sm text-slate-200 flex-1">{asset.name}</span>
                <span className={`font-mono text-xs ${asset.currentRisk === 'critical' ? 'text-risk-critical' : 'text-risk-high'}`}>{asset.riskScore}/100</span>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recommended Priorities">
          <div className="space-y-2">
            {(demoIncident.recommendations ?? []).slice(0, 5).map((rec, i) => (
              <motion.div key={rec.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <span className="font-mono text-xs text-slate-600 mt-0.5">{String(rec.id).padStart(2, '0')}</span>
                <span className="text-sm text-slate-300 flex-1">{rec.action}</span>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="lg:col-span-2" title="Control Areas Requiring Review">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(demoIncident.grc ?? []).filter((g) => g.status !== 'compliant').map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-ink-800/40 border border-ink-700/50">
                <ShieldCheck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${g.status === 'gap' ? 'text-risk-critical' : 'text-risk-high'}`} />
                <div>
                  <div className="text-sm font-semibold text-slate-200">{g.area}</div>
                  <div className="font-mono text-[10px] text-slate-500">{g.framework} · {g.control}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 flex justify-center">
        <button onClick={() => { router.push('/reports'); audio.play('click'); }} className="btn-ghost">
          <Lightbulb className="w-4 h-4" /> Generate Executive Report <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ExecStat({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof AlertTriangle; color: 'critical' | 'high' | 'blue' | 'green' }) {
  const count = useCountUp(value, 1500);
  const colorMap = {
    critical: { text: 'text-risk-critical', bg: 'bg-risk-critical/10', border: 'border-risk-critical/20' },
    high: { text: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-risk-high/20' },
    blue: { text: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20' },
    green: { text: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/20' },
  };
  const c = colorMap[color];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}><Icon className={`w-4 h-4 ${c.text}`} /></div>
      </div>
      <div className={`text-3xl font-bold font-mono ${c.text}`}>{String(count).padStart(2, '0')}</div>
    </motion.div>
  );
}
