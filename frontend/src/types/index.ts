export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'new' | 'investigating' | 'correlated' | 'escalated' | 'resolved';
export type IncidentStatus = 'under_investigation' | 'contained' | 'resolved' | 'open';
export type EvidenceType = 'confirmed' | 'inferred' | 'possible' | 'unknown';
export type AssetType = 'server' | 'database' | 'laptop' | 'cloud_account' | 'application' | 'infrastructure';
export type RecommendationCategory = 'investigation' | 'containment' | 'remediation' | 'control_review';
export type GrcControlStatus = 'compliant' | 'potential_gap' | 'review';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  event_type: string;
  severity: Severity;
  user: string;
  source_ip: string;
  destination_ip: string;
  host: string;
  process: string | null;
  command: string | null;
  asset: string;
  asset_criticality: Severity | 'high' | 'medium' | 'low';
  raw_log: string;
  event_id?: string;
  device?: string;
  description?: string;
  correlated?: boolean;
  status?: AlertStatus;
}

export interface Alert {
  id: string;
  timestamp: string;
  time?: string;
  severity: Severity;
  rule: string;
  name?: string;
  source: string;
  host: string;
  device?: string;
  user: string;
  source_ip: string;
  ip?: string;
  status: AlertStatus;
  related_incident: string | null;
  correlation?: string;
  eventId: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  risk_score: number;
  confidence: number;
  status: IncidentStatus;
  affected_assets: string[];
  affected_users: string[];
  first_seen: string;
  last_seen: string;
  mitre_techniques: string[];
  event_count: number;
  event_ids: string[];
  alert_ids: string[];
  summary: string;
  source_ips: string[];
  destination_ips: string[];
  risk?: Severity;
  riskScore?: number;
  affectedAssets?: string[];
  mitreTechniques?: number;
  businessImpact?: 'low' | 'medium' | 'high' | 'critical';
  evidence?: EvidenceItem[];
  relatedAlerts?: string[];
  timeline?: TimelineEvent[];
  narrative?: NarrativeSection[];
  riskFactors?: RiskFactor[];
  mitre?: MitreMapping[];
  grc?: GRCInsight[];
  recommendations?: Recommendation[];
  risk_assessment?: any;
  attack_graph?: any;
  evidence_ledger?: any[];
  incident_id?: string;
  events?: any[];
  mitre_mappings?: any[];
  grc_findings?: any[];
  users_involved?: string[];
  hosts_affected?: string[];
  createdAt?: string;
}

export interface EvidenceItem {
  type: EvidenceType;
  title: string;
  detail: string;
  source: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  user: string;
  sourceIp: string;
  destinationIp?: string;
  device: string;
  severity: Severity;
  evidence: string;
  evidenceIds: string[];
  mitreTechniqueId?: string;
  suspicious: boolean;
}

export interface NarrativeSection {
  label: EvidenceType;
  text: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  label: string;
}

export interface RiskAssessment {
  incident_id: string;
  risk_score: number;
  confidence: number;
  factors: {
    technique_severity: number;
    asset_criticality: number;
    confidence: number;
    blast_radius: number;
    privilege_level: number;
  };
  reasoning: string;
  evidence_ids: string[];
}

export interface MitreTechnique {
  id: string;
  tactic: string;
  technique: string;
  sub_technique?: string;
  description: string;
  evidence_ids: string[];
  confidence: number;
  attack_path_position: number;
  affected_asset: string;
}

export interface MitreMapping {
  tactic: string;
  technique: string;
  techniqueId: string;
  description: string;
  evidence: string;
  affectedAsset: string;
  confidence: number;
}

export interface AttackGraphNode {
  id: string;
  type: 'user' | 'host' | 'process' | 'destination' | 'server';
  label: string;
  mitre_technique_id?: string;
  mitre_technique_name?: string;
  tactic?: string;
  confidence: number;
  evidence_ids: string[];
  timestamp?: string;
}

export interface AttackGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  relation?: string;
}

export interface AttackNode {
  id: string;
  label: string;
  type: string;
  severity?: string;
  details?: any;
}

export interface AttackGraph {
  nodes: AttackNode[];
  edges: AttackGraphEdge[];
}

export interface BlastRadius {
  incident_id: string;
  compromised_user: string;
  chain: { type: string; name: string }[];
  affected_assets: string[];
  critical_assets: string[];
  affected_users: string[];
  potential_spread: string[];
}

export interface GrcControlGap {
  control: string;
  status: GrcControlStatus;
  evidence_ids: string[];
  confidence: number;
  required_verification: string[];
  attack_behaviour: string;
  security_weakness: string;
  framework_reference: string;
  business_risk: string;
}

export interface GRCInsight {
  framework: 'GRC' | 'ISO 27001' | 'NIST';
  area: string;
  control: string;
  relevance: string;
  status: 'review' | 'compliant' | 'gap';
}

export interface EvidenceRecord {
  id: string;
  claim: string;
  evidence_ids: string[];
  timestamp: string;
  source: string;
  reasoning: string;
  confidence: number;
  category: 'risk' | 'mitre' | 'grc' | 'recommendation' | 'ai' | 'correlation';
}

export interface RecommendedAction {
  id: number;
  category: RecommendationCategory;
  action: string;
  priority: Severity;
  status: 'recommended' | 'validated' | 'in_progress' | 'done';
  evidence_ids?: string[];
}

export interface Recommendation extends RecommendedAction {}

export interface CorrelationResult {
  incident_candidate_id: string;
  title: string;
  event_ids: string[];
  entity_links: { type: string; value: string; event_ids: string[] }[];
  time_window_minutes: number;
  attack_chain: string[];
  confidence: number;
}

export interface AffectedAsset {
  id: string;
  name: string;
  type: AssetType;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  currentRisk: Severity;
  riskScore: number;
  relatedIncidents: string[];
  ip: string;
  location: string;
}

export interface ReportMeta {
  id: string;
  type: 'technical' | 'grc' | 'executive' | 'threat';
  title: string;
  incidentId: string;
  generatedAt: string;
  status: 'ready' | 'generating';
}

export interface AIQuery {
  id: string;
  question: string;
  answer: string;
  evidence: string[];
  reasoning: string;
  riskImpact: string;
  recommendedAction: string;
  confidence: number;
  timestamp: string;
}

export interface WhatIfScenario {
  control: string;
  current_value: string;
  what_if_value: string;
  current_risk: number;
  new_risk: number;
  risk_reduction: number;
  explanation: string;
}

export type Page =
  | 'command-center'
  | 'events'
  | 'ai-investigation'
  | 'alerts'
  | 'incidents'
  | 'investigation'
  | 'attack-timeline'
  | 'attack-graph'
  | 'attack-narrative'
  | 'risk-intelligence'
  | 'mitre'
  | 'grc'
  | 'blast-radius'
  | 'evidence'
  | 'affected-assets'
  | 'recommendations'
  | 'reports'
  | 'executive-dashboard'
  | 'terminal'
  | 'settings';
