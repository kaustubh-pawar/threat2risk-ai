import { evidenceRecords } from '@/data/simData';
import type { EvidenceRecord } from '@/types';

export const evidenceService = {
  getAll(): EvidenceRecord[] {
    return evidenceRecords;
  },

  getById(id: string): EvidenceRecord | undefined {
    return evidenceRecords.find((e) => e.id === id);
  },

  getByCategory(category: EvidenceRecord['category']): EvidenceRecord[] {
    return evidenceRecords.filter((e) => e.category === category);
  },

  getByIncident(): EvidenceRecord[] {
    return evidenceRecords;
  },
};
