import type {
  SecurityEvent, Alert, Incident, AffectedAsset, ReportMeta, AIQuery,
  AttackGraphNode, AttackGraphEdge, EvidenceRecord, GrcControlGap, MitreTechnique,
} from '@/types';

export const DEMO_INCIDENT_ID = 'INC-2026-001';

export const securityEvents: SecurityEvent[] = [
  {
    id: 'EVT-1021', timestamp: '2026-08-19T10:01:00', source: 'Wazuh', event_type: 'authentication_failure',
    severity: 'medium', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.20',
    host: 'WORKSTATION-01', process: null, command: null, asset: 'WORKSTATION-01', asset_criticality: 'high',
    raw_log: 'Failed password for analyst from 10.10.10.5 — 5 attempts in 60s',
    event_id: 'SEC-2026-04412', device: 'WORKSTATION-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1022', timestamp: '2026-08-19T10:01:15', source: 'Wazuh', event_type: 'authentication_failure',
    severity: 'medium', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.20',
    host: 'WORKSTATION-01', process: null, command: null, asset: 'WORKSTATION-01', asset_criticality: 'high',
    raw_log: 'Failed password for analyst from 10.10.10.5 — attempt 4/5',
    event_id: 'SEC-2026-04412b', device: 'WORKSTATION-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1023', timestamp: '2026-08-19T10:03:00', source: 'Wazuh', event_type: 'successful_login',
    severity: 'medium', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.20',
    host: 'WORKSTATION-01', process: null, command: null, asset: 'WORKSTATION-01', asset_criticality: 'high',
    raw_log: 'Successful authentication for analyst from 10.10.10.5 after failed attempts',
    event_id: 'SEC-2026-04413', device: 'WORKSTATION-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1024', timestamp: '2026-08-19T10:04:00', source: 'EDR', event_type: 'powershell_execution',
    severity: 'high', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.20',
    host: 'WORKSTATION-01', process: 'powershell.exe', command: 'powershell.exe -enc SQBFAFgA...',
    asset: 'WORKSTATION-01', asset_criticality: 'high',
    raw_log: 'Encoded PowerShell execution detected on WORKSTATION-01',
    event_id: 'SEC-2026-04425', device: 'WORKSTATION-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1025', timestamp: '2026-08-19T10:06:00', source: 'EDR', event_type: 'credential_access',
    severity: 'high', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.30',
    host: 'WORKSTATION-01', process: 'lsass.exe', command: null,
    asset: 'WORKSTATION-01', asset_criticality: 'high',
    raw_log: 'Credential access attempt — LSASS memory read detected',
    event_id: 'SEC-2026-04430', device: 'WORKSTATION-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1026', timestamp: '2026-08-19T10:07:00', source: 'Wazuh', event_type: 'privilege_activity',
    severity: 'high', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.20',
    host: 'WORKSTATION-01', process: null, command: null,
    asset: 'AD-DC-01', asset_criticality: 'critical',
    raw_log: 'Privileged group membership change — Domain Admin granted to analyst',
    event_id: 'SEC-2026-04418', device: 'AD-DC-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1027', timestamp: '2026-08-19T10:08:00', source: 'Firewall', event_type: 'remote_access',
    severity: 'high', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.40',
    host: 'FILE-SRV-01', process: 'mstsc.exe', command: null,
    asset: 'FILE-SRV-01', asset_criticality: 'critical',
    raw_log: 'RDP session established from WORKSTATION-01 to FILE-SRV-01',
    event_id: 'SEC-2026-04435', device: 'FILE-SRV-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1028', timestamp: '2026-08-19T10:09:00', source: 'DLP', event_type: 'sensitive_file_access',
    severity: 'critical', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '10.10.10.40',
    host: 'FILE-SRV-01', process: 'explorer.exe', command: null,
    asset: 'FILE-SRV-01', asset_criticality: 'critical',
    raw_log: 'Access to /finance/customer_records.xlsx — classified sensitive',
    event_id: 'SEC-2026-04438', device: 'FILE-SRV-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1029', timestamp: '2026-08-19T10:10:00', source: 'Firewall', event_type: 'outbound_transfer',
    severity: 'critical', user: 'analyst', source_ip: '10.10.10.5', destination_ip: '203.0.113.77',
    host: 'WORKSTATION-01', process: null, command: null,
    asset: 'Network Egress', asset_criticality: 'high',
    raw_log: 'Large outbound data transfer — 2.3 GB to external IP 203.0.113.77',
    event_id: 'SEC-2026-04441', device: 'FW-EDGE-01', correlated: true, status: 'correlated',
  },
  {
    id: 'EVT-1030', timestamp: '2026-08-19T10:12:00', source: 'IDS', event_type: 'port_scan',
    severity: 'low', user: 'unknown', source_ip: '198.51.100.22', destination_ip: '10.10.10.1',
    host: 'FW-EDGE-01', process: null, command: null, asset: 'FW-EDGE-01', asset_criticality: 'medium',
    raw_log: 'Port scan detected from 198.51.100.22', event_id: 'SEC-2026-04452', correlated: false, status: 'new',
  },
];

