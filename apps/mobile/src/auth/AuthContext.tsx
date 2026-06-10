import type { User } from '@freshpress/types';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { api, RequestError } from '../api/client';
import { storage, StorageKeys } from '../lib/storage';

type AuthState = {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  appleSignIn: () => Promise<void>;
  updateProfile: (input: { name?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, status: 'loading' });

  // Bootstrap: try to restore a session from stored tokens.
  useEffect(() => {
    (async () => {
      const access = await storage.get(StorageKeys.accessToken);
      if (!access) return setState({ user: null, status: 'unauthenticated' });
      try {
        const { user } = await api.me(access);
        setState({ user, status: 'authenticated' });
      } catch {
        await storage.remove(StorageKeys.accessToken);
        await storage.remove(StorageKeys.refreshToken);
        setState({ user: null, status: 'unauthenticated' });
      }
    })();
  }, []);

  async function persist(tokens: { accessToken: string; refreshToken: string }) {
    await storage.set(StorageKeys.accessToken, tokens.accessToken);
    await storage.set(StorageKeys.refreshToken, tokens.refreshToken);
  }

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      async login(email, password) {
        const { user, tokens } = await api.login({ email, password });
        await persist(tokens);
        setState({ user, status: 'authenticated' });
      },
      async register(name, email, password) {
        const { user, tokens } = await api.register({ name, email, password });
        await persist(tokens);
        setState({ user, status: 'authenticated' });
      },
      async appleSignIn() {
        const { user, tokens } = await api.appleSignIn();
        await persist(tokens);
        setState({ user, status: 'authenticated' });
      },
      async updateProfile(input) {
        if (!state.user) return;
        const { user } = await api.updateProfile(state.user.id, input);
        setState({ user, status: 'authenticated' });
      },
      async logout() {
        await storage.remove(StorageKeys.accessToken);
        await storage.remove(StorageKeys.refreshToken);
        setState({ user: null, status: 'unauthenticated' });
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export { RequestError };
