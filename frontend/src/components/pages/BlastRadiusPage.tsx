"use client";

import { motion } from 'framer-motion';
import { Radio, Server, User, ArrowDown, Shield } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';

export function BlastRadiusPage() {
  const { incident, blastRadius } = useSelectedIncident();

  return (
    <div>
      <PageHeader title="Blast Radius" subtitle={`Incident ${incident.id} · Potential impact spread analysis`} icon={<Radio className="w-5 h-5" />} />

      <SectionCard className="mb-6" title="Compromise Chain">
        <div className="flex flex-col items-center py-6">
          {blastRadius.chain.map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="px-6 py-3 rounded-lg bg-ink-800/60 border border-cyber-cyan/30 text-center">
                <div className="font-mono text-[10px] uppercase text-slate-500">{item.type}</div>
                <div className="text-sm font-bold text-white mt-1">{item.name}</div>
              </motion.div>
              {i < blastRadius.chain.length - 1 && <ArrowDown className="w-5 h-5 text-cyber-cyan/50 my-2" />}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SectionCard title="Affected Assets">
          <div className="space-y-2">
            {blastRadius.affected_assets.map((a) => (
              <div key={a} className="flex items-center gap-2 font-mono text-xs text-slate-300"><Server className="w-3.5 h-3.5 text-cyber-cyan/60" />{a}</div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Critical Assets">
          <div className="space-y-2">
            {blastRadius.critical_assets.map((a) => (
              <div key={a} className="flex items-center gap-2 font-mono text-xs text-risk-critical"><Shield className="w-3.5 h-3.5" />{a}</div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Affected Users">
          <div className="space-y-2">
            {blastRadius.affected_users.map((u) => (
              <div key={u} className="flex items-center gap-2 font-mono text-xs text-slate-300"><User className="w-3.5 h-3.5 text-cyber-cyan/60" />{u}</div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Potential Spread">
          <div className="space-y-2">
            {blastRadius.potential_spread.map((s) => (
              <div key={s} className="font-mono text-xs text-slate-400 p-2 rounded bg-ink-800/40 border border-ink-700/50">{s}</div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
