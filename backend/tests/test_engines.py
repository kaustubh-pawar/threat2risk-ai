import unittest
from app.engines.ingestion.normalizer import LogNormalizerEngine
from app.engines.correlation.engine import CorrelationEngine
from app.engines.risk.explainable_risk import ExplainableRiskEngine

RAW_SAMPLE = [
    {
        "event_id": "evt_test_001",
        "timestamp": "2026-08-20T10:00:00Z",
        "source": "wazuh",
        "event_type": "authentication_failure",
        "severity": "medium",
        "user": "admin01",
        "host": "AUTH-SRV-01",
        "raw_log": "Sample failed log"
    },
    {
        "event_id": "evt_test_002",
        "timestamp": "2026-08-20T10:05:00Z",
        "source": "windows_eventlog",
        "event_type": "privilege_escalation",
        "severity": "high",
        "user": "admin01",
        "host": "DC-01",
        "raw_log": "Sample priv escalation log"
    },
    {
        "event_id": "evt_test_003",
        "timestamp": "2026-08-20T10:15:00Z",
        "source": "network_flow",
        "event_type": "data_exfiltration",
        "severity": "critical",
        "user": "admin01",
        "host": "FIN-DB-01",
        "destination_ip": "198.51.100.77",
        "raw_log": "Sample netflow exfiltration"
    }
]

class TestEnginePipeline(unittest.TestCase):

    def test_normalization(self):
        events = LogNormalizerEngine.normalize_batch(RAW_SAMPLE)
        self.assertEqual(len(events), 3)
        self.assertEqual(events[0].event_id, "evt_test_001")
        self.assertEqual(events[0].source, "wazuh")
        self.assertEqual(events[2].destination_ip, "198.51.100.77")

    def test_correlation_and_engines(self):
        events = LogNormalizerEngine.normalize_batch(RAW_SAMPLE)
        incident = CorrelationEngine.build_incident_from_events(events, incident_id="INC-TEST")
        
        self.assertEqual(incident.incident_id, "INC-TEST")
        self.assertIn(incident.severity, ["HIGH", "CRITICAL"])
        self.assertGreater(len(incident.evidence_ledger), 0)
        self.assertGreaterEqual(len(incident.mitre_mappings), 2)
        self.assertGreaterEqual(len(incident.grc_findings), 2)
        self.assertGreater(len(incident.attack_graph.nodes), 0)

    def test_explainable_risk_and_what_if(self):
        events = LogNormalizerEngine.normalize_batch(RAW_SAMPLE)
        base_risk = ExplainableRiskEngine.calculate_risk(events)
        sim_risk = ExplainableRiskEngine.calculate_risk(events, controls_enabled={"mfa_enabled": True, "network_segmented": True})
        
        self.assertGreater(base_risk.overall_score, sim_risk.overall_score)
        self.assertTrue(sim_risk.is_simulated)
        self.assertIn("WHAT-IF SIMULATION", sim_risk.explanation)

if __name__ == "__main__":
    unittest.main()
