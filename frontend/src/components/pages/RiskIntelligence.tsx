"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, TrendingUp, AlertTriangle } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { useSelectedIncident } from '@/hooks/useSelectedIncident';
import { useCountUp } from '@/hooks/useAnimations';
import type { RiskFactor } from '@/types';

export function RiskIntelligence() {
  const { audio } = useApp();
  const { incident, risk } = useSelectedIncident();
  const score = useCountUp(risk.risk_score, 2000);
  const [factorsLoaded, setFactorsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setFactorsLoaded(true);
      audio.play('riskEscalate');
    }, 500);
    return () => clearTimeout(t);
  }, [audio]);

  return (
    <div>
      <PageHeader
        title="Explainable Risk Intelligence"
        subtitle={`Incident ${incident.id} · Risk breakdown & reasoning`}
        icon={<Gauge className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Risk Engine Visualization">
          <RadialRiskViz score={score} factors={incident.riskFactors ?? []} factorsLoaded={factorsLoaded} />
        </SectionCard>

        <SectionCard title="Risk Factor Breakdown">
          <div className="space-y-4">
            {(incident.riskFactors ?? []).map((factor, i) => (
              <RiskFactorBar key={factor.name} factor={factor} index={i} loaded={factorsLoaded} />
            ))}
            <div className="pt-4 border-t border-ink-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Risk Score</span>
                <span className="text-3xl font-bold font-mono text-risk-critical">
                  {score}<span className="text-lg text-slate-600">/100</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="severity-critical">CRITICAL</span>
                <span className="text-xs text-slate-500 font-mono">— 6 weighted factors</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="mt-6" title="Why? — Risk Reasoning">
        <div className="p-4 rounded-lg bg-ink-800/40 border border-ink-700/50">
          <p className="text-sm text-slate-300 leading-relaxed">
            The risk is <span className="text-risk-critical font-semibold">Critical</span> because the activity involves
            a <span className="text-cyber-cyan">privileged account</span> (Domain Admin), a
            <span className="text-cyber-cyan"> high-value database</span> containing customer PII,
            <span className="text-cyber-cyan"> sensitive information</span>, and a
            <span className="text-cyber-cyan"> suspicious outbound data transfer</span> of 2.3 GB following
            privilege escalation. The 6-stage attack progression chain, combined with the confirmed exfiltration
            activity, places this incident in the Critical tier. A single factor alone would not reach Critical —
            it is the combination that elevates the risk.
          </p>
        </div>
      </SectionCard>

      <SectionCard className="mt-6" title="Business Impact Translation">
        <div className="space-y-4">
          {[
            {
              tech: 'Database Access',
              asset: 'Customer Database (DB-SRV-01)',
              impact: 'Potential exposure of sensitive customer information (45,000 records)',
              severity: 'critical' as const,
            },
            {
              tech: 'Privileged Account Compromise',
              asset: 'Domain Controller (AD-DC-01)',
              impact: 'Potential operational and financial impact — attacker has Domain Admin access',
              severity: 'critical' as const,
            },
            {
              tech: 'PowerShell Execution',
              asset: 'Application Server (APP-SRV-02)',
              impact: 'Potential lateral movement and further system compromise',
              severity: 'high' as const,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Technical Event</div>
                <div className="text-sm text-slate-200">{item.tech}</div>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-cyber-violet/5 border border-cyber-violet/20">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyber-violet/70 mb-1">Affected Asset</div>
                <div className="text-sm text-slate-200">{item.asset}</div>
              </div>
              <div className={`flex-1 p-3 rounded-lg ${item.severity === 'critical' ? 'bg-risk-critical/5 border-risk-critical/20' : 'bg-risk-high/5 border-risk-high/20'}`}>
                <div className={`font-mono text-[10px] uppercase tracking-wider mb-1 ${item.severity === 'critical' ? 'text-risk-critical/70' : 'text-risk-high/70'}`}>Business Consequence</div>
                <div className="text-sm text-slate-200">{item.impact}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      <SectionCard className="mt-6" title="Potential Control Gap">
        <div className="p-4 rounded-lg bg-risk-high/5 border border-risk-high/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-risk-high flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Privileged account compromised</h3>
              <p className="text-xs text-slate-400 mb-2">
                <span className="text-risk-high font-semibold">Potential area requiring review:</span> Privileged Access Controls
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-300 font-semibold">Why?</span> The incident involved unauthorized activity
                through a privileged account. Review whether PAM controls adequately monitored and alerted on this
                access pattern, and whether MFA was enforced for privileged sessions.
              </p>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function RadialRiskViz({
  score,
  factors,
  factorsLoaded,
}: {
  score: number;
  factors: RiskFactor[];
  factorsLoaded: boolean;
}) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 110;
  const minRadius = 50;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="relative">
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={minRadius + (maxRadius - minRadius) * r}
            fill="none"
            stroke="rgba(0,229,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {factors.map((factor, i) => {
          const angle = (i / factors.length) * Math.PI * 2 - Math.PI / 2;
          const value = factorsLoaded ? factor.score / 100 : 0;
          const radius = minRadius + (maxRadius - minRadius) * value;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const nextAngle = ((i + 1) / factors.length) * Math.PI * 2 - Math.PI / 2;
          const nextRadius = minRadius + (maxRadius - minRadius) * (factorsLoaded ? factors[(i + 1) % factors.length].score / 100 : 0);
          const nextX = center + Math.cos(nextAngle) * nextRadius;
          const nextY = center + Math.sin(nextAngle) * nextRadius;
          return (
            <g key={factor.name}>
              <motion.path
                d={`M ${center} ${center} L ${x} ${y} L ${nextX} ${nextY} Z`}
                fill={`rgba(0, 229, 255, ${0.05 + value * 0.1})`}
                stroke="rgba(0,229,255,0.2)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              />
              <text
                x={center + Math.cos(angle) * (maxRadius + 20)}
                y={center + Math.sin(angle) * (maxRadius + 20)}
                fill="rgba(148,163,184,0.7)"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {factor.name.split(' ').map((w, j) => (
                  <tspan key={j} x={center + Math.cos(angle) * (maxRadius + 20)} dy={j === 0 ? -5 : 10}>
                    {w}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}

        <circle cx={center} cy={center} r={minRadius - 8} fill="rgba(10,14,22,0.9)" stroke="rgba(255,45,85,0.3)" strokeWidth="1.5" />
        <text x={center} y={center - 8} fill="rgba(148,163,184,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">
          RISK SCORE
        </text>
        <text x={center} y={center + 12} fill="#ff2d55" fontSize="28" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          {score}
        </text>
        <text x={center} y={center + 28} fill="rgba(148,163,184,0.5)" fontSize="9" fontFamily="monospace" textAnchor="middle">
          / 100
        </text>
      </svg>
      <div className="mt-2 flex items-center gap-2">
        <span className="severity-critical">CRITICAL</span>
        <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
          <TrendingUp className="w-3 h-3" /> 6 factors analyzed
        </span>
      </div>
    </div>
  );
}

function RiskFactorBar({
  factor,
  index,
  loaded,
}: {
  factor: RiskFactor;
  index: number;
  loaded: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-300">{factor.name}</span>
        <span className="font-mono text-sm text-cyber-cyan">{factor.score}</span>
      </div>
      <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan/60 to-cyber-cyan"
          initial={{ width: 0 }}
          animate={{ width: loaded ? `${factor.score}%` : '0%' }}
          transition={{ duration: 1, delay: index * 0.1 }}
        />
      </div>
      <div className="text-[10px] font-mono text-slate-600 mt-0.5">{factor.label}</div>
    </div>
  );
}
