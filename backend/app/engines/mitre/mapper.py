from typing import List
from app.schemas.event import UnifiedEvent
from app.schemas.incident import MITREMapping

class MITREMapperEngine:
    """Maps observed attack behaviors & command patterns to MITRE ATT&CK techniques & tactics."""

    MAPPING_RULES = {
        "authentication_failure": {
            "technique_id": "T1110",
            "technique_name": "Brute Force",
            "tactic": "Credential Access",
            "position": 1,
            "confidence": 0.85,
            "description": "Adversary attempted multiple failed password authentications to gain access."
        },
        "authentication_success": {
            "technique_id": "T1078",
            "technique_name": "Valid Accounts",
            "tactic": "Initial Access",
            "position": 2,
            "confidence": 0.90,
            "description": "Adversary used compromised valid user credentials to authenticate successfully."
        },
        "privilege_escalation": {
            "technique_id": "T1068",
            "technique_name": "Exploitation for Privilege Escalation",
            "tactic": "Privilege Escalation",
            "position": 3,
            "confidence": 0.92,
            "description": "Adversary elevated permissions to Domain Admin privileges on Domain Controller DC-01."
        },
        "database_access": {
            "technique_id": "T1005",
            "technique_name": "Data from Local System / Database",
            "tactic": "Collection",
            "position": 4,
            "confidence": 0.95,
            "description": "Adversary executed sensitive SQL queries targeting payroll and salary tables."
        },
        "data_collection": {
            "technique_id": "T1560",
            "technique_name": "Archive Collected Data",
            "tactic": "Collection",
            "position": 5,
            "confidence": 0.88,
            "description": "Adversary created compressed dump of sensitive database contents."
        },
        "data_exfiltration": {
            "technique_id": "T1041",
            "technique_name": "Exfiltration Over C2 Channel",
            "tactic": "Exfiltration",
            "position": 6,
            "confidence": 0.94,
            "description": "Adversary transferred 1.45 GB sensitive dump to external C2 IP over encrypted channel."
        }
    }

    @classmethod
    def map_events(cls, events: List[UnifiedEvent]) -> List[MITREMapping]:
        mappings: List[MITREMapping] = []
        for idx, evt in enumerate(events):
            rule = cls.MAPPING_RULES.get(evt.event_type)
            if rule:
                mappings.append(MITREMapping(
                    technique_id=rule["technique_id"],
                    technique_name=rule["technique_name"],
                    tactic=rule["tactic"],
                    position_in_chain=rule["position"],
                    confidence=rule["confidence"],
                    evidence_ids=[evt.event_id],
                    description=rule["description"]
                ))
            elif evt.process and "powershell" in evt.process.lower():
                mappings.append(MITREMapping(
                    technique_id="T1059.001",
                    technique_name="PowerShell",
                    tactic="Execution",
                    position_in_chain=idx + 1,
                    confidence=0.85,
                    evidence_ids=[evt.event_id],
                    description="Execution of scriptable PowerShell command line."
                ))
        return mappings
