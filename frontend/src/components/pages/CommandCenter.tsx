"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Bell, AlertTriangle, Server, Search, Activity,
  TrendingUp, Pause, Play, ChevronRight, Brain, ShieldAlert, Database, Zap,
  Gauge, Crosshair, Radio,
} from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { useCountUp, useInterval } from '@/hooks/useAnimations';
import { eventsService } from '@/services/eventsService';
import { alertsService } from '@/services/alertsService';
import { incidentsService } from '@/services/incidentsService';
import { severityClass, severityText } from '@/utils/severity';
import type { Severity } from '@/types';

interface StreamEvent { id: number; time: string; type: string; severity: Severity }

const eventTypes: { type: string; severity: Severity }[] = [
  { type: 'FAILED_LOGIN', severity: 'medium' },
  { type: 'SUCCESSFUL_LOGIN', severity: 'low' },
  { type: 'PRIVILEGE_ESCALATION', severity: 'high' },
  { type: 'POWERSHELL_EXECUTION', severity: 'high' },
  { type: 'DATABASE_ACCESS', severity: 'critical' },
  { type: 'DATA_TRANSFER', severity: 'critical' },
  { type: 'PORT_SCAN', severity: 'low' },
  { type: 'MALWARE_DETECTED', severity: 'high' },
  { type: 'DNS_ANOMALY', severity: 'medium' },
  { type: 'VPN_ACCESS', severity: 'medium' },
];

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function CommandCenter() {
  const router = useRouter();
  const { audio, setSelectedIncidentId } = useApp();
  const { incident, risk, blastRadius, mitreMappings } = useSelectedIncident();
  const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'critical'>('all');
  const eventCounter = useRef(0);

  const allEvents = eventsService.getAll();
  const criticalAlerts = alertsService.getAll().filter((a) => a.severity === 'critical').length;
  const activeIncidents = incidentsService.getActiveCount();

  useInterval(() => {
    if (paused) return;
    const sample = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const newEvent: StreamEvent = { id: eventCounter.current++, time: formatTime(new Date()), type: sample.type, severity: sample.severity };
    setStreamEvents((prev) => [newEvent, ...prev].slice(0, 50));
    if (sample.severity === 'critical') audio.play('critical');
    else if (sample.severity === 'high') audio.play('alert');
  }, 2500);

  useEffect(() => {
    const initial: StreamEvent[] = allEvents.slice(0, 8).map((e) => ({
      id: eventCounter.current++, time: e.timestamp.slice(11, 19), type: e.event_type, severity: e.severity,
    }));
    setStreamEvents(initial);
  }, []);

  const filteredEvents = filter === 'all' ? streamEvents : streamEvents.filter((e) => e.severity === filter);

  return (
    <div>
      <PageHeader title="Security Command Center" subtitle="Threat2Risk investigation pipeline overview"
        icon={<LayoutDashboard className="w-5 h-5" />}
        actions={<button onClick={() => router.push('/investigation')} className="btn-cyber"><Brain className="w-4 h-4" /> Investigate</button>} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <StatCard label="Active Incidents" value={activeIncidents} icon={AlertTriangle} color="critical" pulse />
        <StatCard label="Critical Alerts" value={criticalAlerts} icon={Bell} color="critical" />
        <StatCard label="Risk Score" value={risk.risk_score} icon={Gauge} color="high" />
        <StatCard label="Confidence" value={risk.confidence} icon={ShieldAlert} color="cyan" />
        <StatCard label="Assets at Risk" value={incident.affected_assets.length} icon={Server} color="blue" />
        <StatCard label="Blast Radius" value={blastRadius.affected_assets.length} icon={Radio} color="high" />
        <StatCard label="MITRE Techniques" value={mitreMappings.length} icon={Crosshair} color="cyan" />
        <StatCard label="Security Events" value={allEvents.length} icon={Activity} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard title="Live Security Event Stream"
            actions={
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {(['all', 'high', 'critical'] as const).map((f) => (
                    <button key={f} onClick={() => { setFilter(f); audio.play('click'); }}
                      className={`px-2 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        filter === f ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40' : 'text-slate-500 hover:text-slate-300'}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setPaused(!paused); audio.play('click'); }} className="p-1.5 rounded-md bg-ink-800 border border-ink-600 hover:border-cyber-cyan/40 transition-colors">
                  {paused ? <Play className="w-3.5 h-3.5 text-cyber-green" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            }>
            <div className="h-[420px] overflow-y-auto font-mono text-xs space-y-0.5 pr-2">
              <AnimatePresence initial={false}>
                {filteredEvents.map((event) => (
                  <motion.div key={event.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded border-l-2 hover:bg-ink-800/40 transition-colors cursor-pointer ${
                      event.severity === 'critical' ? 'border-risk-critical' : event.severity === 'high' ? 'border-risk-high' : event.severity === 'medium' ? 'border-risk-medium' : 'border-risk-low'
                    }`} onClick={() => { router.push('/events'); audio.play('click'); }}>
                    <span className="text-slate-600">[{event.time}]</span>
                    <span className={`flex-1 ${event.severity === 'critical' ? 'text-risk-critical' : event.severity === 'high' ? 'text-risk-high' : 'text-cyber-green'}`}>{event.type}</span>
                    <span className={severityClass(event.severity)}>{severityText(event.severity)}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredEvents.length === 0 && <div className="text-slate-600 text-center py-8">No events matching filter.</div>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-risk-critical/15 border border-risk-critical/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-risk-critical" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Critical Incident</h3>
                <p className="font-mono text-[10px] text-slate-500">{incident.id}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-3">{incident.title}</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-mono">Risk Score</span><span className="text-risk-critical font-mono font-bold">{risk.risk_score} / 100</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-mono">Confidence</span><span className="text-cyber-cyan font-mono font-bold">{risk.confidence}%</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-mono">Affected Assets</span><span className="text-slate-300 font-mono">{incident.affected_assets.length}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-mono">MITRE Techniques</span><span className="text-slate-300 font-mono">{mitreMappings.length}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-500 font-mono">Attack Progression</span><span className="text-slate-300 font-mono">{incident.event_count} stages</span></div>
            </div>
            <button onClick={() => { setSelectedIncidentId(incident.id); router.push('/investigation'); audio.play('critical'); }}
              className="w-full py-2 rounded-lg bg-risk-critical/15 border border-risk-critical/40 text-risk-critical font-mono text-xs uppercase tracking-wider hover:bg-risk-critical/25 transition-colors flex items-center justify-center gap-2">
              Investigate Incident <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </SectionCard>

          <SectionCard title="System Health">
            <div className="space-y-3">
              {[
                { label: 'SIEM Ingestion', value: 94, icon: Activity, color: 'bg-cyber-green' },
                { label: 'AI Engine', value: 87, icon: Brain, color: 'bg-cyber-cyan' },
                { label: 'Risk Processing', value: 91, icon: Zap, color: 'bg-cyber-violet' },
                { label: 'DB Queries', value: 78, icon: Database, color: 'bg-cyber-blue' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2"><Icon className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs text-slate-400">{s.label}</span></div>
                      <span className="font-mono text-xs text-slate-300">{s.value}%</span>
                    </div>
                    <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <motion.div className={`h-full ${s.color}`} initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1, delay: 0.3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="24h Activity">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyber-green" /><span className="text-sm text-slate-300">Events Processed</span></div>
              <span className="font-mono text-lg font-bold text-cyber-green">48,219</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[40, 55, 35, 70, 60, 85, 50, 75, 90, 65, 80, 95].map((h, i) => (
                <motion.div key={i} className="flex-1 bg-gradient-to-t from-cyber-cyan/20 to-cyber-cyan/60 rounded-t"
                  initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05, duration: 0.5 }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-slate-600"><span>00:00</span><span>12:00</span><span>24:00</span></div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, pulse }: { label: string; value: number; icon: typeof Bell; color: 'cyan' | 'critical' | 'high' | 'blue' | 'green'; pulse?: boolean }) {
  const count = useCountUp(value, 1500);
  const colorMap = {
    cyan: { text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/20' },
    critical: { text: 'text-risk-critical', bg: 'bg-risk-critical/10', border: 'border-risk-critical/20' },
    high: { text: 'text-risk-high', bg: 'bg-risk-high/10', border: 'border-risk-high/20' },
    blue: { text: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/20' },
    green: { text: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/20' },
  };
  const c = colorMap[color];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`stat-card ${pulse ? 'animate-criticalPulse' : ''}`}>
      <div className={`absolute top-0 left-0 right-0 h-px ${c.bg.replace('/10', '/40')}`} />
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}><Icon className={`w-4 h-4 ${c.text}`} /></div>
      </div>
      <div className={`text-3xl font-bold font-mono ${c.text}`}>{count.toLocaleString()}</div>
    </motion.div>
  );
}
