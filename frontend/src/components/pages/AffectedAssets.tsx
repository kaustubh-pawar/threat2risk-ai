"use client";

import { motion } from 'framer-motion';
import { Server, Database, Cloud, Monitor, AppWindow, Cpu, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useApp } from '@/store/AppContext';
import { affectedAssets } from '@/data/simData';
import { severityClass, severityText } from '@/utils/severity';
import type { AssetType } from '@/types';

const assetIcons: Record<AssetType, typeof Server> = {
  server: Server, database: Database, cloud_account: Cloud, laptop: Monitor, application: AppWindow, infrastructure: Cpu,
};

export function AffectedAssets() {
  const { audio } = useApp();

  return (
    <div>
      <PageHeader title="Affected Assets" subtitle="Asset intelligence & risk mapping" icon={<Server className="w-5 h-5" />} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {affectedAssets.map((asset, i) => {
          const Icon = assetIcons[asset.type];
          const isCritical = asset.criticality === 'critical';
          return (
            <motion.div key={asset.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => audio.play('click')}
              className={`glass-panel p-5 cursor-pointer hover:border-cyber-cyan/30 transition-all ${isCritical ? 'animate-pulseGlow' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                  asset.currentRisk === 'critical' ? 'bg-risk-critical/10 border-risk-critical/30' :
                  asset.currentRisk === 'high' ? 'bg-risk-high/10 border-risk-high/30' :
                  asset.currentRisk === 'medium' ? 'bg-risk-medium/10 border-risk-medium/30' :
                  'bg-cyber-green/10 border-cyber-green/30'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    asset.currentRisk === 'critical' ? 'text-risk-critical' :
                    asset.currentRisk === 'high' ? 'text-risk-high' :
                    asset.currentRisk === 'medium' ? 'text-risk-medium' : 'text-cyber-green'
                  }`} />
                </div>
                <span className={severityClass(asset.currentRisk)}>{severityText(asset.currentRisk)}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 truncate">{asset.name}</h3>
              <div className="space-y-1 font-mono text-[10px] text-slate-500">
                <div className="flex justify-between"><span>TYPE</span><span className="text-slate-400">{asset.type.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span>CRITICALITY</span><span className="text-slate-400 uppercase">{asset.criticality}</span></div>
                <div className="flex justify-between"><span>OWNER</span><span className="text-slate-400">{asset.owner}</span></div>
                <div className="flex justify-between"><span>RISK SCORE</span><span className="text-slate-400">{asset.riskScore}/100</span></div>
                <div className="flex justify-between items-center"><span>IP</span><span className="text-slate-400">{asset.ip}</span></div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span className="text-slate-400">{asset.location}</span></div>
              </div>
              {asset.relatedIncidents.length > 0 && (
                <div className="mt-3 pt-2 border-t border-ink-700/50">
                  <div className="font-mono text-[10px] text-slate-500 mb-1">RELATED INCIDENTS</div>
                  {asset.relatedIncidents.map((inc) => (
                    <span key={inc} className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">{inc}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
