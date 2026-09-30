import { incidents, demoIncident, DEMO_INCIDENT_ID } from '@/data/simData';
import type { Incident } from '@/types';

export const incidentsService = {
  getAll(): Incident[] {
    return incidents;
  },

  getById(id: string): Incident | undefined {
    return incidents.find((i) => i.id === id) ?? (id === DEMO_INCIDENT_ID ? demoIncident : undefined);
  },

  getDefault(): Incident {
    return demoIncident;
  },

  getActiveCount(): number {
    return incidents.filter((i) => i.status === 'under_investigation' || i.status === 'open').length;
  },
};
