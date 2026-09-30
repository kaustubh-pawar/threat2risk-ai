import json
import os
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel

from app.schemas.event import UnifiedEvent
from app.schemas.incident import Incident
from app.engines.ingestion.normalizer import LogNormalizerEngine
from app.engines.correlation.engine import CorrelationEngine
from app.engines.ai.assistant import AIAssistantEngine
from app.engines.ml.trained_model import TrainedSecurityMLModel

router = APIRouter()
ml_model = TrainedSecurityMLModel()

# Data Cache / In-Memory Store for Demo
DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../data/sample_logs/golden_scenario.json")

def load_golden_incident(controls_override: Dict[str, bool] = None) -> Incident:
    if not os.path.exists(DATA_FILE):
        raise HTTPException(status_code=404, detail="Golden scenario log file not found.")
    
    with open(DATA_FILE, "r") as f:
        raw_data = json.load(f)
    
    events = LogNormalizerEngine.normalize_batch(raw_data)
    return CorrelationEngine.build_incident_from_events(events, incident_id="INC-2026-0042", controls_override=controls_override)

class LoginRequest(BaseModel):
    username: str
    password: str

class WhatIfRequest(BaseModel):
    mfa_enabled: bool = False
    network_segmented: bool = False
    db_dlp_enforced: bool = False

class AIChatRequest(BaseModel):
    query: str
    incident_id: Optional[str] = "INC-2026-0042"

class ReportRequest(BaseModel):
    report_type: str
    incident_id: str = "INC-2026-0042"

class SendOTPRequest(BaseModel):
    email: str
    purpose: str = "registration"

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str

class SMTPConfigRequest(BaseModel):
    admin_email: str = "kaustubh1006p@gmail.com"
    app_password: str

OTP_STORE: Dict[str, str] = {}

@router.post("/auth/smtp-config")
def config_smtp(req: SMTPConfigRequest):
    from app.services.email_service import set_smtp_credentials
    set_smtp_credentials(req.admin_email, req.app_password)
    return {
        "status": "success",
        "message": f"SMTP Admin email configured to {req.admin_email} with App Password."
    }

@router.post("/auth/send-otp")
def send_otp(req: SendOTPRequest):
    import random
    from app.services.email_service import send_email_otp, ADMIN_EMAIL

    clean_email = req.email.lower().strip()
    otp = f"{random.randint(100000, 999999)}"
    OTP_STORE[clean_email] = otp
    
    # Send email from Admin (kaustubh1006p@gmail.com)
    delivery = send_email_otp(clean_email, otp, req.purpose)
    
    return {
        "status": "success",
        "message": f"6-Digit Security OTP dispatched to {clean_email} by Admin ({ADMIN_EMAIL})",
        "email": clean_email,
        "sender": ADMIN_EMAIL,
        "delivered_via_smtp": delivery["delivered_via_smtp"],
        "otp_code": otp,  # Included for client-side notification preview & fallback
        "expires_in_seconds": 300
    }

