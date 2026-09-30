"use client";

import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { incidentsService } from '@/services/incidentsService';
import { riskService } from '@/services/riskService';
import { blastRadiusService } from '@/services/blastRadiusService';
import { attackGraphService } from '@/services/mitreService';
import { mitreService } from '@/services/mitreService';
import { grcService } from '@/services/grcService';
import { evidenceService } from '@/services/evidenceService';
import { eventsService } from '@/services/eventsService';
import { alertsService } from '@/services/alertsService';
import { correlationService } from '@/services/correlationService';

export function useSelectedIncident() {
  const { selectedIncidentId } = useApp();
  const incident = useMemo(() => incidentsService.getById(selectedIncidentId) ?? incidentsService.getDefault(), [selectedIncidentId]);

  return {
    incident,
    incidentId: incident.id,
    events: useMemo(() => eventsService.getByIncidentEventIds(incident.event_ids), [incident.event_ids]),
    alerts: useMemo(() => alertsService.getByIncident(incident.id), [incident.id]),
    risk: useMemo(() => riskService.assess(incident.id), [incident.id]),
    blastRadius: useMemo(() => blastRadiusService.compute(incident.id), [incident.id]),
    attackGraph: useMemo(() => ({
      nodes: attackGraphService.getNodes(incident.id),
      edges: attackGraphService.getEdges(incident.id),
    }), [incident.id]),
    mitre: useMemo(() => mitreService.getTechniques(incident.id), [incident.id]),
    mitreMappings: useMemo(() => mitreService.getMappings(incident.id), [incident.id]),
    grcGaps: useMemo(() => grcService.getControlGaps(incident.id), [incident.id]),
    evidence: useMemo(() => evidenceService.getByIncident(), []),
    correlation: useMemo(() => correlationService.correlate(), []),
  };
}
