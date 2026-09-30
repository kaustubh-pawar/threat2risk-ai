import { demoIncident } from '@/data/simData';
import type { RiskAssessment, WhatIfScenario } from '@/types';

const BASE_FACTORS = {
  technique_severity: 90,
  asset_criticality: 95,
  confidence: 91,
  blast_radius: 80,
  privilege_level: 85,
};

function weightedScore(factors: typeof BASE_FACTORS): number {
  const weights = { technique_severity: 0.25, asset_criticality: 0.25, confidence: 0.15, blast_radius: 0.15, privilege_level: 0.2 };
  return Math.round(
    factors.technique_severity * weights.technique_severity +
    factors.asset_criticality * weights.asset_criticality +
    factors.confidence * weights.confidence +
    factors.blast_radius * weights.blast_radius +
    factors.privilege_level * weights.privilege_level,
  );
}

export const riskService = {
  assess(incidentId?: string): RiskAssessment {
    const incident = demoIncident;
    if (incidentId && incidentId !== incident.id) {
      return { incident_id: incidentId, risk_score: 0, confidence: 0, factors: BASE_FACTORS, reasoning: 'Incident not found.', evidence_ids: [] };
    }
    return {
      incident_id: incident.id,
      risk_score: incident.risk_score,
      confidence: incident.confidence,
      factors: BASE_FACTORS,
      reasoning: 'Risk calculated from technique severity, asset criticality, correlation confidence, blast radius, and privilege level.',
      evidence_ids: incident.event_ids,
    };
  },

  whatIfMfa(): WhatIfScenario {
    const current = weightedScore(BASE_FACTORS);
    const reduced = { ...BASE_FACTORS, technique_severity: 55, privilege_level: 50, blast_radius: 45, confidence: 75 };
    const newRisk = weightedScore(reduced);
    return {
      control: 'MFA',
      current_value: 'Disabled',
      what_if_value: 'Enabled',
      current_risk: current,
      new_risk: newRisk,
      risk_reduction: current - newRisk,
      explanation: 'MFA would block authentication after brute-force attempts, preventing privilege escalation and downstream attack stages.',
    };
  },

  getFactorsForDisplay() {
    return demoIncident.riskFactors ?? [];
  },
};
