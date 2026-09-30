"use client";

import React from "react";
import { Header } from "@/components/Header";
import { AIWidget } from "@/components/AIWidget";

export default function AIPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Global Evidence-Grounded AI Assistant"
        subtitle="Conversational cybersecurity investigation grounded strictly in stored incident telemetry and evidence ledger claims"
      />

      <div className="max-w-4xl mx-auto">
        <AIWidget incidentId="INC-2026-0042" />
      </div>
    </div>
  );
}