export const alerts: Alert[] = [
  { id: 'ALR-001', timestamp: '2026-08-19T10:01:00', time: '10:01', rule: 'Multiple Failed Login Attempts', name: 'Multiple Failed Login Attempts', source: 'Wazuh', host: 'WORKSTATION-01', device: 'WORKSTATION-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'medium', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1021' },
  { id: 'ALR-002', timestamp: '2026-08-19T10:03:00', time: '10:03', rule: 'Successful Login After Failures', name: 'Successful Login After Failures', source: 'Wazuh', host: 'WORKSTATION-01', device: 'WORKSTATION-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'medium', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1023' },
  { id: 'ALR-003', timestamp: '2026-08-19T10:04:00', time: '10:04', rule: 'PowerShell Encoded Execution', name: 'PowerShell Encoded Execution', source: 'EDR', host: 'WORKSTATION-01', device: 'WORKSTATION-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'high', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1024' },
  { id: 'ALR-004', timestamp: '2026-08-19T10:06:00', time: '10:06', rule: 'Credential Access Detected', name: 'Credential Access Detected', source: 'EDR', host: 'WORKSTATION-01', device: 'WORKSTATION-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'high', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1025' },
  { id: 'ALR-005', timestamp: '2026-08-19T10:07:00', time: '10:07', rule: 'Privilege Escalation', name: 'Privilege Escalation — Domain Admin', source: 'Wazuh', host: 'AD-DC-01', device: 'AD-DC-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'high', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1026' },
  { id: 'ALR-006', timestamp: '2026-08-19T10:08:00', time: '10:08', rule: 'Remote Access Session', name: 'Remote Access Session', source: 'Firewall', host: 'FILE-SRV-01', device: 'FILE-SRV-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'high', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1027' },
  { id: 'ALR-007', timestamp: '2026-08-19T10:09:00', time: '10:09', rule: 'Sensitive File Access', name: 'Sensitive File Access', source: 'DLP', host: 'FILE-SRV-01', device: 'FILE-SRV-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'critical', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1028' },
  { id: 'ALR-008', timestamp: '2026-08-19T10:10:00', time: '10:10', rule: 'Large Outbound Data Transfer', name: 'Large Outbound Data Transfer', source: 'Firewall', host: 'WORKSTATION-01', device: 'FW-EDGE-01', user: 'analyst', source_ip: '10.10.10.5', ip: '10.10.10.5', severity: 'critical', status: 'correlated', related_incident: DEMO_INCIDENT_ID, correlation: DEMO_INCIDENT_ID, eventId: 'EVT-1029' },
  { id: 'ALR-009', timestamp: '2026-08-19T10:12:00', time: '10:12', rule: 'Port Scan Detected', name: 'Port Scan Detected', source: 'IDS', host: 'FW-EDGE-01', device: 'FW-EDGE-01', user: 'unknown', source_ip: '198.51.100.22', ip: '198.51.100.22', severity: 'low', status: 'new', related_incident: null, correlation: '—', eventId: 'EVT-1030' },
  { id: 'ALR-010', timestamp: '2026-08-19T10:14:00', time: '10:14', rule: 'Malware Signature Match', name: 'Malware Signature Match', source: 'EDR', host: 'BK-SRV-04', device: 'BK-SRV-04', user: 'svc_backup', source_ip: '10.24.12.15', ip: '10.24.12.15', severity: 'high', status: 'investigating', related_incident: null, correlation: '—', eventId: 'SEC-2026-04458' },
];

