import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from typing import List, Dict, Any
from app.schemas.event import UnifiedEvent

MODEL_PATH = os.path.join(os.path.dirname(__file__), "threat2risk_ml_model.joblib")

class TrainedSecurityMLModel:
    """Trained Machine Learning Model for Security Anomaly Detection & Threat Classification."""

    def __init__(self):
        self.rf_model = None
        self.iso_model = None
        self.load_or_train_model()

    def _extract_features(self, events: List[UnifiedEvent]) -> np.ndarray:
        # Extract quantitative ML feature vector:
        # [failed_attempts_count, has_priv_escalation, has_db_access, exfil_volume_gb, asset_criticality_score]
        failed_count = sum(1 for e in events if e.event_type == "authentication_failure")
        has_priv_esc = 1.0 if any(e.event_type == "privilege_escalation" for e in events) else 0.0
        has_db = 1.0 if any("database" in e.event_type or "data_collection" in e.event_type for e in events) else 0.0
        
        exfil_bytes = 0.0
        for e in events:
            if e.event_type == "data_exfiltration":
                exfil_bytes = float(e.metadata.get("bytes_sent", 1556938400)) / 1e9  # GB
        
        crit_map = {"low": 1.0, "medium": 2.0, "high": 3.0, "critical": 4.0}
        max_crit = max([crit_map.get((e.asset_criticality or "medium").lower(), 2.0) for e in events], default=2.0)

        return np.array([[failed_count, has_priv_esc, has_db, exfil_bytes, max_crit]])

    def load_or_train_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                data = joblib.load(MODEL_PATH)
                self.rf_model = data["rf_model"]
                self.iso_model = data["iso_model"]
                return
            except Exception as e:
                print(f"Loading cached model failed, retraining... {e}")

        # Generate synthetic training dataset grounded in security telemetry patterns
        np.random.seed(42)
        X_normal = np.column_stack([
            np.random.poisson(lam=1, size=200),             # low failed logins
            np.random.choice([0], size=200),                # no priv esc
            np.random.choice([0, 1], size=200, p=[0.8, 0.2]),# rare db access
            np.zeros(200),                                   # zero exfil
            np.random.choice([1, 2, 3], size=200)           # asset criticality
        ])

        X_attack = np.column_stack([
            np.random.poisson(lam=10, size=100),            # high failed logins
            np.random.choice([1], size=100),                # priv esc present
            np.random.choice([1], size=100),                # db access present
            np.random.uniform(0.5, 5.0, size=100),          # exfil volume in GB
            np.random.choice([3, 4], size=100)              # high/critical asset
        ])

        X_train = np.vstack([X_normal, X_attack])
        # Labels: 0 = Normal, 1 = Advanced Persistent Threat (APT) / Exfiltration
        y_train = np.array([0] * 200 + [1] * 100)

        # Train Random Forest Classifier
        self.rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.rf_model.fit(X_train, y_train)

        # Train Isolation Forest for Anomaly Detection
        self.iso_model = IsolationForest(contamination=0.25, random_state=42)
        self.iso_model.fit(X_train)

        # Save trained artifacts
        joblib.dump({"rf_model": self.rf_model, "iso_model": self.iso_model}, MODEL_PATH)

    def predict_threat(self, events: List[UnifiedEvent]) -> Dict[str, Any]:
        features = self._extract_features(events)
        
        # Predict threat probability & class
        proba = float(self.rf_model.predict_proba(features)[0][1])
        is_apt = bool(proba > 0.5)
        
        # Isolation Forest Anomaly Score (-1 = anomaly, 1 = normal)
        iso_score = float(self.iso_model.score_samples(features)[0])
        anomaly_score = round(float(np.clip((0.5 - iso_score) * 100, 0, 99.9)), 1)

        threat_category = "Advanced Data Exfiltration Campaign (APT)" if is_apt else "Standard Security Noise"
        model_confidence = round(float(max(proba, 1 - proba) * 100), 1)

        return {
            "ml_model_name": "Scikit-Learn RandomForest + IsolationForest Ensemble v1.0",
            "anomaly_score": anomaly_score,
            "threat_category": threat_category,
            "is_anomaly": is_apt or anomaly_score > 60.0,
            "threat_probability": round(proba * 100, 1),
            "model_confidence": model_confidence,
            "extracted_features": {
                "failed_attempts": int(features[0][0]),
                "privilege_escalation_detected": bool(features[0][1]),
                "sensitive_db_access_detected": bool(features[0][2]),
                "exfiltration_volume_gb": float(features[0][3]),
                "max_asset_criticality_index": float(features[0][4])
            }
        }

ml_model_instance = TrainedSecurityMLModel()
