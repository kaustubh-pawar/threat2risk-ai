"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, X, CheckCircle2 } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { demoIncident } from '@/data/simData';

const mitreTactics = [
  'Initial Access',
  'Execution',
  'Persistence',
  'Privilege Escalation',
  'Defense Evasion',
  'Credential Access',
  'Discovery',
  'Lateral Movement',
  'Collection',
  'Command & Control',
  'Exfiltration',
  'Impact',
];

export function MitreAttack() {
  const { audio } = useApp();
  const { incident, mitreMappings } = useSelectedIncident();
  const [selected, setSelected] = useState<number | null>(null);

  const observedTactics = mitreMappings.map((m) => m.tactic);

  return (
    <div>
      <PageHeader
        title="MITRE ATT&CK Mapping"
        subtitle={`Incident ${incident.id} · Observed behaviors mapped to attacker tactics & techniques`}
        icon={<Crosshair className="w-5 h-5" />}
      />

      <SectionCard title="ATT&CK Matrix — Observed Techniques">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {mitreTactics.map((tactic, i) => {
            const isObserved = observedTactics.includes(tactic);
            const technique = (demoIncident.mitre ?? []).find((m) => m.tactic === tactic);
            return (
              <motion.div
                key={tactic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  if (technique && demoIncident.mitre) {
                    const idx = demoIncident.mitre.indexOf(technique);
                    setSelected(idx);
                    audio.play('click');
                  }
                }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isObserved
                    ? 'border-cyber-violet/40 bg-cyber-violet/10 hover:bg-cyber-violet/15 hover:shadow-glow-violet'
                    : 'border-ink-700/50 bg-ink-800/20 opacity-40'
                }`}
              >
                <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-1">{tactic}</div>
                {isObserved && technique ? (
                  <div>
                    <div className="text-xs font-semibold text-cyber-violet">{technique.technique}</div>
                    <div className="font-mono text-[10px] text-slate-500 mt-0.5">{technique.techniqueId}</div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600">—</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {(demoIncident.mitre ?? []).map((mapping, i) => (
          <motion.div
            key={mapping.techniqueId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SectionCard>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-cyber-violet font-bold">{mapping.techniqueId}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/30">
                      {mapping.tactic}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{mapping.technique}</h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Confidence</div>
                  <div className="text-lg font-bold font-mono text-cyber-cyan">{mapping.confidence}%</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">{mapping.description}</p>
              <div className="space-y-2">
                <div className="p-2 rounded bg-ink-800/40 border border-ink-700/50">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-1">Observed Evidence</div>
                  <div className="text-xs text-slate-300">{mapping.evidence}</div>
                </div>
                <div className="p-2 rounded bg-ink-800/40 border border-ink-700/50">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-1">Affected Asset</div>
                  <div className="text-xs text-slate-300 font-mono">{mapping.affectedAsset}</div>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && demoIncident.mitre && demoIncident.mitre[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel-strong p-6 max-w-lg w-full relative"
            >
              <button onClick={() => { setSelected(null); audio.play('click'); }} className="absolute top-4 right-4 p-1 rounded hover:bg-ink-700 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-sm text-cyber-violet font-bold">{demoIncident.mitre[selected].techniqueId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/30">
                  {demoIncident.mitre[selected].tactic}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{demoIncident.mitre[selected].technique}</h3>
              <p className="text-sm text-slate-400 mb-4">{demoIncident.mitre[selected].description}</p>
              <div className="space-y-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-1">Observed Evidence</div>
                  <div className="text-sm text-slate-200 p-3 rounded bg-ink-800/40 border border-ink-700/50">{demoIncident.mitre[selected].evidence}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-1">Affected Asset</div>
                  <div className="text-sm text-slate-200 p-3 rounded bg-ink-800/40 border border-ink-700/50 font-mono">{demoIncident.mitre[selected].affectedAsset}</div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded bg-cyber-cyan/5 border border-cyber-cyan/20">
                  <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-sm text-slate-300">AI Confidence: <span className="font-mono font-bold text-cyber-cyan">{demoIncident.mitre[selected].confidence}%</span></span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
