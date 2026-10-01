"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Brain, Bell, AlertTriangle, GitBranch, Clock, FileText,
  Gauge, Crosshair, ShieldCheck, Server, Lightbulb, FileBarChart, Monitor,
  Settings, Search, Volume2, VolumeX, User, Shield, Terminal, ChevronRight,
  Activity, Network, Radio, FlaskConical, BookOpen, LogOut, Menu, X,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { workflowSteps } from '@/data/simData';
import { motion, AnimatePresence } from 'framer-motion';
import type { Page } from '@/types';

const PAGE_ROUTE_MAP: Record<Page, string> = {
  'command-center': '/dashboard',
  'events': '/events',
  'ai-investigation': '/ai-investigation',
  'alerts': '/alerts',
  'incidents': '/incidents',
  'investigation': '/investigation',
  'attack-timeline': '/attack-timeline',
  'attack-graph': '/attack-graph',
  'attack-narrative': '/attack-narrative',
  'risk-intelligence': '/risk',
  'mitre': '/mitre',
  'grc': '/grc',
  'blast-radius': '/blast-radius',
  'evidence': '/evidence',
  'affected-assets': '/affected-assets',
  'recommendations': '/recommendations',
  'reports': '/reports',
  'executive-dashboard': '/executive-dashboard',
  'terminal': '/terminal',
  'settings': '/settings',
};

const navItems: { page: Page; label: string; icon: typeof Shield }[] = [
  { page: 'command-center', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'events', label: 'Events', icon: Activity },
  { page: 'alerts', label: 'Alerts', icon: Bell },
  { page: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { page: 'investigation', label: 'Investigation', icon: Search },
  { page: 'attack-timeline', label: 'Timeline', icon: Clock },
  { page: 'attack-graph', label: 'Attack Graph', icon: Network },
  { page: 'mitre', label: 'MITRE ATT&CK', icon: Crosshair },
  { page: 'risk-intelligence', label: 'Risk', icon: Gauge },
  { page: 'blast-radius', label: 'Blast Radius', icon: Radio },
  { page: 'grc', label: 'GRC', icon: ShieldCheck },
  { page: 'evidence', label: 'Evidence', icon: BookOpen },
  { page: 'ai-investigation', label: 'AI Assistant', icon: Brain },
  { page: 'reports', label: 'Reports', icon: FileBarChart },
  { page: 'attack-narrative', label: 'Attack Narrative', icon: FileText },
  { page: 'affected-assets', label: 'Affected Assets', icon: Server },
  { page: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  { page: 'executive-dashboard', label: 'Executive Dashboard', icon: Monitor },
  { page: 'terminal', label: 'Terminal Mode', icon: Terminal },
  { page: 'settings', label: 'Settings', icon: Settings },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { authed, commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authed && pathname !== '/login') {
      router.push('/login');
    }
  }, [authed, pathname, router]);

  useEffect(() => {
    // Close mobile drawer on navigation
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Standalone full-screen layout for login page
  if (pathname === '/login' || !authed) {
    return <main className="min-h-screen bg-ink-950 text-slate-200 overflow-x-hidden">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950 text-slate-200">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-72 bg-ink-900 border-r border-cyber-cyan/20 z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-cyber-cyan/10">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
                  <Shield className="w-6 h-6 text-cyber-cyan" />
                  <span className="font-mono text-sm font-bold tracking-wider text-white">THREAT<span className="text-cyber-cyan">2</span>RISK</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <MobileSidebarContent onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} mobileMenuOpen={mobileMenuOpen} />
        <WorkflowIndicator />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-3 sm:p-4 md:p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

function MobileSidebarContent({ onClose }: { onClose: () => void }) {
  const { audio } = useApp();
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const href = PAGE_ROUTE_MAP[item.page];
        const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
        return (
          <Link
            key={item.page}
            href={href}
            onClick={() => { audio.play('click'); onClose(); }}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs transition-colors ${
              active ? 'bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30' : 'text-slate-300 hover:bg-ink-800'
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cyber-cyan' : 'text-slate-400'}`} />
            <span className="truncate">{item.label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulseGlow" />}
          </Link>
        );
      })}
    </nav>
  );
}

function Sidebar() {
  const { audio } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 border-r border-cyber-cyan/10 bg-ink-900/50 backdrop-blur-md flex flex-col transition-all duration-200 z-40`}>
      <div className="h-16 flex items-center px-4 border-b border-cyber-cyan/10">
        <Link href="/dashboard" onClick={() => audio.play('click')} className="flex items-center gap-2.5 group">
          <div className="relative">
            <Shield className="w-7 h-7 text-cyber-cyan" />
            <div className="absolute inset-0 bg-cyber-cyan/30 blur-md rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-white">THREAT<span className="text-cyber-cyan">2</span>RISK</span>
              <span className="font-mono text-[9px] text-slate-500 tracking-widest">AI INTELLIGENCE</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = PAGE_ROUTE_MAP[item.page];
          const active = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
          return (
            <Link
              key={item.page}
              href={href}
              onClick={() => audio.play('click')}
              className={`nav-item w-full ${active ? 'nav-item-active' : ''} ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cyber-cyan' : ''}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulseGlow" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-cyber-cyan/10">
        <button onClick={() => { setCollapsed(!collapsed); audio.play('click'); }} className="nav-item w-full justify-center">
          <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
    </aside>
  );
}

