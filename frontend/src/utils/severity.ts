import { type Severity } from '@/types';

export function severityClass(s: Severity): string {
  switch (s) {
    case 'low': return 'severity-low';
    case 'medium': return 'severity-medium';
    case 'high': return 'severity-high';
    case 'critical': return 'severity-critical';
  }
}

export function severityColor(s: Severity): string {
  switch (s) {
    case 'low': return 'text-risk-low';
    case 'medium': return 'text-risk-medium';
    case 'high': return 'text-risk-high';
    case 'critical': return 'text-risk-critical';
  }
}

export function severityText(s: Severity): string {
  return s.toUpperCase();
}

export function evidenceLabel(e: 'confirmed' | 'inferred' | 'possible' | 'unknown'): string {
  return e.toUpperCase();
}

export function evidenceColor(e: 'confirmed' | 'inferred' | 'possible' | 'unknown'): string {
  switch (e) {
    case 'confirmed': return 'text-cyber-green border-cyber-green/30 bg-cyber-green/10';
    case 'inferred': return 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/10';
    case 'possible': return 'text-risk-high border-risk-high/30 bg-risk-high/10';
    case 'unknown': return 'text-slate-500 border-slate-600 bg-slate-800/50';
  }
}
