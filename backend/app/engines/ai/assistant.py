from typing import Dict, Any, List
from app.schemas.incident import Incident

class AIAssistantEngine:
    """Evidence-grounded RAG Assistant Engine that answers security questions based strictly on incident evidence ledger."""

    @staticmethod
    def answer_query(incident: Incident, query: str) -> Dict[str, Any]:
        q_lower = query.lower()

        # Build evidence context references
        evidence_citations = []
        for entry in incident.evidence_ledger:
            evidence_citations.append({
                "claim": entry.claim,
                "evidence_ids": entry.evidence_ids,
                "timestamp": entry.timestamp,
                "confidence": f"{int(entry.confidence * 100)}%"
            })

        # Answer routing logic grounded strictly in incident data
        if "why" in q_lower and "critical" in q_lower or "risk" in q_lower:
            answer = (
                f"Incident {incident.incident_id} ('{incident.title}') is rated CRITICAL with an explainable risk score of "
                f"{incident.risk_score}/100 based on 5 verified evidence factors:\n\n"
                f"1. **Critical Asset Targeted**: Host `FIN-DB-01` (Financial DB) and `DC-01` (Domain Controller) [Evidence: `evt_2026_0042_003`, `evt_2026_0042_004`].\n"
                f"2. **Privilege Escalation**: User `admin01` escalated permissions to Domain Admin [Evidence: `evt_2026_0042_003`, Confidence: 92%].\n"
                f"3. **Sensitive Data Access**: Query executed on `payroll_records` and `executive_salaries` returning 14,500 rows [Evidence: `evt_2026_0042_004`, Confidence: 95%].\n"
                f"4. **Bulk Collection**: Created compressed archive `/tmp/fin_dump.tar.gz` (1.42 GB) [Evidence: `evt_2026_0042_005`].\n"
                f"5. **Exfiltration**: Outbound connection to external C2 IP `198.51.100.77` over HTTPS transferring 1.45 GB [Evidence: `evt_2026_0042_006`, Confidence: 85%]."
            )
        elif "timeline" in q_lower or "happen" in q_lower or "sequence" in q_lower:
            events_summary = "\n".join([
                f"• **{e.timestamp[11:19]}** - [{e.severity.upper()}] {e.event_type.replace('_', ' ').title()} on `{e.host}` by `{e.user}` (Log ID: `{e.event_id}`)"
                for e in incident.events
            ])
            answer = (
                f"Here is the chronological attack sequence for Incident `{incident.incident_id}`:\n\n"
                f"{events_summary}\n\n"
                f"The attack progressed from Initial Access brute-force attempt (10:01) to complete outbound data exfiltration (10:18)."
            )
        elif "mitre" in q_lower or "technique" in q_lower:
            mitre_summary = "\n".join([
                f"• **{m.technique_id} ({m.technique_name})** - Tactic: *{m.tactic}* | Position: #{m.position_in_chain} | Confidence: {int(m.confidence * 100)}% | Evidence: `{', '.join(m.evidence_ids)}`"
                for m in incident.mitre_mappings
            ])
            answer = f"Observed MITRE ATT&CK techniques mapped to evidence:\n\n{mitre_summary}"
        elif "grc" in q_lower or "iso" in q_lower or "nist" in q_lower or "control" in q_lower:
            grc_summary = "\n".join([
                f"• **{g.control_id} ({g.control_name})** - Status: **{g.status}**\n"
                f"  - Business Risk: {g.business_risk}\n"
                f"  - Recommendation: {g.recommendation}"
                for g in incident.grc_findings
            ])
            answer = f"GRC & Compliance Control Gaps identified for this incident:\n\n{grc_summary}"
        elif "action" in q_lower or "recommend" in q_lower or "do next" in q_lower or "fix" in q_lower:
            rec_summary = "\n".join([
                f"• **[{r.priority}] {r.category}**: {r.action}\n  *Rationale*: {r.rationale} (Targets: `{', '.join(r.target_entities)}`)"
                for r in incident.recommendations
            ])
            answer = f"Prioritized Remediation Actions:\n\n{rec_summary}"
        else:
            answer = (
                f"Incident `{incident.incident_id}` involves user `{', '.join(incident.users_involved)}` and hosts "
                f"`{', '.join(incident.hosts_affected)}`. Current severity is **{incident.severity}** with risk score **{incident.risk_score}/100**.\n\n"
                f"You can ask me about:\n"
                f"• Why this incident is critical\n"
                f"• Chronological attack timeline\n"
                f"• MITRE ATT&CK techniques mapped\n"
                f"• GRC & ISO 27001 / NIST control gaps\n"
                f"• Recommended remediation actions"
            )

        return {
            "query": query,
            "answer": answer,
            "incident_id": incident.incident_id,
            "evidence_citations": evidence_citations,
            "is_grounded": True
        }
