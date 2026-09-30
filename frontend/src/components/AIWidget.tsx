"use client";

import React, { useState } from "react";
import { Bot, Send, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { sendAIChat } from "@/lib/api";

interface Message {
  sender: "user" | "ai";
  text: string;
  citations?: any[];
}

export function AIWidget({ incidentId = "INC-2026-0042" }: { incidentId?: string }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your Threat2Risk AI Grounded Assistant. I analyze stored incident evidence, MITRE mappings, risk factors, and GRC controls. How can I help your investigation today?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Why is this incident critical?",
    "Show me the attack timeline",
    "What MITRE techniques were used?",
    "What GRC control gaps exist?"
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    if (!textToSend) setQuery("");
    setLoading(true);

    const res = await sendAIChat(q, incidentId);

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: res.answer,
        citations: res.evidence_citations
      }
    ]);
    setLoading(false);
  };

  return (
    <div className="glass-card p-4 flex flex-col h-[520px] border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Threat2Risk AI Assistant
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" /> Grounded
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Strict Evidence Citation Engine</p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-blue-300 hover:bg-blue-600/20 hover:border-blue-500/30 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-2.5 h-2.5 text-blue-400" />
            {sq}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

              {/* Evidence Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px]">
                  <p className="font-semibold text-slate-400 mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Evidence Citations:
                  </p>
                  {m.citations.map((c, cIdx) => (
                    <div key={cIdx} className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60 mb-1 text-slate-300">
                      <span className="text-blue-400 font-mono font-bold">[{c.evidence_ids.join(", ")}]</span> - {c.claim} ({c.confidence})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-blue-400" /> Analyzing evidence ledger...
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI about incident, timeline, risk, GRC..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
