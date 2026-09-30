from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.event import UnifiedEvent

class EvidenceEntry(BaseModel):
    claim: str
    evidence_ids: List[str]
    timestamp: str
    source: str
    reasoning: str
    confidence: float

class MITREMapping(BaseModel):
    technique_id: str
    technique_name: str
    tactic: str
    position_in_chain: int
    confidence: float
    evidence_ids: List[str]
    description: str

class RiskFactor(BaseModel):
    factor: str
    weight: float
    score: float
    weighted_score: float
    description: str

class RiskAssessment(BaseModel):
    overall_score: float
    classification: str  # Low, Medium, High, Critical
    is_simulated: bool = False
    factors: List[RiskFactor]
    explanation: str

class GRCControlFinding(BaseModel):
    control_id: str
    control_name: str
    framework: str  # ISO 27001, NIST 800-53
    status: str  # Potential Gap, Compliant, Non-Compliant
    evidence_ids: List[str]
    confidence: float
    business_risk: str
    required_verification: str
    recommendation: str

class Recommendation(BaseModel):
    id: str
    priority: str  # P0, P1, P2
    category: str  # Containment, Remediation, Recovery, Prevention
    action: str
    rationale: str
    target_entities: List[str]

class AttackNode(BaseModel):
    id: str
    label: str
    type: str  # user, host, event, asset, external_ip
    severity: Optional[str] = "info"
    details: Dict[str, Any] = Field(default_factory=dict)

class AttackEdge(BaseModel):
    source: str
    target: str
    relation: str

class AttackGraph(BaseModel):
    nodes: List[AttackNode]
    edges: List[AttackEdge]

class Incident(BaseModel):
    incident_id: str
    title: str
    status: str = "Active"  # Active, Investigating, Remediated, Closed
    severity: str  # Low, Medium, High, Critical
    risk_score: float
    first_seen: str
    last_seen: str
    users_involved: List[str]
    hosts_affected: List[str]
    assets_at_risk: List[str]
    event_ids: List[str]
    events: List[UnifiedEvent]
    evidence_ledger: List[EvidenceEntry]
    mitre_mappings: List[MITREMapping]
    risk_assessment: RiskAssessment
    grc_findings: List[GRCControlFinding]
    recommendations: List[Recommendation]
    attack_graph: AttackGraph
