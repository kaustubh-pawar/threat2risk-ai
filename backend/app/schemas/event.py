from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class UnifiedEvent(BaseModel):
    event_id: str = Field(..., description="Unique event identifier")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")
    source: str = Field(..., description="Source log provider e.g. wazuh, windows_eventlog, db_audit, network_flow")
    event_type: str = Field(..., description="Normalized event classification")
    severity: str = Field("low", description="low, medium, high, critical")
    user: Optional[str] = Field(None, description="Username associated with event")
    source_ip: Optional[str] = Field(None, description="Source IP address")
    destination_ip: Optional[str] = Field(None, description="Destination IP address")
    host: Optional[str] = Field(None, description="Host / hostname")
    process: Optional[str] = Field(None, description="Process name or executable")
    command: Optional[str] = Field(None, description="Command line execution details")
    asset_id: Optional[str] = Field(None, description="Associated asset ID")
    asset_criticality: Optional[str] = Field("medium", description="low, medium, high, critical")
    raw_log: str = Field(..., description="Original unparsed log entry")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Connector specific payload metadata")
