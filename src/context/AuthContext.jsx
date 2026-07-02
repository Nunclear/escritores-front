import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, storage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(Boolean(storage.getAccessToken()));

  useEffect(() => {
    let mounted = true;
    if (!storage.getAccessToken()) {
      setLoading(false);
      return undefined;
    }
    api.auth.me()
      .then((me) => { if (mounted) { setUser(me); storage.setUser(me); } })
      .catch(() => { storage.clear(); if (mounted) setUser(null); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function login(credentials) {
    const result = await api.auth.login(credentials);
    storage.setAccessToken(result.accessToken);
    storage.setRefreshToken(result.refreshToken);
    storage.setUser(result.user);
    setUser(result.user);
    return result;
  }

  async function register(data) { return api.auth.register(data); }

  async function logout() {
    const refreshToken = storage.getRefreshToken();
    try { if (refreshToken) await api.auth.logout(refreshToken); }
    finally { storage.clear(); setUser(null); }
  }

  const value = useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