export const demoIncident: Incident = {
  id: DEMO_INCIDENT_ID,
  title: 'Credential Compromise Investigation',
  severity: 'critical',
  risk_score: 87,
  confidence: 91,
  status: 'under_investigation',
  affected_assets: ['WORKSTATION-01', 'FILE-SRV-01', 'AD-DC-01'],
  affected_users: ['analyst'],
  first_seen: '2026-08-19T10:01:00',
  last_seen: '2026-08-19T10:10:00',
  mitre_techniques: ['T1110', 'T1078', 'T1059.001', 'T1003', 'T1068', 'T1021.001', 'T1041'],
  event_count: 9,
  event_ids: securityEvents.filter((e) => e.correlated).map((e) => e.id),
  alert_ids: alerts.filter((a) => a.related_incident === DEMO_INCIDENT_ID).map((a) => a.id),
  source_ips: ['10.10.10.5'],
  destination_ips: ['10.10.10.20', '10.10.10.30', '10.10.10.40', '203.0.113.77'],
  summary: 'A privileged user account (analyst) may have been compromised following multiple failed authentication attempts. A successful login was followed by PowerShell execution, credential access, privilege escalation, remote access, sensitive file access, and a large outbound data transfer.',
  risk: 'critical',
  riskScore: 87,
  affectedAssets: ['WORKSTATION-01', 'FILE-SRV-01', 'AD-DC-01'],
  mitreTechniques: 7,
  businessImpact: 'high',
  createdAt: '2026-08-19T10:10:00',
  evidence: [
    { type: 'confirmed', title: 'Failed Authentication', detail: '5 failed login attempts from 10.10.10.5 within 60 seconds targeting analyst', source: 'Wazuh / EVT-1021' },
    { type: 'confirmed', title: 'Successful Login', detail: 'Successful authentication for analyst from 10.10.10.5 at 10:03', source: 'Wazuh / EVT-1023' },
    { type: 'confirmed', title: 'PowerShell Execution', detail: 'Encoded PowerShell command executed on WORKSTATION-01', source: 'EDR / EVT-1024' },
    { type: 'confirmed', title: 'Credential Access', detail: 'LSASS memory read detected on WORKSTATION-01', source: 'EDR / EVT-1025' },
    { type: 'confirmed', title: 'Privilege Escalation', detail: 'Domain Admin privileges granted to analyst on AD-DC-01', source: 'Wazuh / EVT-1026' },
    { type: 'confirmed', title: 'Sensitive File Access', detail: 'Access to classified customer records on FILE-SRV-01', source: 'DLP / EVT-1028' },
    { type: 'confirmed', title: 'Outbound Data Transfer', detail: '2.3 GB transferred to external IP 203.0.113.77', source: 'Firewall / EVT-1029' },
  ],
  relatedAlerts: alerts.filter((a) => a.related_incident === DEMO_INCIDENT_ID).map((a) => a.id),
  timeline: [
    { id: 'TL-1', time: '10:01', title: 'Failed Login', description: 'Multiple failed authentication attempts (5 in 60s)', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.20', device: 'WORKSTATION-01', severity: 'medium', evidence: 'EVT-1021', evidenceIds: ['EVT-1021', 'EVT-1022'], mitreTechniqueId: 'T1110', suspicious: true },
    { id: 'TL-2', time: '10:03', title: 'Successful Login', description: 'Successful authentication after failed attempts', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.20', device: 'WORKSTATION-01', severity: 'medium', evidence: 'EVT-1023', evidenceIds: ['EVT-1023'], mitreTechniqueId: 'T1078', suspicious: true },
    { id: 'TL-3', time: '10:04', title: 'PowerShell Execution', description: 'Encoded PowerShell command execution detected', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.20', device: 'WORKSTATION-01', severity: 'high', evidence: 'EVT-1024', evidenceIds: ['EVT-1024'], mitreTechniqueId: 'T1059.001', suspicious: true },
    { id: 'TL-4', time: '10:06', title: 'Credential Access', description: 'LSASS memory read — credential harvesting', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.30', device: 'WORKSTATION-01', severity: 'high', evidence: 'EVT-1025', evidenceIds: ['EVT-1025'], mitreTechniqueId: 'T1003', suspicious: true },
    { id: 'TL-5', time: '10:07', title: 'Privilege Activity', description: 'Domain Admin role granted to analyst', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.20', device: 'AD-DC-01', severity: 'high', evidence: 'EVT-1026', evidenceIds: ['EVT-1026'], mitreTechniqueId: 'T1068', suspicious: true },
    { id: 'TL-6', time: '10:08', title: 'Remote Access', description: 'RDP session to FILE-SRV-01', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.40', device: 'FILE-SRV-01', severity: 'high', evidence: 'EVT-1027', evidenceIds: ['EVT-1027'], mitreTechniqueId: 'T1021.001', suspicious: true },
    { id: 'TL-7', time: '10:09', title: 'Sensitive File Access', description: 'Access to classified customer records', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '10.10.10.40', device: 'FILE-SRV-01', severity: 'critical', evidence: 'EVT-1028', evidenceIds: ['EVT-1028'], suspicious: true },
    { id: 'TL-8', time: '10:10', title: 'Outbound Transfer', description: 'Large outbound data transfer — 2.3 GB to external IP', user: 'analyst', sourceIp: '10.10.10.5', destinationIp: '203.0.113.77', device: 'FW-EDGE-01', severity: 'critical', evidence: 'EVT-1029', evidenceIds: ['EVT-1029'], mitreTechniqueId: 'T1041', suspicious: true },
  ],
  narrative: [
    { label: 'confirmed', text: 'User account analyst experienced 5 failed authentication attempts from IP 10.10.10.5 within 60 seconds.' },
    { label: 'confirmed', text: 'A successful login for analyst occurred from the same IP address shortly after the failed attempts.' },
    { label: 'inferred', text: 'The successful login may indicate credential compromise through brute-force or credential stuffing.' },
    { label: 'confirmed', text: 'Encoded PowerShell was executed, followed by credential access and privilege escalation to Domain Admin.' },
    { label: 'confirmed', text: 'Remote access to FILE-SRV-01, sensitive file access, and 2.3 GB outbound transfer were observed.' },
    { label: 'possible', text: 'This sequence may indicate unauthorized access followed by privilege escalation and possible data exfiltration.' },
  ],
  riskFactors: [
    { name: 'Technique Severity', score: 90, label: '7 MITRE techniques' },
    { name: 'Asset Criticality', score: 95, label: 'FILE-SRV-01, AD-DC-01' },
    { name: 'Confidence', score: 91, label: 'Correlated evidence' },
    { name: 'Blast Radius', score: 80, label: '3 critical assets' },
    { name: 'Privilege Level', score: 85, label: 'Domain Admin' },
  ],
  mitre: [
    { tactic: 'Credential Access', technique: 'Brute Force', techniqueId: 'T1110', description: 'Adversaries may use brute force techniques to gain access to accounts.', evidence: 'EVT-1021, EVT-1022', affectedAsset: 'WORKSTATION-01', confidence: 88 },
    { tactic: 'Initial Access', technique: 'Valid Accounts', techniqueId: 'T1078', description: 'Adversaries may use credentials of existing accounts to gain initial access.', evidence: 'EVT-1023', affectedAsset: 'WORKSTATION-01', confidence: 85 },
    { tactic: 'Execution', technique: 'PowerShell', techniqueId: 'T1059.001', description: 'Adversaries may abuse PowerShell to execute commands and scripts.', evidence: 'EVT-1024', affectedAsset: 'WORKSTATION-01', confidence: 92 },
    { tactic: 'Credential Access', technique: 'OS Credential Dumping', techniqueId: 'T1003', description: 'Adversaries may attempt to dump credentials from OS credential stores.', evidence: 'EVT-1025', affectedAsset: 'WORKSTATION-01', confidence: 90 },
    { tactic: 'Privilege Escalation', technique: 'Domain or Local Groups', techniqueId: 'T1068', description: 'Adversaries may modify group memberships to gain elevated permissions.', evidence: 'EVT-1026', affectedAsset: 'AD-DC-01', confidence: 90 },
    { tactic: 'Lateral Movement', technique: 'Remote Desktop Protocol', techniqueId: 'T1021.001', description: 'Adversaries may use RDP to laterally move to remote systems.', evidence: 'EVT-1027', affectedAsset: 'FILE-SRV-01', confidence: 87 },
    { tactic: 'Exfiltration', technique: 'Exfiltration Over C2 Channel', techniqueId: 'T1041', description: 'Adversaries may steal data by exfiltrating it over an existing channel.', evidence: 'EVT-1029', affectedAsset: 'Network Egress', confidence: 80 },
  ],
  grc: [
    { framework: 'GRC', area: 'Privileged Access Management', control: 'MFA for privileged accounts', relevance: 'No MFA event observed during authentication chain for analyst account.', status: 'gap' },
    { framework: 'ISO 27001', area: 'A.9 Access Control', control: 'A.9.4.2: Secure log-on procedures', relevance: 'Multiple failed logins followed by success without MFA challenge.', status: 'review' },
    { framework: 'NIST', area: 'Protect', control: 'PR.AC-7: Users authenticated', relevance: 'Authentication events detected but MFA not enforced.', status: 'gap' },
    { framework: 'NIST', area: 'Detect', control: 'DE.CM-8: Unauthorized devices and software', relevance: 'SIEM successfully detected the suspicious activity chain.', status: 'compliant' },
  ],
  recommendations: [
    { id: 1, category: 'investigation', action: 'Validate the compromised account session for analyst.', priority: 'critical', status: 'recommended', evidence_ids: ['EVT-1021', 'EVT-1023'] },
    { id: 2, category: 'containment', action: 'Consider disabling the affected analyst account.', priority: 'critical', status: 'recommended', evidence_ids: ['EVT-1026'] },
    { id: 3, category: 'containment', action: 'Block outbound transfer destination 203.0.113.77.', priority: 'critical', status: 'recommended', evidence_ids: ['EVT-1029'] },
    { id: 4, category: 'control_review', action: 'Enable MFA for privileged accounts.', priority: 'high', status: 'recommended', evidence_ids: ['EVT-1021', 'EVT-1023'] },
    { id: 5, category: 'remediation', action: 'Preserve evidence for forensic analysis.', priority: 'medium', status: 'recommended', evidence_ids: ['EVT-1024', 'EVT-1025'] },
  ],
};

export const mitreTechniques: MitreTechnique[] = demoIncident.mitre!.map((m, i) => ({
  id: m.techniqueId,
  tactic: m.tactic,
  technique: m.technique,
  sub_technique: m.techniqueId.includes('.') ? m.technique : undefined,
  description: m.description,
  evidence_ids: m.evidence.split(', ').map((e) => e.startsWith('EVT') ? e : `EVT-${e}`),
  confidence: m.confidence,
  attack_path_position: i + 1,
  affected_asset: m.affectedAsset,
}));

export const attackGraphNodes: AttackGraphNode[] = [
  { id: 'node-user', type: 'user', label: 'analyst', mitre_technique_id: 'T1078', mitre_technique_name: 'Valid Accounts', tactic: 'Initial Access', confidence: 85, evidence_ids: ['EVT-1023'], timestamp: '10:03' },
  { id: 'node-host', type: 'host', label: 'WORKSTATION-01', mitre_technique_id: 'T1059.001', mitre_technique_name: 'PowerShell', tactic: 'Execution', confidence: 92, evidence_ids: ['EVT-1024'], timestamp: '10:04' },
  { id: 'node-process', type: 'process', label: 'powershell.exe', mitre_technique_id: 'T1003', mitre_technique_name: 'OS Credential Dumping', tactic: 'Credential Access', confidence: 90, evidence_ids: ['EVT-1025'], timestamp: '10:06' },
  { id: 'node-server', type: 'server', label: 'FILE-SRV-01', mitre_technique_id: 'T1021.001', mitre_technique_name: 'Remote Desktop Protocol', tactic: 'Lateral Movement', confidence: 87, evidence_ids: ['EVT-1027', 'EVT-1028'], timestamp: '10:08' },
  { id: 'node-dest', type: 'destination', label: '203.0.113.77', mitre_technique_id: 'T1041', mitre_technique_name: 'Exfiltration Over C2 Channel', tactic: 'Exfiltration', confidence: 80, evidence_ids: ['EVT-1029'], timestamp: '10:10' },
];

export const attackGraphEdges: AttackGraphEdge[] = [
  { id: 'e1', source: 'node-user', target: 'node-host', label: 'logged into' },
  { id: 'e2', source: 'node-host', target: 'node-process', label: 'executed' },
  { id: 'e3', source: 'node-process', target: 'node-server', label: 'accessed via RDP' },
  { id: 'e4', source: 'node-server', target: 'node-dest', label: 'exfiltrated to' },
];

export const grcControlGaps: GrcControlGap[] = [
  { control: 'MFA', status: 'potential_gap', evidence_ids: ['EVT-1021', 'EVT-1023'], confidence: 72, required_verification: ['Check identity provider configuration', 'Verify MFA policy for privileged accounts'], attack_behaviour: 'Authentication without MFA challenge after failed logins', security_weakness: 'No MFA enforcement on privileged account', framework_reference: 'NIST PR.AC-7 / ISO A.9.4.2', business_risk: 'Unauthorized access to critical systems and data' },
  { control: 'Privileged Access Monitoring', status: 'review', evidence_ids: ['EVT-1026'], confidence: 85, required_verification: ['Review PAM session recording', 'Validate Domain Admin assignment approval'], attack_behaviour: 'Domain Admin granted without approval workflow', security_weakness: 'Insufficient privileged access controls', framework_reference: 'GRC PAM-01', business_risk: 'Elevated privilege abuse leading to data breach' },
  { control: 'Data Loss Prevention', status: 'review', evidence_ids: ['EVT-1028', 'EVT-1029'], confidence: 78, required_verification: ['Verify DLP blocking rules', 'Review egress filtering policies'], attack_behaviour: 'Sensitive file access followed by large outbound transfer', security_weakness: 'DLP detected but did not block exfiltration', framework_reference: 'ISO A.13.2.3', business_risk: 'Potential customer data exfiltration' },
];

export const evidenceRecords: EvidenceRecord[] = [
  { id: 'EVD-RISK-001', claim: 'High credential compromise risk — score 87/100', evidence_ids: ['EVT-1021', 'EVT-1027', 'EVT-1029'], timestamp: '2026-08-19T10:10:00', source: 'Threat2Risk Engine', reasoning: 'Multiple authentication and privilege-related events occurred within the same investigation window with correlated entity links.', confidence: 91, category: 'risk' },
  { id: 'EVD-MITRE-001', claim: 'T1110 Brute Force detected with supporting evidence', evidence_ids: ['EVT-1021', 'EVT-1022'], timestamp: '2026-08-19T10:01:00', source: 'Wazuh', reasoning: '5 failed authentication attempts within 60 seconds from same source IP and user.', confidence: 88, category: 'mitre' },
  { id: 'EVD-GRC-001', claim: 'MFA control gap — no MFA event observed', evidence_ids: ['EVT-1021', 'EVT-1023'], timestamp: '2026-08-19T10:03:00', source: 'Wazuh', reasoning: 'Successful login after failed attempts with no MFA challenge event in the authentication chain.', confidence: 72, category: 'grc' },
  { id: 'EVD-REC-001', claim: 'Enable MFA to reduce risk by 33 points', evidence_ids: ['EVT-1021', 'EVT-1023'], timestamp: '2026-08-19T10:15:00', source: 'What-If Simulator', reasoning: 'MFA would have blocked post-brute-force authentication, breaking the attack chain at stage 2.', confidence: 85, category: 'recommendation' },
  { id: 'EVD-AI-001', claim: 'Incident is critical due to privileged account and data exfiltration', evidence_ids: ['EVT-1026', 'EVT-1028', 'EVT-1029'], timestamp: '2026-08-19T10:11:00', source: 'AI Assistant', reasoning: 'Domain Admin privileges combined with sensitive file access and 2.3 GB outbound transfer indicate high-impact breach scenario.', confidence: 91, category: 'ai' },
];

export const affectedAssets: AffectedAsset[] = [
  { id: 'AST-001', name: 'FILE-SRV-01', type: 'server', criticality: 'critical', owner: 'IT Infrastructure', currentRisk: 'critical', riskScore: 95, relatedIncidents: [DEMO_INCIDENT_ID], ip: '10.10.10.40', location: 'Data Center — Rack 12' },
  { id: 'AST-002', name: 'WORKSTATION-01', type: 'laptop', criticality: 'high', owner: 'Security Operations', currentRisk: 'critical', riskScore: 88, relatedIncidents: [DEMO_INCIDENT_ID], ip: '10.10.10.20', location: 'Office Floor 3' },
  { id: 'AST-003', name: 'AD-DC-01 (Domain Controller)', type: 'server', criticality: 'critical', owner: 'IT Infrastructure', currentRisk: 'high', riskScore: 82, relatedIncidents: [DEMO_INCIDENT_ID], ip: '10.10.10.30', location: 'Data Center — Rack 03' },
  { id: 'AST-004', name: 'Customer Database', type: 'database', criticality: 'critical', owner: 'Data Engineering', currentRisk: 'high', riskScore: 75, relatedIncidents: [DEMO_INCIDENT_ID], ip: '10.10.10.50', location: 'Data Center — Rack 12' },
  { id: 'AST-005', name: 'CRM-APP-01', type: 'application', criticality: 'medium', owner: 'Sales Operations', currentRisk: 'low', riskScore: 15, relatedIncidents: [], ip: '10.24.12.55', location: 'Data Center — Rack 09' },
];

export const reports: ReportMeta[] = [
  { id: 'RPT-001', type: 'technical', title: `Technical Investigation Report — ${DEMO_INCIDENT_ID}`, incidentId: DEMO_INCIDENT_ID, generatedAt: '2026-08-19 10:15:00', status: 'ready' },
  { id: 'RPT-002', type: 'executive', title: `Executive Report — ${DEMO_INCIDENT_ID}`, incidentId: DEMO_INCIDENT_ID, generatedAt: '2026-08-19 10:16:00', status: 'ready' },
  { id: 'RPT-003', type: 'grc', title: `Risk / GRC Report — ${DEMO_INCIDENT_ID}`, incidentId: DEMO_INCIDENT_ID, generatedAt: '2026-08-19 10:17:00', status: 'ready' },
  { id: 'RPT-004', type: 'threat', title: `Threat Report — ${DEMO_INCIDENT_ID}`, incidentId: DEMO_INCIDENT_ID, generatedAt: '2026-08-19 10:18:00', status: 'ready' },
];

export const aiQueries: AIQuery[] = [
  { id: 'AIQ-001', question: 'Why is this incident critical?', answer: 'The incident is rated Critical (87/100) because it involves a privileged account, a 8-stage attack progression, access to sensitive files on FILE-SRV-01, and a 2.3 GB outbound data transfer.', evidence: ['EVT-1021 — Failed login (5 attempts)', 'EVT-1023 — Successful login', 'EVT-1026 — Privilege escalation', 'EVT-1028 — Sensitive file access', 'EVT-1029 — Data transfer'], reasoning: 'Risk score derived from technique severity (90), asset criticality (95), confidence (91), blast radius (80), and privilege level (85).', riskImpact: 'CRITICAL — Privileged account with evidence of data exfiltration.', recommendedAction: 'Validate the analyst session immediately. If unauthorized, disable the account and isolate affected assets.', confidence: 91, timestamp: '10:11:00' },
  { id: 'AIQ-002', question: 'Which MITRE techniques were detected?', answer: 'Seven MITRE ATT&CK techniques are mapped: T1110 (Brute Force), T1078 (Valid Accounts), T1059.001 (PowerShell), T1003 (OS Credential Dumping), T1068 (Privilege Escalation), T1021.001 (RDP), T1041 (Exfiltration).', evidence: ['T1110 — EVT-1021, EVT-1022', 'T1078 — EVT-1023', 'T1059.001 — EVT-1024', 'T1003 — EVT-1025', 'T1068 — EVT-1026', 'T1021.001 — EVT-1027', 'T1041 — EVT-1029'], reasoning: 'Each technique corresponds to a distinct stage with supporting event evidence.', riskImpact: '7 techniques across 6 tactics — multi-stage attack.', recommendedAction: 'Review detection rules for each technique.', confidence: 88, timestamp: '10:12:00' },
  { id: 'AIQ-003', question: 'What would happen if MFA was enabled?', answer: 'If MFA were enabled, the risk score would drop from 87 to 54 — a reduction of 33 points. MFA would block authentication after the brute-force stage, breaking the attack chain.', evidence: ['EVT-1021 — Failed logins without MFA challenge', 'EVT-1023 — Successful login without MFA'], reasoning: 'Deterministic what-if calculation: MFA blocks stage 2 (successful login), preventing all downstream techniques.', riskImpact: 'Risk reduction of 33 points (87 → 54).', recommendedAction: 'Enable MFA for all privileged accounts immediately.', confidence: 85, timestamp: '10:13:00' },
];

export const suggestedQueries: string[] = [
  'Why is this incident critical?',
  'What happened first?',
  'Which MITRE techniques were detected?',
  'Why is the risk score 87?',
  'Which assets are affected?',
  'What evidence supports this conclusion?',
  'What would happen if MFA was enabled?',
];

export const workflowSteps: { key: string; label: string }[] = [
  { key: 'command-center', label: 'Dashboard' },
  { key: 'events', label: 'Events' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'investigation', label: 'Investigation' },
  { key: 'attack-timeline', label: 'Timeline' },
  { key: 'attack-graph', label: 'Attack Graph' },
  { key: 'mitre', label: 'MITRE' },
  { key: 'risk-intelligence', label: 'Risk' },
  { key: 'blast-radius', label: 'Blast Radius' },
  { key: 'grc', label: 'GRC' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'ai-investigation', label: 'AI Assistant' },
  { key: 'reports', label: 'Reports' },
];

export const incidents: Incident[] = [demoIncident];
