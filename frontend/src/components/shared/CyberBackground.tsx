"use client";

import { useMemo } from 'react';

export function CyberBackground({ variant = 'grid' }: { variant?: 'grid' | 'hex' | 'particles' }) {
  if (variant === 'particles') return <ParticleField />;
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${variant === 'hex' ? 'hex-grid' : 'cyber-grid-animated'} opacity-60`} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950/80" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyber-cyan/5 blur-[120px]" aria-hidden />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyber-violet/5 blur-[120px]" aria-hidden />
    </div>
  );
}

function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 1 + Math.random() * 2,
    })), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      {particles.map((p, i) => (
        <div key={i} className="absolute bottom-0 rounded-full bg-cyber-cyan/40 animate-floatUp"
          style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-ink-950/80" />
    </div>
  );
}

export function Scanline() {
  return (
    <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent animate-scanline" />
    </div>
  );
}
