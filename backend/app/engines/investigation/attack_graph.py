import networkx as nx
from typing import List
from app.schemas.event import UnifiedEvent
from app.schemas.incident import AttackGraph, AttackNode, AttackEdge

class AttackGraphEngine:
    """Builds a directed topology attack graph from correlated incident events."""

    @staticmethod
    def build_graph(events: List[UnifiedEvent]) -> AttackGraph:
        g = nx.DiGraph()
        nodes_dict = {}
        edges_set = set()

        for idx, evt in enumerate(events):
            evt_node_id = f"node_{evt.event_id}"
            nodes_dict[evt_node_id] = AttackNode(
                id=evt_node_id,
                label=f"{evt.event_type.replace('_', ' ').title()}",
                type="event",
                severity=evt.severity,
                details={
                    "timestamp": evt.timestamp,
                    "host": evt.host,
                    "user": evt.user,
                    "command": evt.command,
                    "source": evt.source
                }
            )

            # User entity node
            if evt.user:
                u_node_id = f"user_{evt.user}"
                if u_node_id not in nodes_dict:
                    nodes_dict[u_node_id] = AttackNode(
                        id=u_node_id,
                        label=f"User: {evt.user}",
                        type="user",
                        severity="info",
                        details={"user": evt.user}
                    )
                edges_set.add((u_node_id, evt_node_id, "TRIGGERED"))

            # Host entity node
            if evt.host:
                h_node_id = f"host_{evt.host}"
                if h_node_id not in nodes_dict:
                    nodes_dict[h_node_id] = AttackNode(
                        id=h_node_id,
                        label=f"Host: {evt.host}",
                        type="host",
                        severity="warning" if evt.asset_criticality == "critical" else "info",
                        details={"host": evt.host, "criticality": evt.asset_criticality}
                    )
                edges_set.add((evt_node_id, h_node_id, "TARGETED"))

            # External IP node if exfiltration or remote connection
            if evt.destination_ip and not evt.destination_ip.startswith("10."):
                ip_node_id = f"ext_ip_{evt.destination_ip}"
                if ip_node_id not in nodes_dict:
                    nodes_dict[ip_node_id] = AttackNode(
                        id=ip_node_id,
                        label=f"C2 / External: {evt.destination_ip}",
                        type="external_ip",
                        severity="critical",
                        details={"ip": evt.destination_ip}
                    )
                edges_set.add((evt_node_id, ip_node_id, "EXFILTRATED_TO"))

            # Connect event sequence chronologically
            if idx > 0:
                prev_evt_id = f"node_{events[idx-1].event_id}"
                edges_set.add((prev_evt_id, evt_node_id, "NEXT_STAGE"))

        nodes_list = list(nodes_dict.values())
        edges_list = [AttackEdge(source=s, target=t, relation=r) for (s, t, r) in edges_set]

        return AttackGraph(nodes=nodes_list, edges=edges_list)
