"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Shield, Activity, Brain, Radar, AlertTriangle, FileText, Lock, ChevronRight,
  Terminal, Fingerprint, KeyRound, CheckCircle2, UserPlus, AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { CyberBackground, Scanline } from '@/components/shared/CyberBackground';
import { useApp } from '@/store/AppContext';
import { useTypewriter } from '@/hooks/useAnimations';
import {
  findUserByEmail,
  verifyUserCredentials,
  registerNewUser,
  type StoredUser
} from '@/data/usersData';

type LoginPhase = 'landing' | 'auth' | 'booting' | 'granted';

export function LoginExperience() {
  const router = useRouter();
  const [phase, setPhase] = useState<LoginPhase>('landing');
  const { setAuthed, audio } = useApp();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CyberBackground variant="particles" />
      <Scanline />
      <AnimatePresence mode="wait">
        {phase === 'landing' && (
          <motion.div key="landing" exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }} transition={{ duration: 0.5 }}>
            <LandingScreen onEnter={() => { audio.play('click'); setPhase('auth'); }} />
          </motion.div>
        )}
        {phase === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.4 }}>
            <AuthScreen onAccess={() => { audio.play('success'); setPhase('booting'); }} />
          </motion.div>
        )}
        {phase === 'booting' && (
          <motion.div key="booting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(12px)' }} transition={{ duration: 0.3 }}>
            <BootSequence onComplete={() => { audio.play('success'); setAuthed(true); router.push('/dashboard'); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingScreen({ onEnter }: { onEnter: () => void }) {
  const { audio } = useApp();
  const tagline = useTypewriter('From Security Alerts to Explainable Risk Intelligence.', 35, 500);
  const systemStatus = [
    { label: 'SIEM CONNECTION', icon: Activity },
    { label: 'AI ENGINE', icon: Brain },
    { label: 'THREAT INTELLIGENCE', icon: Radar },
    { label: 'RISK ENGINE', icon: AlertTriangle },
    { label: 'GRC ENGINE', icon: FileText },
    { label: 'REPORT ENGINE', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-cyan/10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Shield className="w-7 h-7 text-cyber-cyan" />
            <div className="absolute inset-0 bg-cyber-cyan/30 blur-md rounded-full" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-wider text-cyber-cyan">THREAT2RISK</span>
          <span className="font-mono text-sm font-semibold tracking-wider text-slate-600">AI</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulseGlow" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1, type: 'spring' }} className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-cyber-cyan/30 animate-spinSlow" />
            <div className="absolute inset-2 rounded-full border border-cyber-violet/20 animate-spinSlow" style={{ animationDirection: 'reverse' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Shield className="w-10 h-10 text-cyber-cyan" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-cyber-cyan/20 blur-xl rounded-full" />
              </div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-3">
            <span className="text-white">THREAT</span><span className="text-cyber-cyan neon-text-cyan">2</span><span className="text-white">RISK</span>
            <span className="text-slate-600 ml-2 text-3xl md:text-5xl">AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 font-mono mb-2 min-h-[28px]">
            {tagline.displayed}
            <span className="inline-block w-2 h-5 bg-cyber-cyan ml-0.5 animate-blink align-middle" />
          </p>
          <p className="text-sm text-slate-500 font-mono tracking-widest uppercase mb-10">
            Investigate · Correlate · Understand · Quantify · Act
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onEnter} onMouseEnter={() => audio.play('click')} className="btn-cyber group px-8 py-3.5 text-base">
              <Terminal className="w-5 h-5" />
              ENTER SECURITY COMMAND CENTER
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-16 w-full max-w-md glass-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="section-title">System Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulseGlow" />
              <span className="font-mono text-xs text-cyber-green font-semibold">OPERATIONAL</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {systemStatus.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-ink-800/40 border border-ink-700/50">
                  <Icon className="w-4 h-4 text-cyber-cyan/60" />
                  <span className="font-mono text-[11px] text-slate-400 flex-1">{s.label}</span>
                  <span className="font-mono text-[11px] text-cyber-green font-semibold">ONLINE</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-4 border-t border-cyber-cyan/10 flex items-center justify-between font-mono text-[11px] text-slate-600">
        <span>v2.4.1 · BUILD 20260817</span>
        <span>SECURE TERMINAL · ENCRYPTED CHANNEL</span>
      </div>
    </div>
  );
}

function AuthScreen({ onAccess }: { onAccess: () => void }) {
  const { audio, setCurrentUser } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state - EMPTY inputs by default!
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regKey, setRegKey] = useState('');
  const [regConfirmKey, setRegConfirmKey] = useState('');
  const [regClearance, setRegClearance] = useState('L4 Clearance');

  // Boot animation state
  const [verifying, setVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const verifySteps = [
    'Verifying TLS 1.3 encrypted handshake...',
    'Authenticating identity against registered dataset...',
    'Checking analyst clearance level...',
    'Session token issued. Launching Security Command Center...',
  ];

  useEffect(() => {
    if (!verifying) return;
    if (verifyStep < verifySteps.length) {
      const t = setTimeout(() => {
        setVerifyStep((s) => s + 1);
        audio.play('terminalType');
      }, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onAccess, 500);
    return () => clearTimeout(t);
  }, [verifying, verifyStep, audio, onAccess, verifySteps.length]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    audio.play('click');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your registered Email and Access Key.');
      audio.play('alert');
      return;
    }

    // Strict Credential Verification against registered dataset
    const authResult = verifyUserCredentials(email.trim(), password.trim());
    if (!authResult.success || !authResult.user) {
      setErrorMessage(authResult.error || 'Authentication failed.');
      audio.play('alert');
      return;
    }

    // Credentials valid -> Authenticate & launch boot sequence!
    setCurrentUser({
      name: authResult.user.name,
      email: authResult.user.email,
      clearance: authResult.user.clearance,
      role: authResult.user.role,
    });

    setVerifying(true);
    setVerifyStep(0);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    audio.play('click');

    if (!regName.trim() || !regEmail.trim() || !regKey.trim()) {
      setErrorMessage('All fields are required for Analyst Registration.');
      audio.play('alert');
      return;
    }

    if (regKey !== regConfirmKey) {
      setErrorMessage('Access Keys (Passwords) do not match.');
      audio.play('alert');
      return;
    }

    // Save user to registered database
    const newUserObj: StoredUser = {
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      accessKey: regKey,
      clearance: regClearance,
      role: 'Security Investigator',
    };

    const regResult = registerNewUser(newUserObj);
    if (!regResult.success) {
      setErrorMessage(regResult.error || 'Registration failed.');
      audio.play('alert');
      return;
    }

    // Registration successful -> pre-fill login email & show notice
    setSuccessMessage(`REGISTRATION SUCCESSFUL! Analyst "${newUserObj.name}" registered. You can now enter your Access Key to log in.`);
    audio.play('success');
    setTab('login');
    setEmail(newUserObj.email);
    setPassword('');
    setRegName('');
    setRegEmail('');
    setRegKey('');
    setRegConfirmKey('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-6 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="glass-panel-strong p-4 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyber-cyan/40 rounded-tl-xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyber-cyan/40 rounded-br-xl" />

          {/* Sub-Tab Selector */}
          <div className="flex items-center justify-center gap-2 mb-6 p-1 bg-ink-900/80 rounded-xl border border-ink-700 font-mono text-xs">
            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(null); setSuccessMessage(null); audio.play('click'); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'login'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> SECURE ACCESS
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setErrorMessage(null); setSuccessMessage(null); audio.play('click'); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                tab === 'register'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> REGISTER ANALYST
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 mb-3 relative">
              {tab === 'login' ? <Lock className="w-6 h-6 text-cyber-cyan" /> : <UserPlus className="w-6 h-6 text-cyber-cyan" />}
              <div className="absolute inset-0 rounded-full bg-cyber-cyan/20 blur-md" />
            </div>
            <h2 className="text-xl font-bold text-white font-mono tracking-wide">
              {tab === 'login' ? 'SECURE ACCESS TERMINAL' : 'ANALYST REGISTRATION'}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {tab === 'login' ? 'IDENTITY VERIFICATION & ACCESS KEY AUTHENTICATION' : 'REGISTER NEW ANALYST IDENTITY & SET ACCESS KEY'}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 rounded-lg bg-cyber-green/10 border border-cyber-green/40 text-cyber-green font-mono text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">STATUS NOTICE</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-lg bg-risk-critical/15 border border-risk-critical/40 text-risk-critical font-mono text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">AUTHENTICATION ERROR</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {!verifying ? (
            tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-cyber-cyan/70 mb-1.5">Identity (Email)</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-ink-800/60 border border-ink-600 rounded-lg pl-10 pr-3 py-2.5 font-mono text-sm text-slate-200 focus:border-cyber-cyan/50 focus:outline-none transition-colors"
                      placeholder="e.g. kaustubh1006p@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-cyber-cyan/70 mb-1.5">Access Key (Password)</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-ink-800/60 border border-ink-600 rounded-lg pl-10 pr-3 py-2.5 font-mono text-sm text-slate-200 focus:border-cyber-cyan/50 focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-cyber w-full py-3.5 group mt-2">
                  <ShieldCheck className="w-4 h-4" /> SECURE ACCESS <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Full Analyst Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-ink-800/60 border border-ink-600 rounded-lg px-3 py-2 text-slate-200 focus:border-cyber-cyan/50 focus:outline-none"
                    placeholder="e.g. Kaustubh Pawar"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Analyst Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-ink-800/60 border border-ink-600 rounded-lg px-3 py-2 text-slate-200 focus:border-cyber-cyan/50 focus:outline-none"
                    placeholder="e.g. kaustubh1006p@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Access Key</label>
                    <input
                      type="password"
                      required
                      value={regKey}
                      onChange={(e) => setRegKey(e.target.value)}
                      className="w-full bg-ink-800/60 border border-ink-600 rounded-lg px-3 py-2 text-slate-200 focus:border-cyber-cyan/50 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Confirm Key</label>
                    <input
                      type="password"
                      required
                      value={regConfirmKey}
                      onChange={(e) => setRegConfirmKey(e.target.value)}
                      className="w-full bg-ink-800/60 border border-ink-600 rounded-lg px-3 py-2 text-slate-200 focus:border-cyber-cyan/50 focus:outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cyber-cyan/70 mb-1">Clearance Level</label>
                  <select
                    value={regClearance}
                    onChange={(e) => setRegClearance(e.target.value)}
                    className="w-full bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
                  >
                    <option value="L4 Clearance">L4 Lead Clearance</option>
                    <option value="L3 Senior Clearance">L3 Senior Investigator</option>
                    <option value="L2 Threat Clearance">L2 Threat Hunter</option>
                    <option value="Executive Clearance">Executive Clearance</option>
                  </select>
                </div>

                <button type="submit" className="btn-cyber w-full py-3.5 group mt-2">
                  <UserPlus className="w-4 h-4" /> REGISTER ANALYST & SET ACCESS KEY <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )
          ) : (
            <div className="py-4">
              <div className="font-mono text-xs space-y-2 mb-4">
                {verifySteps.slice(0, verifyStep + 1).map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
                    <span className="text-slate-400">{step}</span>
                  </motion.div>
                ))}
                {verifyStep < verifySteps.length && (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                    <span className="text-cyber-cyan">{verifySteps[verifyStep]}</span>
                  </div>
                )}
              </div>
              <div className="h-1 bg-ink-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green"
                  initial={{ width: '0%' }} animate={{ width: `${(verifyStep / verifySteps.length) * 100}%` }} transition={{ duration: 0.3 }} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const { audio, currentUser } = useApp();
  const lines = [
    '> ACCESS GRANTED',
    `> WELCOME ${currentUser.name.toUpperCase()} (${currentUser.clearance.toUpperCase()})`,
    '> INITIALIZING SECURITY INTELLIGENCE PLATFORM...',
    '> Loading SIEM connectors... OK',
    '> Loading AI investigation engine... OK',
    '> Loading risk intelligence engine... OK',
    '> Loading MITRE ATT&CK framework... OK',
    '> Loading GRC / ISO 27001 / NIST mappings... OK',
    '> Establishing secure telemetry feeds... OK',
    `> Security intelligence system ready for ${currentUser.email}.`,
  ];
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines < lines.length) {
      const t = setTimeout(() => { setVisibleLines((v) => v + 1); audio.play('terminalType'); }, 180);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [visibleLines, audio, onComplete, lines.length]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="glass-panel-strong p-8 font-mono text-sm">
          <div className="space-y-1.5">
            {lines.slice(0, visibleLines).map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={i === 0 ? 'text-cyber-green neon-text-green' : i === 1 ? 'text-cyber-cyan font-bold' : 'text-slate-400'}>
                {line}
              </motion.div>
            ))}
            {visibleLines < lines.length && (
              <div className="text-cyber-cyan"><span className="inline-block w-2 h-4 bg-cyber-cyan animate-blink align-middle" /></div>
            )}
          </div>
          {visibleLines >= lines.length && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-4 border-t border-cyber-cyan/20">
              <div className="flex items-center gap-2 text-cyber-green">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">SYSTEM READY — ENTERING COMMAND CENTER AS {currentUser.name.toUpperCase()}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
