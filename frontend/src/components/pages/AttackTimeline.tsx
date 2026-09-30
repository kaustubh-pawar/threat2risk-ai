"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ZoomIn, ZoomOut, Eye, User, Globe, Server, AlertTriangle } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { severityClass, severityText } from '@/utils/severity';
import type { TimelineEvent } from '@/types';

export function AttackTimeline() {
  const { audio } = useApp();
  const { incident } = useSelectedIncident();
  const [zoom, setZoom] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [filterSuspicious, setFilterSuspicious] = useState(false);
  const timeline = incident.timeline ?? [];
  const events = filterSuspicious ? timeline.filter((e) => e.suspicious) : timeline;

  return (
    <div>
      <PageHeader title="Attack Timeline" subtitle={`Incident ${incident.id} · Chronological event reconstruction`} icon={<Clock className="w-5 h-5" />}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => { setFilterSuspicious(!filterSuspicious); audio.play('click'); }}
              className={`px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors ${filterSuspicious ? 'bg-risk-high/15 text-risk-high border-risk-high/40' : 'text-slate-500 border-ink-600 hover:text-slate-300'}`}>
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> Suspicious Only
            </button>
            <button onClick={() => { setZoom(Math.max(0.5, zoom - 0.2)); audio.play('click'); }} className="p-2 rounded-lg bg-ink-800 border border-ink-600 hover:border-cyber-cyan/40 transition-colors"><ZoomOut className="w-4 h-4 text-slate-400" /></button>
            <button onClick={() => { setZoom(Math.min(2, zoom + 0.2)); audio.play('click'); }} className="p-2 rounded-lg bg-ink-800 border border-ink-600 hover:border-cyber-cyan/40 transition-colors"><ZoomIn className="w-4 h-4 text-slate-400" /></button>
          </div>
        } />

      <SectionCard title="Chronological Event Sequence">
        <div className="relative pl-8" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-cyan/40 via-cyber-cyan/20 to-risk-critical/40" />
          <div className="space-y-6">
            {events.map((event, i) => (
              <TimelineNode key={i} event={event} index={i} isSelected={selectedEvent === i}
                onSelect={() => { setSelectedEvent(selectedEvent === i ? null : i); audio.play('click'); }} />
            ))}
          </div>
        </div>
      </SectionCard>

      <AnimatePresence>
        {selectedEvent !== null && events[selectedEvent] && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6">
            <SectionCard title="Event Detail">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{events[selectedEvent].title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{events[selectedEvent].description}</p>
                  <div className="flex items-center gap-2">
                    <span className={severityClass(events[selectedEvent].severity)}>{severityText(events[selectedEvent].severity)}</span>
                    {events[selectedEvent].suspicious && <span className="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-risk-high/10 text-risk-high border border-risk-high/30">Suspicious</span>}
                  </div>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <DetailRow icon={Clock} label="Timestamp" value={events[selectedEvent].time} />
                  <DetailRow icon={User} label="User" value={events[selectedEvent].user} />
                  <DetailRow icon={Globe} label="Source IP" value={events[selectedEvent].sourceIp} />
                  <DetailRow icon={Server} label="Device" value={events[selectedEvent].device} />
                  <DetailRow icon={Eye} label="Evidence ID" value={events[selectedEvent].evidence} />
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineNode({ event, index, isSelected, onSelect }: { event: TimelineEvent; index: number; isSelected: boolean; onSelect: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="relative">
      <div className={`absolute -left-5 top-2 w-3 h-3 rounded-full border-2 transition-all ${
        event.severity === 'critical' ? 'bg-risk-critical border-risk-critical shadow-glow-critical' : event.severity === 'high' ? 'bg-risk-high border-risk-high shadow-glow-high' : 'bg-cyber-cyan border-cyber-cyan shadow-glow-cyan'
      } ${event.suspicious ? 'animate-pulseGlow' : ''}`} />
      <button onClick={onSelect} className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected ? 'border-cyber-cyan/40 bg-cyber-cyan/5 shadow-glow-cyan' : 'border-ink-700/50 bg-ink-800/30 hover:border-cyber-cyan/20 hover:bg-ink-800/50'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3"><span className="font-mono text-sm font-bold text-cyber-cyan">{event.time}</span><span className="text-sm font-semibold text-white">{event.title}</span></div>
          <span className={severityClass(event.severity)}>{severityText(event.severity)}</span>
        </div>
        <p className="text-xs text-slate-400">{event.description}</p>
        <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-slate-600">
          <span>USER: {event.user}</span><span>IP: {event.sourceIp}</span><span>DEV: {event.device}</span>
        </div>
      </button>
    </motion.div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-ink-800/40 border border-ink-700/50">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-slate-500 uppercase tracking-wider text-[10px]">{label}</span>
      <span className="text-slate-300 ml-auto">{value}</span>
    </div>
  );
}
