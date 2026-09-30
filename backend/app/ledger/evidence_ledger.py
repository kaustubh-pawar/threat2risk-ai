from typing import List
from app.schemas.incident import EvidenceEntry

class EvidenceLedgerService:
    def __init__(self):
        self._entries: List[EvidenceEntry] = []

    def record_claim(self, claim: str, evidence_ids: List[str], timestamp: str, source: str, reasoning: str, confidence: float) -> EvidenceEntry:
        entry = EvidenceEntry(
            claim=claim,
            evidence_ids=evidence_ids,
            timestamp=timestamp,
            source=source,
            reasoning=reasoning,
            confidence=confidence
        )
        self._entries.append(entry)
        return entry

    def get_all(self) -> List[EvidenceEntry]:
        return self._entries

    def clear(self):
        self._entries = []

ledger_instance = EvidenceLedgerService()
