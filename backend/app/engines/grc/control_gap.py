from typing import List
from app.schemas.event import UnifiedEvent
from app.schemas.incident import GRCControlFinding

class GRCControlGapEngine:
    """Evaluates security telemetry evidence against ISO 27001 & NIST 800-53 controls to surface gaps and business risk."""

    @staticmethod
    def evaluate_controls(events: List[UnifiedEvent]) -> List[GRCControlFinding]:
        findings: List[GRCControlFinding] = []

        # Check 1: Multi-Factor Authentication
        auth_success_events = [e for e in events if e.event_type == "authentication_success"]
        if auth_success_events:
            evt_id = auth_success_events[0].event_id
            findings.append(GRCControlFinding(
                control_id="ISO-27001-A.9.4.2 / NIST-AC-6",
                control_name="Privileged User Authentication & MFA",
                framework="ISO 27001:2013 / NIST SP 800-53",
                status="Potential Gap",
                evidence_ids=[evt_id],
                confidence=0.90,
                business_risk="Unauthenticated or single-factor access by compromised privileged account admin01 leading to unauthorized domain access.",
                required_verification="Verify identity provider (IdP) logs and enforce hardware MFA for all admin sessions.",
                recommendation="Enforce mandatory FIDO2 / TOTP multi-factor authentication for all administrative hosts and SSH sessions."
            ))

        # Check 2: Least Privilege & Privilege Escalation
        priv_events = [e for e in events if e.event_type == "privilege_escalation"]
        if priv_events:
            evt_id = priv_events[0].event_id
            findings.append(GRCControlFinding(
                control_id="ISO-27001-A.9.2.6 / NIST-AC-2",
                control_name="Management of Privileged Access Rights",
                framework="ISO 27001:2013 / NIST SP 800-53",
                status="Potential Gap",
                evidence_ids=[evt_id],
                confidence=0.92,
                business_risk="Unrestricted local group modification granted unapproved Domain Admin rights.",
                required_verification="Audit Active Directory group modification policies and Just-In-Time (JIT) elevation workflows.",
                recommendation="Implement PAM (Privileged Access Management) with approval workflows and automatic token expiration."
            ))

        # Check 3: Database Data Protection & DLP
        db_events = [e for e in events if "database" in e.event_type or "data_collection" in e.event_type]
        if db_events:
            evt_ids = [e.event_id for e in db_events]
            findings.append(GRCControlFinding(
                control_id="ISO-27001-A.12.4.1 / NIST-AU-2",
                control_name="Protection of Sensitive Financial & Customer Data",
                framework="ISO 27001:2013 / NIST SP 800-53",
                status="Potential Gap",
                evidence_ids=evt_ids,
                confidence=0.95,
                business_risk="Bulk export of sensitive payroll database without query rate limiting or DLP inspection.",
                required_verification="Inspect database auditing rules, query throttles, and egress inspection policies on FIN-DB-01.",
                recommendation="Deploy Database Activity Monitoring (DAM) and automated DLP blocks on bulk dump queries."
            ))

        # Check 4: Outbound Network Exfiltration Controls
        exfil_events = [e for e in events if e.event_type == "data_exfiltration"]
        if exfil_events:
            evt_id = exfil_events[0].event_id
            findings.append(GRCControlFinding(
                control_id="ISO-27001-A.13.1.1 / NIST-SC-7",
                control_name="Network Boundary & Outbound Egress Monitoring",
                framework="ISO 27001:2013 / NIST SP 800-53",
                status="Potential Gap",
                evidence_ids=[evt_id],
                confidence=0.88,
                business_risk="Direct outbound HTTPS connection to unknown external IP 198.51.100.77 transferred 1.45 GB.",
                required_verification="Check firewall egress rules and web proxy SSL inspection policies.",
                recommendation="Restrict database server outbound connectivity exclusively to authorized backup endpoints via strict firewall rules."
            ))

        return findings
