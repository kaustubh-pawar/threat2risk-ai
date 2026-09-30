"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Search, Shield, Wrench, ClipboardCheck, CheckCircle2, Clock, User } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { demoIncident } from '@/data/simData';
import { severityClass, severityText } from '@/utils/severity';
import type { RecommendationCategory } from '@/types';

const categoryConfig: Record<RecommendationCategory, { icon: typeof Search; label: string; color: string }> = {
  investigation: { icon: Search, label: 'Investigation', color: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10' },
  containment: { icon: Shield, label: 'Containment', color: 'text-risk-high border-risk-high/30 bg-risk-high/10' },
  remediation: { icon: Wrench, label: 'Remediation', color: 'text-cyber-green border-cyber-green/30 bg-cyber-green/10' },
  control_review: { icon: ClipboardCheck, label: 'Control Review', color: 'text-cyber-violet border-cyber-violet/30 bg-cyber-violet/10' },
};

export function Recommendations() {
  const { audio } = useApp();
  const [validated, setValidated] = useState<Set<number>>(new Set());

  const toggleValidate = (id: number) => {
    setValidated((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    audio.play('click');
  };

  const categories = Object.keys(categoryConfig) as RecommendationCategory[];

  return (
    <div>
      <PageHeader title="Recommendations Engine" subtitle={`Incident ${demoIncident.id} · AI-recommended actions`} icon={<Lightbulb className="w-5 h-5" />} />

      <SectionCard className="mb-6">
        <div className="flex items-center gap-4">
          {[
            { label: 'AI Analysis', icon: Lightbulb },
            { label: 'AI Recommendation', icon: Lightbulb },
            { label: 'Analyst Validation', icon: User },
            { label: 'Analyst Action', icon: CheckCircle2 },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border flex-1 ${i < 2 ? 'border-cyber-cyan/30 bg-cyber-cyan/5' : 'border-ink-600 bg-ink-800/40'}`}>
                  <Icon className={`w-4 h-4 ${i < 2 ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${i < 2 ? 'text-cyber-cyan' : 'text-slate-500'}`}>{step.label}</span>
                </div>
                {i < 3 && <span className="text-slate-600">→</span>}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500 font-mono">AI recommends. The security analyst decides. No autonomous destructive actions are performed.</p>
      </SectionCard>

      {categories.map((cat) => {
        const cfg = categoryConfig[cat];
        const Icon = cfg.icon;
        const items = (demoIncident.recommendations ?? []).filter((r) => r.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${cfg.color}`}><Icon className="w-4 h-4" /></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{cfg.label}</h3>
            </div>
            <div className="space-y-2">
              {items.map((rec, i) => {
                const isValidated = validated.has(rec.id);
                return (
                  <motion.div key={rec.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${isValidated ? 'border-cyber-green/30 bg-cyber-green/5' : 'border-ink-700/50 bg-ink-800/30'}`}>
                    <span className="font-mono text-2xl font-bold text-slate-700 w-8 text-center">{String(rec.id).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-200">{rec.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={severityClass(rec.priority)}>{severityText(rec.priority)}</span>
                        {isValidated ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyber-green"><CheckCircle2 className="w-3 h-3" /> Validated by analyst</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500"><Clock className="w-3 h-3" /> Recommended by AI — Awaiting analyst validation</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => toggleValidate(rec.id)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider border transition-all ${
                        isValidated ? 'border-cyber-green/40 text-cyber-green bg-cyber-green/10' : 'border-ink-600 text-slate-400 hover:border-cyber-cyan/40 hover:text-cyber-cyan'
                      }`}>
                      {isValidated ? 'Validated' : 'Validate'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
