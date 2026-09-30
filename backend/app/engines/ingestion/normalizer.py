from typing import Dict, Any, List
from app.schemas.event import UnifiedEvent

class LogNormalizerEngine:
    """Ingests raw security logs from Wazuh, Syslog, DB Audits, and Windows Events and normalizes into UnifiedEvent Schema."""
    
    @staticmethod
    def normalize_event(raw_dict: Dict[str, Any]) -> UnifiedEvent:
        # Standard field extraction with default fallbacks
        event_id = raw_dict.get("event_id") or raw_dict.get("id") or f"evt_{hash(str(raw_dict)) & 0xffffffff}"
        timestamp = raw_dict.get("timestamp") or raw_dict.get("@timestamp") or "2026-08-20T10:00:00Z"
        source = raw_dict.get("source") or raw_dict.get("agent", {}).get("name") or "wazuh"
        event_type = raw_dict.get("event_type") or raw_dict.get("rule", {}).get("description") or "generic_event"
        severity = str(raw_dict.get("severity") or "medium").lower()
        user = raw_dict.get("user") or raw_dict.get("data", {}).get("srcuser")
        source_ip = raw_dict.get("source_ip") or raw_dict.get("data", {}).get("srcip")
        destination_ip = raw_dict.get("destination_ip") or raw_dict.get("data", {}).get("dstip")
        host = raw_dict.get("host") or raw_dict.get("agent", {}).get("hostname")
        process = raw_dict.get("process")
        command = raw_dict.get("command")
        asset_id = raw_dict.get("asset_id") or (f"asset_{host.lower().replace('-', '_')}" if host else "asset_generic")
        asset_criticality = raw_dict.get("asset_criticality") or "medium"
        raw_log = raw_dict.get("raw_log") or str(raw_dict)
        metadata = raw_dict.get("metadata") or {}

        return UnifiedEvent(
            event_id=event_id,
            timestamp=timestamp,
            source=source,
            event_type=event_type,
            severity=severity,
            user=user,
            source_ip=source_ip,
            destination_ip=destination_ip,
            host=host,
            process=process,
            command=command,
            asset_id=asset_id,
            asset_criticality=asset_criticality,
            raw_log=raw_log,
            metadata=metadata
        )

    @classmethod
    def normalize_batch(cls, raw_list: List[Dict[str, Any]]) -> List[UnifiedEvent]:
        return [cls.normalize_event(item) for item in raw_list]
