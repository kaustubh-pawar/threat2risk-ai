"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search, Filter, X, FileText } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { eventsService } from '@/services/eventsService';
import { severityClass, severityText } from '@/utils/severity';
import type { SecurityEvent, Severity } from '@/types';

export function EventsPage() {
  const { audio } = useApp();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<SecurityEvent | null>(null);

  const events = eventsService.filter({ search, severity: severityFilter, source: sourceFilter, event_type: typeFilter });
  const sources = eventsService.getSources();
  const eventTypes = eventsService.getEventTypes();

  return (
    <div>
      <PageHeader title="Security Events" subtitle="Unified security event stream — normalized & enriched" icon={<Activity className="w-5 h-5" />} />

      <SectionCard title="Event Stream"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search events..."
                className="w-48 bg-ink-800/60 border border-ink-600 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-slate-300 focus:border-cyber-cyan/40 focus:outline-none" />
            </div>
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
              <button key={f} onClick={() => { setSeverityFilter(f); audio.play('click'); }}
                className={`px-2 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors ${severityFilter === f ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40' : 'text-slate-500 hover:text-slate-300'}`}>{f}</button>
            ))}
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-ink-800/60 border border-ink-600 rounded-lg px-2 py-1.5 font-mono text-[10px] text-slate-300 focus:outline-none">
              <option value="all">All Sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-ink-800/60 border border-ink-600 rounded-lg px-2 py-1.5 font-mono text-[10px] text-slate-300 focus:outline-none">
              <option value="all">All Types</option>
              {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700">
                {['Timestamp', 'Source', 'Type', 'Severity', 'User', 'Source IP', 'Host', 'Asset'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-mono text-[10px] uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((event, i) => (
                <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  onClick={() => { setSelected(event); audio.play('click'); }}
                  className="border-b border-ink-800/50 hover:bg-ink-800/40 cursor-pointer transition-colors">
                  <td className="py-2 px-3 font-mono text-xs text-slate-400">{event.timestamp.slice(11, 19)}</td>
                  <td className="py-2 px-3 font-mono text-xs text-cyber-cyan">{event.source}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-300">{event.event_type}</td>
                  <td className="py-2 px-3"><span className={severityClass(event.severity)}>{severityText(event.severity)}</span></td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-300">{event.user}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-400">{event.source_ip}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-300">{event.host}</td>
                  <td className="py-2 px-3 font-mono text-xs text-slate-400">{event.asset}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-ink-950/70 z-40" />
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-ink-900 border-l border-cyber-cyan/20 z-50 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-mono">{selected.id}</h3>
                <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-ink-800"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-3 font-mono text-xs">
                {[
                  ['Timestamp', selected.timestamp], ['Source', selected.source], ['Event Type', selected.event_type],
                  ['Severity', selected.severity], ['User', selected.user], ['Source IP', selected.source_ip],
                  ['Destination IP', selected.destination_ip], ['Host', selected.host], ['Process', selected.process ?? '—'],
                  ['Command', selected.command ?? '—'], ['Asset', selected.asset], ['Asset Criticality', selected.asset_criticality],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between py-2 border-b border-ink-800">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-300 text-right max-w-[60%] break-all">{String(value)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-cyber-cyan" /><span className="font-mono text-xs text-slate-500 uppercase">Raw Log</span></div>
                <pre className="p-3 rounded-lg bg-ink-950 border border-ink-700 font-mono text-xs text-cyber-green whitespace-pre-wrap">{selected.raw_log}</pre>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
