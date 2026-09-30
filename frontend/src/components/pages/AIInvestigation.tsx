"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Loader2, CheckCircle2, AlertTriangle, Lightbulb, Gauge, ChevronRight } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { aiQueries, suggestedQueries } from '@/data/simData';
import type { AIQuery } from '@/types';

export function AIInvestigation() {
  const { audio } = useApp();
  const [queries, setQueries] = useState<AIQuery[]>(aiQueries);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [queries, processing]);

  const handleAsk = (question: string) => {
    if (!question.trim()) return;
    audio.play('click');
    setInput('');
    setProcessing(true);
    audio.play('aiProcessing');

    setTimeout(() => {
      const response: AIQuery = {
        id: `AIQ-${Date.now()}`,
        question,
        answer: generateAnswer(question),
        evidence: generateEvidence(question),
        reasoning: generateReasoning(question),
        riskImpact: 'CRITICAL — Privileged account with access to customer data and evidence of data exfiltration.',
        recommendedAction: 'Validate the admin01 session immediately. If unauthorized, disable the account and isolate affected assets.',
        confidence: 87,
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      };
      setQueries((prev) => [...prev, response]);
      setProcessing(false);
      audio.play('success');
    }, 2200);
  };

  return (
    <div>
      <PageHeader title="Threat2Risk AI Investigator" subtitle="Ask questions about your security evidence" icon={<Brain className="w-5 h-5" />} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <SectionCard>
            <div ref={scrollRef} className="h-[500px] overflow-y-auto space-y-4 pr-2">
              {queries.map((q) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex justify-end mb-3">
                    <div className="max-w-[80%] px-4 py-2.5 rounded-lg bg-ink-800/60 border border-ink-600 text-sm text-slate-200">
                      {q.question}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-cyber-cyan" />
                    </div>
                    <AIResponse query={q} />
                  </div>
                </motion.div>
              ))}
              {processing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-cyber-cyan animate-spin" />
                  </div>
                  <div className="glass-panel p-4 flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-pulseGlow" />
                      AI investigating...
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-600">
                      <div>Scanning evidence corpus...</div>
                      <div>Correlating events...</div>
                      <div>Analyzing risk factors...</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-ink-700">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyber-cyan text-sm">&gt;</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(input); }}
                  placeholder="ask about your security evidence..."
                  className="flex-1 bg-ink-800/60 border border-ink-600 rounded-lg px-3 py-2.5 font-mono text-sm text-slate-200 focus:border-cyber-cyan/40 focus:outline-none"
                />
                <button onClick={() => handleAsk(input)} disabled={!input.trim() || processing}
                  className="btn-cyber disabled:opacity-50"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Suggested Queries">
            <div className="space-y-2">
              {suggestedQueries.map((q, i) => (
                <motion.button key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => handleAsk(q)} onMouseEnter={() => audio.play('click')}
                  className="w-full text-left px-3 py-2.5 rounded-lg bg-ink-800/40 border border-ink-700/50 hover:border-cyber-cyan/30 hover:bg-ink-800/60 transition-all group">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyber-cyan transition-colors" />
                    <span className="text-xs text-slate-400 group-hover:text-cyber-cyan transition-colors">{q}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="mt-4">
            <div className="text-center">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">AI Confidence</div>
              <div className="text-3xl font-bold font-mono text-cyber-cyan">87%</div>
              <div className="text-xs text-slate-500 mt-1">Evidence strength: HIGH</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function AIResponse({ query }: { query: AIQuery }) {
  return (
    <div className="glass-panel-strong p-4 flex-1 max-w-[85%] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent" />
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-ink-700/50">
        <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">Threat2Risk Intelligence Response</span>
        <span className="font-mono text-[10px] text-slate-600">{query.timestamp}</span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" /><span className="font-mono text-[10px] uppercase tracking-wider text-cyber-green/70">Finding</span></div>
          <p className="text-sm text-slate-200">{query.answer}</p>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Confidence</span>
            <div className="text-lg font-bold font-mono text-cyber-cyan">{query.confidence}%</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1"><AlertTriangle className="w-3.5 h-3.5 text-cyber-cyan" /><span className="font-mono text-[10px] uppercase tracking-wider text-cyber-cyan/70">Evidence</span></div>
          <ul className="space-y-1">
            {query.evidence.map((e, i) => (
              <li key={i} className="text-xs text-slate-400 font-mono flex items-start gap-2"><span className="text-cyber-cyan">•</span> {e}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1"><Brain className="w-3.5 h-3.5 text-cyber-violet" /><span className="font-mono text-[10px] uppercase tracking-wider text-cyber-violet/70">Reasoning</span></div>
          <p className="text-xs text-slate-400">{query.reasoning}</p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1"><Gauge className="w-3.5 h-3.5 text-risk-critical" /><span className="font-mono text-[10px] uppercase tracking-wider text-risk-critical/70">Risk Impact</span></div>
          <p className="text-xs text-slate-300">{query.riskImpact}</p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1"><Lightbulb className="w-3.5 h-3.5 text-risk-high" /><span className="font-mono text-[10px] uppercase tracking-wider text-risk-high/70">Recommended Action</span></div>
          <p className="text-xs text-slate-300">{query.recommendedAction}</p>
          <div className="mt-1 text-[10px] font-mono text-slate-600">Recommended by AI — Awaiting analyst validation</div>
        </div>
      </div>
    </div>
  );
}

function generateAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('asset') || lower.includes('affect')) return 'Three assets are affected: DB-SRV-01 (Customer Database), APP-SRV-02, and AD-DC-01 (Domain Controller). The customer database is the most critical with a risk score of 95/100.';
  if (lower.includes('next') || lower.includes('investigate')) return 'The analyst should: 1) Validate the admin01 session, 2) Review PowerShell execution evidence, 3) Inspect database access logs, 4) Assess the outbound data transfer destination.';
  if (lower.includes('summary') || lower.includes('executive')) return 'A privileged account (admin01) was likely compromised after brute-force attempts. The attacker escalated to Domain Admin, executed PowerShell, accessed the customer database (45,000 records), and exfiltrated 2.3 GB to an external IP. Risk: Critical (92/100).';
  if (lower.includes('control') || lower.includes('review')) return 'Privileged Access Controls are the primary area requiring review. The incident involved unauthorized activity through a privileged account — review whether PAM controls and MFA for privileged sessions are adequate.';
  return 'Based on the evidence, the incident shows a multi-stage attack: credential compromise → privilege escalation → execution → data access → exfiltration. The risk is Critical (92/100) due to the combination of privileged access, sensitive data, and confirmed exfiltration.';
}

function generateEvidence(q: string): string[] {
  const lower = q.toLowerCase();
  if (lower.includes('asset') || lower.includes('affect')) return ['DB-SRV-01 — Risk score 95/100', 'APP-SRV-02 — Risk score 78/100', 'AD-DC-01 — Risk score 82/100'];
  return ['SEC-2026-04412 — Failed login (5 attempts)', 'SEC-2026-04413 — Successful login', 'SEC-2026-04418 — Privilege escalation', 'SEC-2026-04425 — PowerShell execution', 'SEC-2026-04433 — Database access', 'SEC-2026-04441 — Data transfer (2.3 GB)'];
}

function generateReasoning(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes('asset')) return 'Asset risk is determined by criticality, data sensitivity, and exposure level. The customer database scores highest because it contains PII and was directly accessed during the incident.';
  if (lower.includes('control')) return 'The attacker used a privileged account without triggering PAM alerts. This suggests the monitoring threshold for privileged sessions may need review, and MFA for Domain Admin access should be verified.';
  return 'The sequence follows a known attack pattern. The 7-minute window and progression from failed to successful authentication strongly suggest account compromise. Each step builds on the previous one, creating a coherent attack chain.';
}
