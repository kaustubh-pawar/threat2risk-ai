import { demoIncident, affectedAssets } from '@/data/simData';
import type { BlastRadius } from '@/types';

export const blastRadiusService = {
  compute(incidentId?: string): BlastRadius {
    const incident = demoIncident;
    if (incidentId && incidentId !== incident.id) {
      return { incident_id: incidentId, compromised_user: '', chain: [], affected_assets: [], critical_assets: [], affected_users: [], potential_spread: [] };
    }

    const related = affectedAssets.filter((a) => a.relatedIncidents.includes(incident.id));

    return {
      incident_id: incident.id,
      compromised_user: incident.affected_users[0] ?? 'unknown',
      chain: [
        { type: 'user', name: incident.affected_users[0] ?? 'analyst' },
        { type: 'host', name: 'WORKSTATION-01' },
        { type: 'server', name: 'FILE-SRV-01' },
        { type: 'database', name: 'Customer Database' },
      ],
      affected_assets: related.map((a) => a.name),
      critical_assets: related.filter((a) => a.criticality === 'critical').map((a) => a.name),
      affected_users: incident.affected_users,
      potential_spread: ['CRM-APP-01', 'AWS-PROD-ACCOUNT', 'All domain-joined workstations'],
    };
  },
};
