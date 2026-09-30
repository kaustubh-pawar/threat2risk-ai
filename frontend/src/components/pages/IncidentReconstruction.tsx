"use client";

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { incidentsService } from '@/services/incidentsService';
import { alertsService } from '@/services/alertsService';
import { severityClass, severityText, severityColor } from '@/utils/severity';

export function IncidentReconstruction() {
  const router = useRouter();
  const { setSelectedIncidentId, audio } = useApp();
  const allIncidents = incidentsService.getAll();

  return (
    <div>
      <PageHeader title="Incidents" subtitle="Correlated security incidents requiring investigation" icon={<AlertTriangle className="w-5 h-5" />} />

      <SectionCard title="Active Incidents">
        <div className="space-y-3">
          {allIncidents.map((incident, i) => (
            <motion.div key={incident.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => { setSelectedIncidentId(incident.id); router.push('/investigation'); audio.play('click'); }}
              className="p-5 rounded-lg bg-ink-800/40 border border-ink-700/50 hover:border-cyber-cyan/30 cursor-pointer transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold text-cyber-cyan">{incident.id}</span>
                    <span className={severityClass(incident.severity)}>{severityText(incident.severity)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-ink-700 text-slate-400">{incident.status.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors">{incident.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 max-w-2xl">{incident.summary}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center"><div className="font-mono text-[10px] text-slate-500">Risk</div><div className={`text-xl font-bold font-mono ${severityColor(incident.severity)}`}>{incident.risk_score}/100</div></div>
                  <div className="text-center"><div className="font-mono text-[10px] text-slate-500">Confidence</div><div className="text-xl font-bold font-mono text-cyber-cyan">{incident.confidence}%</div></div>
                  <div className="text-center"><div className="font-mono text-[10px] text-slate-500">Events</div><div className="text-xl font-bold font-mono text-slate-300">{incident.event_count}</div></div>
                  <div className="text-center"><div className="font-mono text-[10px] text-slate-500">Assets</div><div className="text-xl font-bold font-mono text-slate-300">{incident.affected_assets.length}</div></div>
                  <div className="text-center"><div className="font-mono text-[10px] text-slate-500">Users</div><div className="text-xl font-bold font-mono text-slate-300">{incident.affected_users.length}</div></div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyber-cyan transition-colors" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-ink-700/50">
                <span className="font-mono text-[10px] text-slate-500">MITRE:</span>
                {incident.mitre_techniques.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-violet/10 text-cyber-violet border border-cyber-violet/30">{t}</span>
                ))}
              </div>
              <div className="font-mono text-[10px] text-slate-600 mt-2">
                First seen: {incident.first_seen} · Last seen: {incident.last_seen} · {alertsService.getByIncident(incident.id).length} related alerts
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
