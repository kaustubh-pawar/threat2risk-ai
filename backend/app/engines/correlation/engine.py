from typing import List, Dict, Any
from app.schemas.event import UnifiedEvent
from app.schemas.incident import Incident, EvidenceEntry
from app.ledger.evidence_ledger import EvidenceLedgerService
from app.engines.investigation.attack_graph import AttackGraphEngine
from app.engines.mitre.mapper import MITREMapperEngine
from app.engines.risk.explainable_risk import ExplainableRiskEngine
from app.engines.grc.control_gap import GRCControlGapEngine
from app.engines.recommendations.remediations import RecommendationEngine

class CorrelationEngine:
    """Correlates events into Incidents and orchestrates the 5 Threat2Risk processing engines."""

    @classmethod
    def build_incident_from_events(cls, events: List[UnifiedEvent], incident_id: str = "INC-2026-0042", controls_override: Dict[str, bool] = None) -> Incident:
        if not events:
            raise ValueError("No events provided for correlation.")

        # Sorted by timestamp
        sorted_events = sorted(events, key=lambda x: x.timestamp)
        first_seen = sorted_events[0].timestamp
        last_seen = sorted_events[-1].timestamp

        # Extract entities
        users = list(set(e.user for e in sorted_events if e.user))
        hosts = list(set(e.host for e in sorted_events if e.host))
        assets = list(set(e.asset_id for e in sorted_events if e.asset_id))
        event_ids = [e.event_id for e in sorted_events]

        # 1. Build Evidence Ledger
        ledger = EvidenceLedgerService()
        ledger.clear()
        
        # Claims
        if any(e.event_type == "authentication_failure" for e in sorted_events):
            ledger.record_claim(
                claim="Brute force authentication attempts targeting user admin01",
                evidence_ids=[sorted_events[0].event_id],
                timestamp=sorted_events[0].timestamp,
                source=sorted_events[0].source,
                reasoning="12 failed SSH authentication logs from source IP 10.10.10.45",
                confidence=0.85
            )

        if any(e.event_type == "privilege_escalation" for e in sorted_events):
            pe_evt = next(e for e in sorted_events if e.event_type == "privilege_escalation")
            ledger.record_claim(
                claim="Unauthorized Domain Admin privilege escalation occurred on DC-01",
                evidence_ids=[pe_evt.event_id],
                timestamp=pe_evt.timestamp,
                source=pe_evt.source,
                reasoning="Windows EventID 4728: User admin01 added to Administrators group",
                confidence=0.92
            )

        if any(e.event_type == "database_access" for e in sorted_events):
            db_evt = next(e for e in sorted_events if e.event_type == "database_access")
            ledger.record_claim(
                claim="Sensitive financial payroll database query executed",
                evidence_ids=[db_evt.event_id],
                timestamp=db_evt.timestamp,
                source=db_evt.source,
                reasoning="Postgres SQL log statement targeting payroll_records table",
                confidence=0.95
            )

        if any(e.event_type == "data_exfiltration" for e in sorted_events):
            exfil_evt = next(e for e in sorted_events if e.event_type == "data_exfiltration")
            ledger.record_claim(
                claim="Outbound bulk data exfiltration confirmed to external C2 IP 198.51.100.77",
                evidence_ids=[exfil_evt.event_id],
                timestamp=exfil_evt.timestamp,
                source=exfil_evt.source,
                reasoning="NetFlow logged 1.45 GB HTTPS transfer from FIN-DB-01 to external destination",
                confidence=0.94
            )

        evidence_entries = ledger.get_all()

        # 2. Attack Graph
        attack_graph = AttackGraphEngine.build_graph(sorted_events)

        # 3. MITRE ATT&CK Mappings
        mitre_mappings = MITREMapperEngine.map_events(sorted_events)

        # 4. Explainable Risk Engine
        risk_assessment = ExplainableRiskEngine.calculate_risk(sorted_events, controls_enabled=controls_override)

        # 5. GRC Control Gap Engine
        grc_findings = GRCControlGapEngine.evaluate_controls(sorted_events)

        # 6. Prioritized Recommendations Engine
        recommendations = RecommendationEngine.generate_recommendations(sorted_events)

        return Incident(
            incident_id=incident_id,
            title="Potential Financial Data Exfiltration via Privilege Escalation",
            status="Active",
            severity=risk_assessment.classification,
            risk_score=risk_assessment.overall_score,
            first_seen=first_seen,
            last_seen=last_seen,
            users_involved=users,
            hosts_affected=hosts,
            assets_at_risk=assets,
            event_ids=event_ids,
            events=sorted_events,
            evidence_ledger=evidence_entries,
            mitre_mappings=mitre_mappings,
            risk_assessment=risk_assessment,
            grc_findings=grc_findings,
            recommendations=recommendations,
            attack_graph=attack_graph
        )
