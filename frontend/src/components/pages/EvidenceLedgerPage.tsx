"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, X } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { eventsService } from '@/services/eventsService';
import type { EvidenceRecord } from '@/types';

const categoryColors: Record<EvidenceRecord['category'], string> = {
  risk: 'text-risk-critical border-risk-critical/30 bg-risk-critical/10',
  mitre: 'text-cyber-violet border-cyber-violet/30 bg-cyber-violet/10',
  grc: 'text-cyber-blue border-cyber-blue/30 bg-cyber-blue/10',
  recommendation: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10',
  ai: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10',
  correlation: 'text-risk-high border-risk-high/30 bg-risk-high/10',
};

export function EvidenceLedgerPage() {
  const { incident, evidence } = useSelectedIncident();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<EvidenceRecord | null>(null);

  const filtered = evidence.filter((e) =>
    !search || e.claim.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader title="Evidence Ledger" subtitle={`Incident ${incident.id} · Traceable conclusions & supporting evidence`} icon={<BookOpen className="w-5 h-5" />} />

      <SectionCard title="Evidence Records"
        actions={
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search claims..."
              className="w-48 bg-ink-800/60 border border-ink-600 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-slate-300 focus:border-cyber-cyan/40 focus:outline-none" />
          </div>
        }>
        <div className="space-y-3">
          {filtered.map((record, i) => (
            <motion.div key={record.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(record)}
              className="p-4 rounded-lg bg-ink-800/40 border border-ink-700/50 hover:border-cyber-cyan/30 cursor-pointer transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-mono text-[10px] text-slate-500">{record.id}</div>
                  <div className="text-sm font-semibold text-white mt-1">{record.claim}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${categoryColors[record.category]}`}>{record.category}</span>
              </div>
              <div className="flex flex-wrap gap-4 font-mono text-[10px] text-slate-500">
                <span>Evidence: {record.evidence_ids.join(', ')}</span>
                <span>Source: {record.source}</span>
                <span>Confidence: {record.confidence}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {selected && (
        <SectionCard className="mt-6" title="Evidence Detail">
          <button onClick={() => setSelected(null)} className="float-right p-1"><X className="w-4 h-4 text-slate-500" /></button>
          <div className="space-y-4 font-mono text-sm">
            <div><span className="text-slate-500">Claim:</span> <span className="text-white">{selected.claim}</span></div>
            <div><span className="text-slate-500">Evidence IDs:</span> <span className="text-cyber-cyan">{selected.evidence_ids.join(', ')}</span></div>
            <div><span className="text-slate-500">Source:</span> <span className="text-slate-300">{selected.source}</span></div>
            <div><span className="text-slate-500">Confidence:</span> <span className="text-cyber-cyan">{selected.confidence}%</span></div>
            <div><span className="text-slate-500">Timestamp:</span> <span className="text-slate-300">{selected.timestamp}</span></div>
            <div className="p-3 rounded-lg bg-ink-950 border border-ink-700">
              <div className="text-[10px] uppercase text-slate-500 mb-2">Reasoning</div>
              <div className="text-slate-300 text-xs leading-relaxed">{selected.reasoning}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">Linked Events</div>
              {selected.evidence_ids.map((id) => {
                const evt = eventsService.getById(id);
                return evt ? (
                  <div key={id} className="p-2 rounded bg-ink-800/40 border border-ink-700/50 mb-2 text-xs">
                    <span className="text-cyber-cyan">{id}</span> — {evt.event_type}: {evt.raw_log.slice(0, 80)}...
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
