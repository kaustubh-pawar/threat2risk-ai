from typing import List, Dict, Any
from app.schemas.event import UnifiedEvent
from app.schemas.incident import RiskAssessment, RiskFactor

class ExplainableRiskEngine:
    """Calculates explainable 0-100 risk score and supports What-If simulation recalculations."""

    @staticmethod
    def calculate_risk(events: List[UnifiedEvent], controls_enabled: Dict[str, bool] = None) -> RiskAssessment:
        if controls_enabled is None:
            controls_enabled = {}

        is_simulated = len(controls_enabled) > 0

        # Check factors
        has_critical_asset = any(e.asset_criticality == "critical" for e in events)
        has_domain_admin = any(e.user == "admin01" or "Admin" in (e.command or "") for e in events)
        has_db_access = any("database" in e.event_type or "payroll" in (e.command or "").lower() for e in events)
        has_exfiltration = any("exfiltration" in e.event_type for e in events)
        event_count = len(events)

        # Base Factor Scores (0 - 100)
        score_asset = 95.0 if has_critical_asset else 60.0
        score_privilege = 92.0 if has_domain_admin else 40.0
        score_data_sens = 90.0 if has_db_access else 30.0
        score_progression = min(100.0, event_count * 16.0)  # 6 stages = 96
        score_severity = 95.0 if has_exfiltration else 70.0
        score_impact = 90.0 if (has_exfiltration and has_db_access) else 50.0
        score_confidence = 92.0

        # Apply What-If Simulated Control Adjustments
        sim_notes = []
        if controls_enabled.get("mfa_enabled"):
            score_privilege = max(20.0, score_privilege - 50.0)
            sim_notes.append("Enforced MFA reduced compromised credential leverage by 50 pts.")

        if controls_enabled.get("network_segmented"):
            score_severity = max(30.0, score_severity - 45.0)
            score_impact = max(25.0, score_impact - 45.0)
            sim_notes.append("Strict micro-segmentation blocked outbound C2 exfiltration pathway.")

        if controls_enabled.get("db_dlp_enforced"):
            score_data_sens = max(20.0, score_data_sens - 40.0)
            sim_notes.append("Database DLP policy prevented unencrypted bulk payroll export.")

        factors = [
            RiskFactor(
                factor="Asset Criticality",
                weight=0.20,
                score=score_asset,
                weighted_score=score_asset * 0.20,
                description="Core database FIN-DB-01 and Domain Controller DC-01 targeted."
            ),
            RiskFactor(
                factor="User Privilege Level",
                weight=0.20,
                score=score_privilege,
                weighted_score=score_privilege * 0.20,
                description="Domain Admin credential escalation observed."
            ),
            RiskFactor(
                factor="Data Sensitivity",
                weight=0.20,
                score=score_data_sens,
                weighted_score=score_data_sens * 0.20,
                description="Sensitive financial payroll & salary records accessed."
            ),
            RiskFactor(
                factor="Attack Progression Stage",
                weight=0.15,
                score=score_progression,
                weighted_score=score_progression * 0.15,
                description=f"Full 6-stage kill chain progression from Initial Access to Exfiltration."
            ),
            RiskFactor(
                factor="Attack Event Severity",
                weight=0.10,
                score=score_severity,
                weighted_score=score_severity * 0.10,
                description="Confirmed high/critical severity signals across Wazuh & NetFlow."
            ),
            RiskFactor(
                factor="Potential Business Impact",
                weight=0.10,
                score=score_impact,
                weighted_score=score_impact * 0.10,
                description="Regulatory breach penalty risk & corporate data exfiltration."
            ),
            RiskFactor(
                factor="Evidence Confidence",
                weight=0.05,
                score=score_confidence,
                weighted_score=score_confidence * 0.05,
                description="Corroborated logs from Wazuh, DB audit, and Network NetFlow."
            )
        ]

        overall_score = round(sum(f.weighted_score for f in factors), 1)

        if overall_score >= 76:
            classification = "CRITICAL"
        elif overall_score >= 51:
            classification = "HIGH"
        elif overall_score >= 26:
            classification = "MEDIUM"
        else:
            classification = "LOW"

        explanation_prefix = "[WHAT-IF SIMULATION] " if is_simulated else ""
        explanation = f"{explanation_prefix}Risk score of {overall_score}/100 ({classification}). Driven by targeted critical asset FIN-DB-01, Domain Admin privileges, and full exfiltration progression. " + " ".join(sim_notes)

        return RiskAssessment(
            overall_score=overall_score,
            classification=classification,
            is_simulated=is_simulated,
            factors=factors,
            explanation=explanation
        )