function Header({ onToggleMobileMenu, mobileMenuOpen }: { onToggleMobileMenu: () => void; mobileMenuOpen: boolean }) {
  const { audio, setCommandPaletteOpen, currentUser, setAuthed } = useApp();
  const router = useRouter();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-16 flex-shrink-0 border-b border-cyber-cyan/10 bg-ink-900/50 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => { audio.play('click'); onToggleMobileMenu(); }}
          className="p-2 rounded-lg bg-ink-800/60 border border-ink-600 text-slate-300 hover:text-white md:hidden"
          aria-label="Toggle navigation drawer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-cyber-cyan" /> : <Menu className="w-5 h-5 text-cyber-cyan" />}
        </button>

        <h1 className="text-base sm:text-lg font-bold text-white font-mono tracking-wide">Threat<span className="text-cyber-cyan">2</span>Risk <span className="text-xs text-slate-500 font-mono">AI</span></h1>
        <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-ink-700">
          {['SIEM', 'AI', 'RISK'].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulseGlow" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{s} Online</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => { setCommandPaletteOpen(true); audio.play('click'); }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-800/60 border border-ink-600 hover:border-cyber-cyan/40 transition-colors group">
          <Search className="w-4 h-4 text-slate-500 group-hover:text-cyber-cyan transition-colors" />
          <span className="font-mono text-xs text-slate-500 hidden md:inline">Command</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-ink-700 font-mono text-[10px] text-slate-400 border border-ink-600">⌘K</kbd>
        </button>
        <button onClick={() => { audio.toggle(); audio.play('click'); }} className="p-2 rounded-lg bg-ink-800/60 border border-ink-600 hover:border-cyber-cyan/40 transition-colors" title="Toggle sound">
          {audio.settings.enabled ? <Volume2 className="w-4 h-4 text-cyber-cyan" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
        <button onClick={() => { router.push('/alerts'); audio.play('click'); }} className="relative p-2 rounded-lg bg-ink-800/60 border border-ink-600 hover:border-cyber-cyan/40 transition-colors">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-risk-critical text-[9px] font-bold text-white flex items-center justify-center font-mono">8</span>
        </button>
        <div className="hidden md:flex flex-col items-end font-mono text-xs">
          <span className="text-cyber-cyan">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
          <span className="text-slate-500 text-[10px]">{time.toISOString().slice(0, 10)} UTC</span>
        </div>
        <button onClick={() => { router.push('/settings'); audio.play('click'); }} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-ink-800/60 border border-ink-600 hover:border-cyber-cyan/40 transition-colors">
          <div className="w-7 h-7 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 flex items-center justify-center">
            <User className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-xs text-slate-200 font-medium">{currentUser.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">{currentUser.clearance}</span>
          </div>
        </button>
        <button
          onClick={() => {
            audio.play('click');
            setAuthed(false);
            router.push('/login');
          }}
          className="p-2 rounded-lg bg-ink-800/60 border border-ink-600 hover:border-risk-critical/50 hover:bg-risk-critical/10 transition-colors text-slate-400 hover:text-risk-critical"
          title="Secure Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

function WorkflowIndicator() {
  const { audio } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const getStepIndex = (key: string) => {
    const route = PAGE_ROUTE_MAP[key as Page];
    if (pathname === route) return true;
    return false;
  };

  return (
    <div className="flex-shrink-0 border-b border-cyber-cyan/10 bg-ink-900/30 px-6 py-2 overflow-x-auto z-20">
      <div className="flex items-center gap-1 min-w-max">
        <span className="section-title mr-3 whitespace-nowrap">Investigation Pipeline</span>
        {workflowSteps.map((step, i) => {
          const route = PAGE_ROUTE_MAP[step.key as Page] || '/dashboard';
          const current = getStepIndex(step.key);
          return (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => { router.push(route); audio.play('click'); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all ${
                  current ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${current ? 'bg-cyber-cyan animate-pulseGlow' : 'bg-slate-700'}`} />
                {step.label}
              </button>
              {i < workflowSteps.length - 1 && <div className="w-4 h-px bg-ink-700" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, audio } = useApp();
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => { if (!commandPaletteOpen) setQuery(''); }, [commandPaletteOpen]);

  const commands: { label: string; action: () => void; hint: string }[] = [
    { label: 'investigate incident INC-2026-001', action: () => router.push('/investigation'), hint: 'Investigation' },
    { label: 'show security events', action: () => router.push('/events'), hint: 'Events' },
    { label: 'show critical alerts', action: () => router.push('/alerts'), hint: 'Alert center' },
    { label: 'find analyst activity', action: () => router.push('/attack-timeline'), hint: 'Timeline' },
    { label: 'explain risk', action: () => router.push('/risk'), hint: 'Risk' },
    { label: 'show blast radius', action: () => router.push('/blast-radius'), hint: 'Blast radius' },
    { label: 'map to MITRE', action: () => router.push('/mitre'), hint: 'MITRE ATT&CK' },
    { label: 'view evidence ledger', action: () => router.push('/evidence'), hint: 'Evidence' },
    { label: 'generate executive report', action: () => router.push('/reports'), hint: 'Reports' },
    { label: 'open AI assistant', action: () => router.push('/ai-investigation'), hint: 'AI assistant' },
    { label: 'open terminal mode', action: () => router.push('/terminal'), hint: 'Terminal' },
    { label: 'open settings', action: () => router.push('/settings'), hint: 'Configuration' },
  ];
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)} className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }} className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-50">
            <div className="glass-panel-strong overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-cyber-cyan/10">
                <span className="font-mono text-cyber-cyan text-sm">&gt;</span>
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setCommandPaletteOpen(false); if (e.key === 'Enter' && filtered[0]) { filtered[0].action(); setCommandPaletteOpen(false); } }}
                  className="flex-1 bg-transparent font-mono text-sm text-slate-200 placeholder-slate-600 focus:outline-none" placeholder="enter command..." />
                <kbd className="font-mono text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-ink-700 border border-ink-600">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {filtered.map((cmd, i) => (
                  <button key={i} onClick={() => { cmd.action(); audio.play('click'); setCommandPaletteOpen(false); }} onMouseEnter={() => audio.play('click')}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-cyber-cyan/10 transition-colors group">
                    <span className="font-mono text-sm text-slate-300 group-hover:text-cyber-cyan">{cmd.label}</span>
                    <span className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">{cmd.hint}</span>
                  </button>
                ))}
                {filtered.length === 0 && <div className="px-4 py-3 font-mono text-sm text-slate-600">No matching commands.</div>}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
