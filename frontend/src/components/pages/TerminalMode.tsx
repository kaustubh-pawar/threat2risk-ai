"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Send } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { demoIncident } from '@/data/simData';

interface Line { text: string; type: 'cmd' | 'output' | 'result' }

export function TerminalMode() {
  const { audio } = useApp();
  const [lines, setLines] = useState<Line[]>([
    { text: 'THREAT2RISK TERMINAL v2.4.1', type: 'output' },
    { text: 'Type "help" for available commands.', type: 'output' },
    { text: '', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const runCommand = (cmd: string) => {
    audio.play('terminalType');
    setLines((prev) => [...prev, { text: `$ ${cmd}`, type: 'cmd' }]);

    const lower = cmd.toLowerCase().trim();

    if (lower === 'help') {
      setLines((prev) => [...prev,
        { text: 'Available commands:', type: 'output' },
        { text: '  investigate --incident <ID>   Investigate an incident', type: 'output' },
        { text: '  show alerts [--severity <S>]   Show alerts', type: 'output' },
        { text: '  show risk                     Show risk score', type: 'output' },
        { text: '  show mitre                    Show MITRE techniques', type: 'output' },
        { text: '  show assets                   Show affected assets', type: 'output' },
        { text: '  show narrative                Show attack narrative', type: 'output' },
        { text: '  clear                         Clear terminal', type: 'output' },
        { text: '', type: 'output' },
      ]);
      return;
    }

    if (lower === 'clear') { setLines([]); return; }

    if (lower.startsWith('investigate')) {
      setProcessing(true);
      const steps = [
        'Loading evidence...', 'Correlating events...', 'Reconstructing timeline...', 'Mapping behaviors...', 'Calculating risk...',
      ];
      steps.forEach((step, i) => {
        setTimeout(() => {
          audio.play('timelineTick');
          setLines((prev) => [...prev, { text: `> ${step}`, type: 'output' }]);
          if (i === steps.length - 1) {
            setTimeout(() => {
              setLines((prev) => [...prev,
                { text: '[████████████████████] 100%', type: 'output' },
                { text: '', type: 'output' },
                { text: `RISK: ${demoIncident.severity.toUpperCase()}`, type: 'result' },
                { text: `SCORE: ${demoIncident.risk_score}`, type: 'result' },
                { text: `CONFIDENCE: ${demoIncident.confidence}%`, type: 'result' },
                { text: `AFFECTED ASSETS: ${demoIncident.affected_assets.length}`, type: 'result' },
                { text: `MITRE TECHNIQUES: ${(demoIncident.mitre ?? []).length}`, type: 'result' },
                { text: '', type: 'output' },
              ]);
              setProcessing(false);
              audio.play('success');
            }, 500);
          }
        }, i * 500);
      });
      return;
    }

    if (lower.startsWith('show alerts')) {
      setLines((prev) => [...prev,
        { text: 'TIME     ALERT                          SEVERITY   STATUS', type: 'output' },
        { text: '─────────────────────────────────────────────────────────', type: 'output' },
        ...(demoIncident.timeline ?? []).map((e) => ({ text: `${e.time}  ${e.title.padEnd(30)} ${e.severity.toUpperCase().padEnd(10)} CORRELATED`, type: 'output' as const })),
        { text: '', type: 'output' },
      ]);
      return;
    }

    if (lower === 'show risk') {
      setLines((prev) => [...prev,
        { text: `RISK SCORE: ${demoIncident.risk_score} / 100`, type: 'result' },
        { text: `SEVERITY: ${demoIncident.severity.toUpperCase()}`, type: 'result' },
        { text: '', type: 'output' },
        ...(demoIncident.riskFactors ?? []).map((f) => ({ text: `${f.name.padEnd(25)} ${'█'.repeat(Math.floor(f.score / 10))} ${f.score}`, type: 'output' as const })),
        { text: '', type: 'output' },
      ]);
      return;
    }

    if (lower === 'show mitre') {
      setLines((prev) => [...prev,
        ...(demoIncident.mitre ?? []).map((m) => ({ text: `${m.techniqueId}  ${m.tactic.padEnd(25)} ${m.technique}  [${m.confidence}%]`, type: 'output' as const })),
        { text: '', type: 'output' },
      ]);
      return;
    }

    if (lower === 'show assets') {
      setLines((prev) => [...prev,
        ...demoIncident.affected_assets.map((a) => ({ text: `  ${a}  —  CRITICAL`, type: 'output' as const })),
        { text: '', type: 'output' },
      ]);
      return;
    }

    if (lower === 'show narrative') {
      setLines((prev) => [...prev,
        ...(demoIncident.narrative ?? []).map((n) => ({ text: `[${n.label.toUpperCase()}] ${n.text}`, type: 'output' as const })),
        { text: '', type: 'output' },
      ]);
      return;
    }

    setLines((prev) => [...prev, { text: `Unknown command: ${cmd}. Type "help" for available commands.`, type: 'output' }, { text: '', type: 'output' }]);
  };

  const handleSubmit = () => {
    if (!input.trim() || processing) return;
    runCommand(input);
    setInput('');
  };

  return (
    <div>
      <PageHeader title="Terminal Mode" subtitle="Investigation terminal — visual interaction layer" icon={<TerminalIcon className="w-5 h-5" />} />
      <div className="glass-panel-strong p-4 h-[600px] flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-sm space-y-0.5">
          <AnimatePresence>
            {lines.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={line.type === 'cmd' ? 'text-cyber-green' : line.type === 'result' ? 'text-risk-critical font-bold' : 'text-slate-400'}>
                {line.text || '\u00A0'}
              </motion.div>
            ))}
          </AnimatePresence>
          {processing && <div className="text-cyber-cyan"><span className="inline-block w-2 h-4 bg-cyber-cyan animate-blink align-middle" /></div>}
        </div>
        <div className="mt-3 pt-3 border-t border-ink-700 flex items-center gap-2">
          <span className="font-mono text-cyber-green text-sm">$</span>
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); audio.play('terminalType'); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            disabled={processing}
            placeholder="enter command... (try: investigate --incident TR-2026-0017)"
            className="flex-1 bg-transparent font-mono text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
          />
          <button onClick={handleSubmit} disabled={!input.trim() || processing} className="text-cyber-cyan disabled:opacity-30"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
