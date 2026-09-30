"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Bell, Search, Filter, GitBranch, Zap, ArrowRight, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { alerts, securityEvents } from '@/data/simData';
import { severityClass, severityText } from '@/utils/severity';
import type { AlertStatus, SecurityEvent } from '@/types';

const statusColors: Record<AlertStatus, string> = {
  new: 'text-slate-400 bg-slate-700/30 border-slate-600',
  investigating: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30',
  correlated: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30',
  escalated: 'text-risk-high bg-risk-high/10 border-risk-high/30',
  resolved: 'text-slate-500 bg-slate-800/50 border-slate-700',
};

export function AlertCenter() {
  const router = useRouter();
  const { audio } = useApp();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [correlating, setCorrelating] = useState(false);
  const [correlated, setCorrelated] = useState(false);
  const [correlationStep, setCorrelationStep] = useState(0);

  const correlationSteps = ['Analyzing event signatures...', 'Matching temporal patterns...', 'Cross-referencing user identities...', 'Linking asset relationships...', 'Building incident graph...', 'Incident TR-2026-0017 reconstructed.'];
  const correlationEvents = securityEvents.filter((e) => e.correlated);

  const filteredAlerts = alerts.filter((a) => {
    const nameStr = a.name || a.rule || '';
    const userStr = a.user || '';
    const ipStr = a.ip || a.source_ip || '';
    const matchesSearch = nameStr.toLowerCase().includes(search.toLowerCase()) || userStr.toLowerCase().includes(search.toLowerCase()) || ipStr.includes(search);
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleCorrelate = () => { audio.play('click'); setCorrelating(true); setCorrelationStep(0); setCorrelated(false); };

  return (
    <div>
      <PageHeader title="Alert Center" subtitle="Security alert management & correlation" icon={<Bell className="w-5 h-5" />}
        actions={<button onClick={handleCorrelate} disabled={correlating} className="btn-cyber disabled:opacity-50">
          {correlating ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
          {correlating ? 'Correlating...' : 'Correlate Events'}
        </button>} />

      <SectionCard className="mb-6" title="Alert Correlation Engine">
        {correlating ? (
          <CorrelationAnimation steps={correlationSteps} events={correlationEvents} currentStep={correlationStep}
            onComplete={() => { setCorrelating(false); setCorrelated(true); audio.play('correlate'); }} />
        ) : correlated ? (
          <CorrelatedResult events={correlationEvents} onInvestigate={() => router.push('/incidents')} />
        ) : (
          <CorrelationIdle events={correlationEvents} />
        )}
      </SectionCard>

      <SectionCard title="Alert Queue"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search alerts..."
                className="w-48 bg-ink-800/60 border border-ink-600 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-slate-300 focus:border-cyber-cyan/40 focus:outline-none" />
            </div>
            <div className="flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
                <button key={f} onClick={() => { setSeverityFilter(f); audio.play('click'); }}
                  className={`px-2 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    severityFilter === f ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40' : 'text-slate-500 hover:text-slate-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700">
                {['Time', 'Alert', 'Source', 'User', 'IP', 'Device', 'Severity', 'Status', 'Correlation'].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert, i) => (
                <motion.tr key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  onClick={() => audio.play('click')} className="border-b border-ink-800/50 hover:bg-ink-800/30 transition-colors cursor-pointer group">
                  <td className="py-2.5 px-2 font-mono text-xs text-slate-500">{alert.time}</td>
                  <td className="py-2.5 px-2 text-slate-300 group-hover:text-cyber-cyan transition-colors">{alert.name}</td>
                  <td className="py-2.5 px-2 font-mono text-xs text-slate-500">{alert.source}</td>
                  <td className="py-2.5 px-2 font-mono text-xs text-slate-400">{alert.user}</td>
                  <td className="py-2.5 px-2 font-mono text-xs text-slate-500">{alert.ip}</td>
                  <td className="py-2.5 px-2 font-mono text-xs text-slate-500">{alert.device}</td>
                  <td className="py-2.5 px-2"><span className={severityClass(alert.severity)}>{severityText(alert.severity)}</span></td>
                  <td className="py-2.5 px-2"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${statusColors[alert.status]}`}>{alert.status}</span></td>
                  <td className="py-2.5 px-2 font-mono text-xs">
                    {alert.correlation !== '—' ? <span className="text-cyber-green flex items-center gap-1"><GitBranch className="w-3 h-3" /> {alert.correlation}</span> : <span className="text-slate-600">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function CorrelationIdle({ events }: { events: SecurityEvent[] }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-4">{events.length} events detected from user <span className="font-mono text-cyber-cyan">admin01</span>. These appear as separate alerts but may form a coordinated attack sequence.</p>
      <div className="flex flex-wrap items-center gap-2">
        {events.map((e, i) => (
          <div key={e.id} className="flex items-center gap-2">
            <div className={`px-3 py-2 rounded-lg border font-mono text-xs ${i === events.length - 1 ? 'border-risk-critical/40 bg-risk-critical/10 text-risk-critical' : 'border-ink-600 bg-ink-800/50 text-slate-300'}`}>
              {e.event_type.replace(/_/g, ' ')}
            </div>
            {i < events.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono"><Zap className="w-4 h-4 text-cyber-cyan" /> Click "Correlate Events" to reconstruct the attack chain.</div>
    </div>
  );
}

function CorrelationAnimation({ steps, events, currentStep, onComplete }: { steps: string[]; events: SecurityEvent[]; currentStep: number; onComplete: () => void }) {
  const { audio } = useApp();

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      audio.play('timelineTick');
      if (step >= steps.length) { clearInterval(interval); setTimeout(onComplete, 600); }
    }, 500);
    return () => clearInterval(interval);
  }, [audio, onComplete, steps.length]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {events.map((e, i) => {
          const connected = currentStep > i + 1;
          const connecting = currentStep === i + 1;
          return (
            <div key={e.id} className="flex items-center gap-2">
              <motion.div animate={{ scale: connected ? 1 : connecting ? 1.1 : 0.9, opacity: connected ? 1 : connecting ? 0.9 : 0.4 }}
                className={`px-3 py-2 rounded-lg border font-mono text-xs transition-all ${
                  connected ? 'border-cyber-green/50 bg-cyber-green/10 text-cyber-green shadow-glow-green'
                  : connecting ? 'border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan shadow-glow-cyan'
                  : 'border-ink-600 bg-ink-800/50 text-slate-500'}`}>
                {e.event_type.replace(/_/g, ' ')}
              </motion.div>
              {i < events.length - 1 && <div className={`w-8 h-px ${connected ? 'bg-cyber-green/60' : 'bg-ink-700'}`} />}
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5 font-mono text-xs">
        {steps.slice(0, currentStep + 1).map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            {i < currentStep ? <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" /> : <Loader2 className="w-3.5 h-3.5 text-cyber-cyan animate-spin" />}
            <span className={i < currentStep ? 'text-slate-400' : 'text-cyber-cyan'}>{step}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 h-1 bg-ink-800 rounded-full overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green" animate={{ width: `${(currentStep / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}

function CorrelatedResult({ events, onInvestigate }: { events: SecurityEvent[]; onInvestigate: () => void }) {
  const { audio } = useApp();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyber-green/15 border border-cyber-green/30 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-cyber-green" /></div>
        <div><h3 className="text-lg font-bold text-white">Incident TR-2026-0017</h3><p className="text-sm text-cyber-green">Possible Account Compromise — 6 events correlated</p></div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {events.map((e, i) => (
          <div key={e.id} className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg border border-cyber-green/40 bg-cyber-green/10 text-cyber-green font-mono text-xs">{e.event_type.replace(/_/g, ' ')}</div>
            {i < events.length - 1 && <ArrowRight className="w-4 h-4 text-cyber-green/60" />}
          </div>
        ))}
      </div>
      <button onClick={() => { onInvestigate(); audio.play('click'); }} className="btn-cyber"><AlertTriangle className="w-4 h-4" /> Investigate Incident</button>
    </motion.div>
  );
}
