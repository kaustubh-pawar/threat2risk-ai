import { attackGraphNodes, attackGraphEdges, demoIncident, mitreTechniques } from '@/data/simData';
import type { AttackGraphNode, AttackGraphEdge, MitreTechnique } from '@/types';

export const mitreService = {
  getTechniques(incidentId?: string): MitreTechnique[] {
    if (incidentId && incidentId !== demoIncident.id) return [];
    return mitreTechniques;
  },

  getMappings(incidentId?: string) {
    if (incidentId && incidentId !== demoIncident.id) return [];
    return demoIncident.mitre ?? [];
  },
};

export const attackGraphService = {
  getNodes(incidentId?: string): AttackGraphNode[] {
    if (incidentId && incidentId !== demoIncident.id) return [];
    return attackGraphNodes;
  },

  getEdges(incidentId?: string): AttackGraphEdge[] {
    if (incidentId && incidentId !== demoIncident.id) return [];
    return attackGraphEdges;
  },
};
