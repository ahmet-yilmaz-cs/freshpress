import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { storage } from './storage';

/** App preferences toggled in Settings. Persisted to device storage. */
export type Preferences = {
  notifications: boolean;
  quietHours: boolean;
  metric: boolean;
  analytics: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  notifications: true,
  quietHours: false,
  metric: true,
  analytics: false,
};

const STORAGE_KEY = 'fp.preferences';

type PreferencesContextValue = {
  prefs: Preferences;
  loaded: boolean;
  setPref: (key: keyof Preferences, value: boolean) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState(false);

  // Restore saved preferences on startup.
  useEffect(() => {
    storage
      .get(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setPrefs({ ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) });
          } catch {
            // ignore corrupt value, fall back to defaults
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  function setPref(key: keyof Preferences, value: boolean) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      void storage.set(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <PreferencesContext.Provider value={{ prefs, loaded, setPref }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within <PreferencesProvider>');
  return ctx;
}
