import { grcControlGaps } from '@/data/simData';
import type { GrcControlGap } from '@/types';

export const grcService = {
  getControlGaps(incidentId?: string): GrcControlGap[] {
    if (incidentId && incidentId !== 'INC-2026-001') return [];
    return grcControlGaps;
  },
};
