"use client";

import React, { useState } from "react";
import { AttackGraph, AttackNode } from "@/types";
import { Shield, Server, User, Globe, AlertTriangle, Info } from "lucide-react";

interface AttackGraphProps {
  graph: AttackGraph;
}

export function AttackGraphCanvas({ graph }: AttackGraphProps) {
  const [selectedNode, setSelectedNode] = useState<AttackNode | null>(null);

  // Layout Node Coordinates in SVG Canvas Space
  const nodePositions: Record<string, { x: number; y: number }> = {
    user_admin01: { x: 80, y: 160 },
    node_evt_2026_0042_001: { x: 220, y: 100 },
    node_evt_2026_0042_002: { x: 340, y: 100 },
    host_AUTH_SRV_01: { x: 280, y: 220 },
    node_evt_2026_0042_003: { x: 460, y: 100 },
    host_DC_01: { x: 460, y: 220 },
    node_evt_2026_0042_004: { x: 580, y: 100 },
    node_evt_2026_0042_005: { x: 700, y: 100 },
    host_FIN_DB_01: { x: 640, y: 220 },
    node_evt_2026_0042_006: { x: 820, y: 100 },
    ext_ip_198_51_100_77: { x: 920, y: 200 },
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "user": return User;
      case "host": return Server;
      case "external_ip": return Globe;
      default: return Shield;
    }
  };

  const getNodeColor = (node: AttackNode) => {
    if (node.type === "external_ip" || node.severity === "critical") return "#EF4444";
    if (node.severity === "high") return "#F97316";
    if (node.type === "user") return "#8B5CF6";
    if (node.type === "host") return "#3B82F6";
    return "#64748B";
  };

  return (
    <div className="relative w-full glass-card p-3 sm:p-4 overflow-x-auto border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Attack Topology Graph & Lateral Movement Path
          </h3>
          <p className="text-[11px] text-slate-400">Click any node to inspect evidence properties & metadata</p>
        </div>

        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"/> User Entity</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"/> Host Asset</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"/> High Event</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/> Exfiltration / C2</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full h-72 bg-slate-950/70 rounded-2xl relative border border-slate-900 overflow-x-auto">
        <svg className="w-[1000px] h-full">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
            </marker>
          </defs>

          {/* Render Edges */}
          {(graph?.edges || []).map((edge, idx) => {
            const sKey = (edge.source || '').replace(/[^a-zA-Z0-9_]/g, "_");
            const tKey = (edge.target || '').replace(/[^a-zA-Z0-9_]/g, "_");
            const start = nodePositions[sKey] || { x: 100 + idx * 50, y: 120 };
            const end = nodePositions[tKey] || { x: 200 + idx * 50, y: 120 };
            const isExfil = edge.relation === "EXFILTRATED_TO";

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isExfil ? "#EF4444" : "#334155"}
                  strokeWidth={isExfil ? 2 : 1.5}
                  strokeDasharray={isExfil ? "4 4" : "none"}
                  markerEnd={isExfil ? "url(#arrow-red)" : "url(#arrow)"}
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {(graph?.nodes || []).map((node) => {
            const key = node.id.replace(/[^a-zA-Z0-9_]/g, "_");
            const pos = nodePositions[key] || { x: 400, y: 150 };
            const Icon = getNodeIcon(node.type);
            const color = getNodeColor(node);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => setSelectedNode(node)}
              >
                <circle
                  r={isSelected ? 18 : 14}
                  fill="#0F172A"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  className="filter drop-shadow-md"
                />
                <text x="0" y="24" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="600">
                  {node.label.length > 18 ? node.label.substring(0, 16) + "..." : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs animate-fadeIn">
          <div>
            <span className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Node: {selectedNode.label} ({selectedNode.type})
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Details: {JSON.stringify(selectedNode.details)}
            </p>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-[10px]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