@router.post("/auth/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    clean_email = req.email.lower().strip()
    expected_otp = OTP_STORE.get(clean_email)
    
    if not expected_otp or expected_otp != req.otp_code.strip():
        raise HTTPException(status_code=400, detail="Invalid 6-Digit OTP Code. Please check your email and try again.")
    
    OTP_STORE.pop(clean_email, None)
    return {"status": "verified", "message": "OTP Verification successful."}

@router.post("/auth/login")
def login(credentials: LoginRequest):
    if credentials.username in ["analyst", "ciso", "admin01", "auditor"] and credentials.password == "threat2risk":
        return {
            "access_token": "token_threat2risk_jwt_mock_2026",
            "token_type": "bearer",
            "user": {
                "username": credentials.username,
                "role": "SOC Analyst" if credentials.username == "analyst" else "Security Manager / CISO",
                "email": f"{credentials.username}@threat2risk.ai"
            }
        }
    return {
        "access_token": "token_threat2risk_jwt_mock_2026",
        "token_type": "bearer",
        "user": {
            "username": credentials.username or "analyst",
            "role": "SOC Analyst",
            "email": "analyst@threat2risk.ai"
        }
    }

@router.get("/ml/predict")
def predict_ml_threat():
    incident = load_golden_incident()
    return ml_model.predict_threat(incident.events)

@router.get("/dashboard/summary")
def get_dashboard_summary():
    incident = load_golden_incident()
    return {
        "total_incidents": 1,
        "critical_incidents": 1,
        "high_risk_incidents": 1,
        "active_investigations": 1,
        "assets_at_risk": len(incident.assets_at_risk),
        "total_alerts": len(incident.events),
        "risk_posture": {
            "overall_score": incident.risk_score,
            "classification": incident.severity
        },
        "incidents_by_severity": [
            {"severity": "Critical", "count": 1, "color": "#EF4444"},
            {"severity": "High", "count": 0, "color": "#F97316"},
            {"severity": "Medium", "count": 0, "color": "#EAB308"},
            {"severity": "Low", "count": 0, "color": "#22C55E"}
        ],
        "top_attacked_assets": [
            {"asset_id": "FIN-DB-01", "name": "Finance Database", "criticality": "Critical", "risk_score": 95},
            {"asset_id": "DC-01", "name": "Domain Controller", "criticality": "Critical", "risk_score": 92},
            {"asset_id": "AUTH-SRV-01", "name": "Auth Server", "criticality": "High", "risk_score": 85}
        ],
        "mitre_tactic_distribution": [
            {"tactic": "Credential Access", "count": 1},
            {"tactic": "Initial Access", "count": 1},
            {"tactic": "Privilege Escalation", "count": 1},
            {"tactic": "Collection", "count": 2},
            {"tactic": "Exfiltration", "count": 1}
        ]
    }

@router.get("/alerts")
def get_alerts():
    incident = load_golden_incident()
    alerts = []
    for evt in incident.events:
        alerts.append({
            "alert_id": f"ALERT-{evt.event_id[-5:]}",
            "event_id": evt.event_id,
            "timestamp": evt.timestamp,
            "title": evt.event_type.replace("_", " ").title(),
            "severity": evt.severity,
            "source": evt.source,
            "user": evt.user,
            "host": evt.host,
            "source_ip": evt.source_ip,
            "destination_ip": evt.destination_ip,
            "incident_id": incident.incident_id,
            "raw_log": evt.raw_log
        })
    return {"alerts": alerts, "total": len(alerts)}

@router.get("/alerts/{id}")
def get_alert_detail(id: str):
    incident = load_golden_incident()
    for evt in incident.events:
        if evt.event_id == id or id in evt.event_id or id in f"ALERT-{evt.event_id[-5:]}":
            mitre = [m for m in incident.mitre_mappings if evt.event_id in m.evidence_ids]
            return {
                "alert": evt,
                "related_incident_id": incident.incident_id,
                "mitre_mapping": mitre[0] if mitre else None
            }
    raise HTTPException(status_code=404, detail="Alert not found.")

@router.get("/incidents")
def list_incidents():
    incident = load_golden_incident()
    return {
        "incidents": [{
            "incident_id": incident.incident_id,
            "title": incident.title,
            "status": incident.status,
            "severity": incident.severity,
            "risk_score": incident.risk_score,
            "first_seen": incident.first_seen,
            "last_seen": incident.last_seen,
            "users_involved": incident.users_involved,
            "hosts_affected": incident.hosts_affected,
            "alert_count": len(incident.events)
        }]
    }

@router.get("/incidents/{id}")
def get_incident(id: str):
    incident = load_golden_incident()
    if id != incident.incident_id:
        raise HTTPException(status_code=404, detail=f"Incident {id} not found.")
    return incident

@router.get("/incidents/{id}/timeline")
def get_incident_timeline(id: str):
    incident = load_golden_incident()
    return {"timeline": incident.events}

@router.get("/incidents/{id}/evidence")
def get_evidence_ledger(id: str):
    incident = load_golden_incident()
    return {"evidence_ledger": incident.evidence_ledger}

@router.get("/incidents/{id}/mitre")
def get_incident_mitre(id: str):
    incident = load_golden_incident()
    return {"mitre_mappings": incident.mitre_mappings}

@router.get("/incidents/{id}/risk")
def get_incident_risk(id: str):
    incident = load_golden_incident()
    return {"risk_assessment": incident.risk_assessment}

@router.get("/incidents/{id}/grc")
def get_incident_grc(id: str):
    incident = load_golden_incident()
    return {"grc_findings": incident.grc_findings}

@router.post("/incidents/{id}/what-if")
def simulate_what_if(id: str, request: WhatIfRequest):
    controls = {
        "mfa_enabled": request.mfa_enabled,
        "network_segmented": request.network_segmented,
        "db_dlp_enforced": request.db_dlp_enforced
    }
    incident = load_golden_incident(controls_override=controls)
    return {
        "incident_id": id,
        "simulated_risk_assessment": incident.risk_assessment,
        "applied_controls": controls
    }

@router.get("/mitre/techniques")
def get_mitre_catalog():
    incident = load_golden_incident()
    return {"techniques": incident.mitre_mappings}

@router.get("/grc/controls")
def get_grc_catalog():
    incident = load_golden_incident()
    return {"controls": incident.grc_findings}

@router.post("/ai/chat")
def ai_chat(req: AIChatRequest):
    incident = load_golden_incident()
    return AIAssistantEngine.answer_query(incident, req.query)

@router.post("/reports/generate")
def generate_report(req: ReportRequest):
    incident = load_golden_incident()
    
    if req.report_type == "technical":
        title = "SOC Technical Incident Investigation Report"
        audience = "SOC Analyst & Incident Response Team"
        content = {
            "incident_summary": f"Incident {incident.incident_id} involving host {', '.join(incident.hosts_affected)}.",
            "attack_sequence": [e.dict() for e in incident.events],
            "mitre_mappings": [m.dict() for m in incident.mitre_mappings],
            "evidence_ledger": [ev.dict() for ev in incident.evidence_ledger]
        }
    elif req.report_type == "risk":
        title = "CISO Risk & GRC Compliance Assessment Report"
        audience = "CISO, Risk Officers & Compliance Managers"
        content = {
            "risk_assessment": incident.risk_assessment.dict(),
            "grc_control_gaps": [g.dict() for g in incident.grc_findings],
            "recommendations": [r.dict() for r in incident.recommendations]
        }
    else:  # executive
        title = "Executive Security Briefing & Impact Summary"
        audience = "Board of Directors & Executive Management"
        content = {
            "executive_summary": "On August 20, 2026, Threat2Risk AI detected an active data exfiltration attack targeting core financial records.",
            "business_impact": "1.45 GB of sensitive payroll and executive compensation data transferred externally.",
            "financial_risk_rating": incident.severity,
            "action_plan": [r.action for r in incident.recommendations if r.priority == "P0"]
        }

    return {
        "report_id": f"REP-2026-{req.report_type.upper()}-001",
        "incident_id": incident.incident_id,
        "title": title,
        "audience": audience,
        "generated_at": "2026-08-20T15:40:00Z",
        "content": content
    }

class TerminalCommandRequest(BaseModel):
    command: str

@router.get("/events")
def get_events():
    incident = load_golden_incident()
    return {"events": [e.dict() for e in incident.events], "total": len(incident.events)}

@router.get("/blast-radius")
def get_blast_radius():
    incident = load_golden_incident()
    return {
        "incident_id": incident.incident_id,
        "chain": [
            {"name": "Attacker IP: 198.51.100.42", "type": "External Attacker"},
            {"name": "Auth Server (AUTH-SRV-01)", "type": "Initial Breach"},
            {"name": "Domain Controller (DC-01)", "type": "Privilege Escalation"},
            {"name": "Finance Database (FIN-DB-01)", "type": "Data Exfiltration Target"}
        ],
        "affected_assets": incident.hosts_affected,
        "critical_assets": ["FIN-DB-01", "DC-01"],
        "affected_users": incident.users_involved,
        "potential_spread": ["ERP-PROD-01 (SAP Production)", "BACKUP-NAS-02 (Storage Appliance)"]
    }

@router.get("/attack-graph")
def get_attack_graph():
    return {
        "nodes": [
            {"id": "node-1", "label": "External IP 198.51.100.42", "type": "ip", "mitre_technique_id": "T1078", "mitre_technique_name": "Valid Accounts", "confidence": 95, "evidence_ids": ["EVT-2026-001"], "tactic": "Initial Access"},
            {"id": "node-2", "label": "Auth Server (AUTH-SRV-01)", "type": "host", "mitre_technique_id": "T1110", "mitre_technique_name": "Brute Force", "confidence": 92, "evidence_ids": ["EVT-2026-002"], "tactic": "Credential Access"},
            {"id": "node-3", "label": "Domain Controller (DC-01)", "type": "host", "mitre_technique_id": "T1068", "mitre_technique_name": "Exploitation for Privilege Escalation", "confidence": 90, "evidence_ids": ["EVT-2026-003"], "tactic": "Privilege Escalation"},
            {"id": "node-4", "label": "Finance Database (FIN-DB-01)", "type": "database", "mitre_technique_id": "T1005", "mitre_technique_name": "Data from Local System", "confidence": 98, "evidence_ids": ["EVT-2026-004", "EVT-2026-005"], "tactic": "Collection"}
        ],
        "edges": [
            {"source": "node-1", "target": "node-2", "label": "Brute force login"},
            {"source": "node-2", "target": "node-3", "label": "Lateral movement via WinRM"},
            {"source": "node-3", "target": "node-4", "label": "SQL query & exfiltration"}
        ]
    }

@router.get("/affected-assets")
def get_affected_assets():
    return {
        "assets": [
            {"id": "AST-01", "name": "DB-SRV-01 (Customer DB)", "type": "database", "criticality": "critical", "owner": "Data Ops", "riskScore": 95, "currentRisk": "critical", "ip": "10.0.4.15", "location": "us-east-1", "relatedIncidents": ["TR-2026-0017"]},
            {"id": "AST-02", "name": "AD-DC-01 (Domain Controller)", "type": "infrastructure", "criticality": "critical", "owner": "IT Sec", "riskScore": 92, "currentRisk": "critical", "ip": "10.0.1.10", "location": "us-east-1", "relatedIncidents": ["TR-2026-0017"]},
            {"id": "AST-03", "name": "APP-SRV-02 (Web Application)", "type": "server", "criticality": "high", "owner": "DevOps", "riskScore": 78, "currentRisk": "high", "ip": "10.0.2.22", "location": "us-east-1", "relatedIncidents": ["TR-2026-0017"]},
            {"id": "AST-04", "name": "WS-ADM-04 (Admin Workstation)", "type": "laptop", "criticality": "medium", "owner": "Corporate IT", "riskScore": 45, "currentRisk": "medium", "ip": "10.0.10.88", "location": "HQ", "relatedIncidents": []}
        ]
    }

@router.get("/recommendations")
def get_recommendations():
    incident = load_golden_incident()
    return {"recommendations": [r.dict() for r in incident.recommendations]}

@router.post("/terminal/execute")
def execute_terminal_command(req: TerminalCommandRequest):
    cmd = req.command.strip().lower()
    if cmd == "help":
        return {"output": "Commands: investigate --incident <ID>, show alerts, show risk, show mitre, show assets, clear"}
    if cmd.startswith("investigate"):
        return {"output": "Investigating incident INC-2026-0042... Risk: CRITICAL (Score: 92/100). 6 correlated events."}
    if cmd == "show risk":
        return {"output": "Risk Score: 92/100 (CRITICAL). Factors: Account Privilege (95), Asset Criticality (90), Data Sensitivity (88)."}
    return {"output": f"Executed command: {req.command}"}

