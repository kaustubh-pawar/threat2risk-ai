import { alerts } from '@/data/simData';
import type { Alert, Severity } from '@/types';

export interface AlertFilters {
  search?: string;
  severity?: Severity | 'all';
  status?: Alert['status'] | 'all';
}

export const alertsService = {
  getAll(): Alert[] {
    return alerts;
  },

  getById(id: string): Alert | undefined {
    return alerts.find((a) => a.id === id);
  },

  getByIncident(incidentId: string): Alert[] {
    return alerts.filter((a) => a.related_incident === incidentId);
  },

  filter(filters: AlertFilters): Alert[] {
    return alerts.filter((alert) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [alert.id, alert.rule, alert.name, alert.user, alert.source_ip, alert.host, alert.source].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.severity && filters.severity !== 'all' && alert.severity !== filters.severity) return false;
      if (filters.status && filters.status !== 'all' && alert.status !== filters.status) return false;
      return true;
    });
  },

  getCriticalCount(): number {
    return alerts.filter((a) => a.severity === 'critical').length;
  },
};
