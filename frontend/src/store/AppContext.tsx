"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useAudio, type AudioSettings, type SoundType } from '@/hooks/useAudio';
import type { Page } from '@/types';

export interface UserProfile {
  name: string;
  email: string;
  clearance: string;
  role: string;
}

interface AppState {
  page: Page;
  setPage: (p: Page) => void;
  navigate: (p: Page) => void;
  authed: boolean;
  setAuthed: (v: boolean) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  audio: {
    settings: AudioSettings;
    play: (type: SoundType) => void;
    toggle: () => void;
    update: (patch: Partial<AudioSettings>) => void;
  };
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  workflowStep: number;
  setWorkflowStep: (n: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const audio = useAudio();
  const [page, setPage] = useState<Page>('command-center');
  const [authed, setAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Analyst',
    email: 'analyst@threat2risk.io',
    clearance: 'L4 Clearance',
    role: 'Lead Security Investigator',
  });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-2026-001');
  const [workflowStep, setWorkflowStep] = useState(6);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    audio.play('navigate');
  }, [audio]);

  return (
    <AppContext.Provider value={{
      page, setPage, navigate, authed, setAuthed,
      currentUser, setCurrentUser, audio,
      commandPaletteOpen, setCommandPaletteOpen,
      selectedIncidentId, setSelectedIncidentId,
      workflowStep, setWorkflowStep,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
