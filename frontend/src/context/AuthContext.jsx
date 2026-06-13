import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    if (!localStorage.getItem('access_token')) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/me/');
      setUser(data);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    const handleExpired = () => setUser(null);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const login = async (username, password) => {
    const { data: tokens } = await api.post('/token/', { username, password });
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    const { data: profile } = await api.get('/me/');
    setUser(profile);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout, setUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
