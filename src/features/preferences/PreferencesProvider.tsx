import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'emerald' | 'amber';

export interface PreferencesState {
  mode: ThemeMode;
  accent: AccentColor;
  logoUrl: string | null;
}

interface PreferencesContextValue extends PreferencesState {
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  setLogoUrl: (url: string | null) => void;
  reset: () => void;
}

const DEFAULT_PREFERENCES: PreferencesState = {
  mode: 'light',
  accent: 'blue',
  logoUrl: null,
};

const STORAGE_KEY = 'tm-preferences';

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

const applyDocumentTheme = (prefs: PreferencesState) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', prefs.mode);
  document.documentElement.setAttribute('data-accent', prefs.accent);
  document.documentElement.style.setProperty('color-scheme', prefs.mode);
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<PreferencesState>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PreferencesState;
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        applyDocumentTheme(parsed);
      } catch (error) {
        console.error('No se pudieron cargar las preferencias', error);
      }
    } else {
      applyDocumentTheme(DEFAULT_PREFERENCES);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    applyDocumentTheme(preferences);
  }, [preferences]);

  const setMode = (mode: ThemeMode) => setPreferences((prev) => ({ ...prev, mode }));
  const setAccent = (accent: AccentColor) => setPreferences((prev) => ({ ...prev, accent }));
  const setLogoUrl = (url: string | null) => setPreferences((prev) => ({ ...prev, logoUrl: url }));
  const reset = () => setPreferences(DEFAULT_PREFERENCES);

  const value: PreferencesContextValue = {
    ...preferences,
    setMode,
    setAccent,
    setLogoUrl,
    reset,
  };

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = (): PreferencesContextValue => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences debe usarse dentro de PreferencesProvider');
  }
  return ctx;
};
