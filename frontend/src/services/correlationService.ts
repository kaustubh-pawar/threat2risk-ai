import { securityEvents, DEMO_INCIDENT_ID } from '@/data/simData';
import type { CorrelationResult, SecurityEvent } from '@/types';

const ATTACK_CHAIN_LABELS: Record<string, string> = {
  authentication_failure: 'Failed Login',
  successful_login: 'Successful Login',
  powershell_execution: 'PowerShell Execution',
  credential_access: 'Credential Access',
  privilege_activity: 'Privilege Activity',
  remote_access: 'Remote Access',
  sensitive_file_access: 'Sensitive File Access',
  outbound_transfer: 'Outbound Transfer',
};

function parseTimestamp(ts: string): number {
  return new Date(ts).getTime();
}

function groupByEntity(events: SecurityEvent[], field: keyof SecurityEvent): Map<string, SecurityEvent[]> {
  const map = new Map<string, SecurityEvent[]>();
  for (const event of events) {
    const value = String(event[field] ?? '');
    if (!value || value === 'null') continue;
    const existing = map.get(value) ?? [];
    existing.push(event);
    map.set(value, existing);
  }
  return map;
}

export const correlationService = {
  correlate(timeWindowMinutes = 15): CorrelationResult {
    const sorted = [...securityEvents]
      .filter((e) => e.correlated)
      .sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));

    const entityLinks: CorrelationResult['entity_links'] = [];

    const byUser = groupByEntity(sorted, 'user');
    byUser.forEach((evts, value) => {
      if (evts.length >= 2) entityLinks.push({ type: 'user', value, event_ids: evts.map((e) => e.id) });
    });

    const byHost = groupByEntity(sorted, 'host');
    byHost.forEach((evts, value) => {
      if (evts.length >= 2) entityLinks.push({ type: 'host', value, event_ids: evts.map((e) => e.id) });
    });

    const bySrcIp = groupByEntity(sorted, 'source_ip');
    bySrcIp.forEach((evts, value) => {
      if (evts.length >= 2) entityLinks.push({ type: 'source_ip', value, event_ids: evts.map((e) => e.id) });
    });

    const byProcess = groupByEntity(sorted, 'process');
    byProcess.forEach((evts, value) => {
      if (evts.length >= 1 && value !== 'null') entityLinks.push({ type: 'process', value, event_ids: evts.map((e) => e.id) });
    });

    const firstTs = sorted[0] ? parseTimestamp(sorted[0].timestamp) : 0;
    const lastTs = sorted[sorted.length - 1] ? parseTimestamp(sorted[sorted.length - 1].timestamp) : 0;
    const windowMs = timeWindowMinutes * 60 * 1000;
    const inWindow = lastTs - firstTs <= windowMs;

    const attack_chain = sorted.map((e) => ATTACK_CHAIN_LABELS[e.event_type] ?? e.event_type);

    return {
      incident_candidate_id: DEMO_INCIDENT_ID,
      title: 'Credential Compromise Investigation',
      event_ids: sorted.map((e) => e.id),
      entity_links: entityLinks,
      time_window_minutes: timeWindowMinutes,
      attack_chain,
      confidence: inWindow && sorted.length >= 5 ? 91 : 70,
    };
  },
};
