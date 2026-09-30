"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, X } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import type { AttackGraphNode } from '@/types';

export function AttackGraphPage() {
  const { incident, attackGraph } = useSelectedIncident();
  const [selected, setSelected] = useState<AttackGraphNode | null>(null);
  const { nodes, edges } = attackGraph;

  return (
    <div>
      <PageHeader title="Attack Graph" subtitle={`Incident ${incident.id} · Entity relationship visualization`} icon={<Network className="w-5 h-5" />} />

      <SectionCard title="Attack Path">
        <div className="relative py-8 overflow-x-auto">
          <div className="flex items-center justify-center gap-4 min-w-max px-4">
            {nodes.map((node, i) => (
              <div key={node.id} className="flex items-center gap-4">
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  onClick={() => setSelected(node)}
                  className={`p-4 rounded-lg border min-w-[140px] text-center transition-all hover:border-cyber-cyan/50 ${
                    selected?.id === node.id ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-glow-cyan' : 'border-ink-700 bg-ink-800/40'
                  }`}>
                  <div className="font-mono text-[10px] uppercase text-slate-500 mb-1">{node.type}</div>
                  <div className="text-sm font-bold text-white">{node.label}</div>
                  {node.mitre_technique_id && <div className="font-mono text-[10px] text-cyber-violet mt-1">{node.mitre_technique_id}</div>}
                </motion.button>
                {i < nodes.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-px bg-cyber-cyan/40" />
                    <span className="font-mono text-[9px] text-slate-600 mt-1">{edges[i]?.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {selected && (
        <SectionCard className="mt-6" title={`Node: ${selected.label}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div><span className="text-slate-500">Type:</span> <span className="text-slate-300">{selected.type}</span></div>
            <div><span className="text-slate-500">Timestamp:</span> <span className="text-slate-300">{selected.timestamp ?? '—'}</span></div>
            <div><span className="text-slate-500">MITRE:</span> <span className="text-cyber-violet">{selected.mitre_technique_id} — {selected.mitre_technique_name}</span></div>
            <div><span className="text-slate-500">Tactic:</span> <span className="text-slate-300">{selected.tactic ?? '—'}</span></div>
            <div><span className="text-slate-500">Confidence:</span> <span className="text-cyber-cyan">{selected.confidence}%</span></div>
            <div><span className="text-slate-500">Evidence:</span> <span className="text-slate-300">{selected.evidence_ids.join(', ')}</span></div>
          </div>
          <button onClick={() => setSelected(null)} className="mt-4 flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /> Close</button>
        </SectionCard>
      )}
    </div>
  );
}
