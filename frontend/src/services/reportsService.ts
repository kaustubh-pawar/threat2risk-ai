import { demoIncident } from '@/data/simData';
import { riskService } from '@/services/riskService';
import { blastRadiusService } from '@/services/blastRadiusService';
import { grcService } from '@/services/grcService';
import { evidenceService } from '@/services/evidenceService';

export const reportsService = {
  generateSummary(incidentId: string) {
    const incident = incidentId === demoIncident.id ? demoIncident : null;
    if (!incident) return null;

    const risk = riskService.assess(incidentId);
    const blast = blastRadiusService.compute(incidentId);
    const grc = grcService.getControlGaps(incidentId);
    const evidence = evidenceService.getByIncident();

    return {
      incident_summary: { id: incident.id, title: incident.title, severity: incident.severity, status: incident.status },
      attack_timeline: incident.timeline ?? [],
      affected_assets: incident.affected_assets,
      mitre_techniques: incident.mitre ?? [],
      risk_score: risk.risk_score,
      confidence: risk.confidence,
      blast_radius: blast,
      evidence,
      grc_findings: grc,
      recommended_actions: incident.recommendations ?? [],
    };
  },
};
