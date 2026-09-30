import { securityEvents } from '@/data/simData';
import type { SecurityEvent, Severity } from '@/types';

export interface EventFilters {
  search?: string;
  severity?: Severity | 'all';
  source?: string | 'all';
  event_type?: string | 'all';
}

export const eventsService = {
  getAll(): SecurityEvent[] {
    return securityEvents;
  },

  getById(id: string): SecurityEvent | undefined {
    return securityEvents.find((e) => e.id === id);
  },

  getByIncidentEventIds(eventIds: string[]): SecurityEvent[] {
    return securityEvents.filter((e) => eventIds.includes(e.id));
  },

  filter(filters: EventFilters): SecurityEvent[] {
    return securityEvents.filter((event) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [
          event.id, event.source, event.event_type, event.user,
          event.source_ip, event.host, event.asset, event.raw_log,
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.severity && filters.severity !== 'all' && event.severity !== filters.severity) return false;
      if (filters.source && filters.source !== 'all' && event.source !== filters.source) return false;
      if (filters.event_type && filters.event_type !== 'all' && event.event_type !== filters.event_type) return false;
      return true;
    });
  },

  getSources(): string[] {
    return [...new Set(securityEvents.map((e) => e.source))];
  },

  getEventTypes(): string[] {
    return [...new Set(securityEvents.map((e) => e.event_type))];
  },
};
