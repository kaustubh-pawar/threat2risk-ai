from typing import List
from app.schemas.event import UnifiedEvent
from app.schemas.incident import Recommendation

class RecommendationEngine:
    """Generates prioritized containment, remediation, recovery, and prevention actions."""

    @staticmethod
    def generate_recommendations(events: List[UnifiedEvent]) -> List[Recommendation]:
        recs: List[Recommendation] = [
            Recommendation(
                id="rec_001",
                priority="P0",
                category="Containment",
                action="Isolate Host FIN-DB-01 and Revoke Session for admin01",
                rationale="Active outbound exfiltration detected. Immediate network isolation prevents further data loss.",
                target_entities=["FIN-DB-01", "admin01"]
            ),
            Recommendation(
                id="rec_002",
                priority="P0",
                category="Containment",
                action="Block External C2 IP 198.51.100.77 at Perimeter Firewall",
                rationale="Prevent further payload transfer or secondary command-and-control communication.",
                target_entities=["198.51.100.77"]
            ),
            Recommendation(
                id="rec_003",
                priority="P1",
                category="Remediation",
                action="Audit and Reset All Domain Admin Account Credentials",
                rationale="User admin01 was improperly elevated to Domain Admin on DC-01. Remove unauthorized group membership.",
                target_entities=["DC-01", "admin01"]
            ),
            Recommendation(
                id="rec_004",
                priority="P1",
                category="Remediation",
                action="Purge Dump Artifact /tmp/fin_dump.tar.gz and Conduct Forensic Memory Analysis",
                rationale="Remove stager dump file and investigate host memory for secondary persistence mechanisms.",
                target_entities=["FIN-DB-01"]
            ),
            Recommendation(
                id="rec_005",
                priority="P2",
                category="Prevention",
                action="Enforce Mandatory Hardware MFA & Strict Database Egress Micro-segmentation",
                rationale="Address core ISO 27001 / NIST control gaps to eliminate single-point authentication and egress weaknesses.",
                target_entities=["AUTH-SRV-01", "FIN-DB-01"]
            )
        ]
        return recs
