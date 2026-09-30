"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Brain } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';

export function SettingsPage() {
  const { audio } = useApp();

  return (
    <div>
      <PageHeader title="Settings" subtitle="System configuration & preferences" icon={<Settings className="w-5 h-5" />} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Interface">
          <div className="space-y-4">
            <ToggleRow label="Dark Mode" desc="SOC-optimized dark theme" defaultOn />
            <ToggleRow label="Compact Mode" desc="Denser information layout" defaultOn={false} />
            <ToggleRow label="SOC Density" desc="Maximum information per screen" defaultOn />
            <SliderRow label="Animation Intensity" desc="Control motion effects" value={70} onChange={() => audio.play('click')} />
          </div>
        </SectionCard>

        <SectionCard title="Audio">
          <div className="space-y-4">
            <ToggleRow label="Sound" desc="Master sound toggle" defaultOn={audio.settings.enabled} onChange={() => audio.toggle()} />
            <SliderRow label="Master Volume" desc="Global volume control" value={Math.round(audio.settings.volume * 100)} onChange={() => audio.play('click')} />
            <ToggleRow label="Interaction Sounds" desc="Clicks and navigation" defaultOn={audio.settings.interactionSounds} onChange={() => audio.update({ interactionSounds: !audio.settings.interactionSounds })} />
            <ToggleRow label="Alert Sounds" desc="Security notifications" defaultOn={audio.settings.alertSounds} onChange={() => audio.update({ alertSounds: !audio.settings.alertSounds })} />
            <ToggleRow label="AI Processing Sounds" desc="AI investigation audio" defaultOn={audio.settings.aiSounds} onChange={() => audio.update({ aiSounds: !audio.settings.aiSounds })} />
          </div>
        </SectionCard>

        <SectionCard title="Security">
          <div className="space-y-4">
            <ToggleRow label="Session Persistence" desc="Remember secure session" defaultOn />
            <ToggleRow label="MFA Required" desc="Multi-factor authentication" defaultOn />
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-cyber-cyan/60" /><span className="text-sm text-slate-300">Access Level</span></div>
                <span className="font-mono text-xs text-cyber-cyan">L4 — Analyst</span>
              </div>
              <p className="text-[10px] text-slate-600 font-mono ml-6">Current clearance level</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="AI Configuration">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2"><Brain className="w-4 h-4 text-cyber-cyan/60" /><span className="text-sm text-slate-300">Response Style</span></div>
              <div className="flex gap-2 ml-6">
                {['Concise', 'Detailed', 'Technical'].map((style, i) => (
                  <button key={style} onClick={() => audio.play('click')}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors ${i === 1 ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40' : 'bg-ink-800/40 text-slate-500 border border-ink-700/50 hover:text-slate-300'}`}>
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow label="Evidence Display" desc="Show evidence in AI responses" defaultOn />
            <ToggleRow label="Confidence Display" desc="Show AI confidence scores" defaultOn />
            <ToggleRow label="Reasoning Display" desc="Show AI reasoning chain" defaultOn />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn, onChange }: { label: string; desc: string; defaultOn: boolean; onChange?: () => void }) {
  const { audio } = useApp();
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-300">{label}</div>
        <div className="text-[10px] text-slate-600 font-mono">{desc}</div>
      </div>
      <button
        onClick={() => { setOn(!on); if (onChange) onChange(); audio.play('click'); }}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? 'bg-cyber-cyan/30' : 'bg-ink-700'}`}>
        <motion.div className="absolute top-0.5 w-5 h-5 rounded-full" animate={{ left: on ? '22px' : '2px' }}
          style={{ background: on ? '#00e5ff' : '#334155' }} />
      </button>
    </div>
  );
}

function SliderRow({ label, desc, value, onChange }: { label: string; desc: string; value: number; onChange: () => void }) {
  const [val, setVal] = useState(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-sm text-slate-300">{label}</div>
          <div className="text-[10px] text-slate-600 font-mono">{desc}</div>
        </div>
        <span className="font-mono text-xs text-cyber-cyan">{val}%</span>
      </div>
      <input type="range" min={0} max={100} value={val}
        onChange={(e) => { setVal(Number(e.target.value)); onChange(); }}
        className="w-full h-1.5 bg-ink-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan" />
    </div>
  );
}
