import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StudentProfile, ParentProfile, RepProfile } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  profile: (StudentProfile & ParentProfile & RepProfile) | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, password: string, role?: UserRole) => Promise<User>;
  register: (data: { name: string; email: string; mobile: string; password: string; role: UserRole; inviteCode?: string }) => Promise<{ user: User; demoOtp?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<User>;
  resendOtp: (email: string) => Promise<string | undefined>;
  logout: () => void;
  quickDemoLogin: (role: UserRole) => Promise<User>;
  updateProfile: (data: any) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('campustour_token'));
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      if (!localStorage.getItem('campustour_token')) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const data = await api.get('/auth/me');
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem('campustour_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (identifier: string, password: string, role?: UserRole) => {
    const data = await api.post('/auth/login', { identifier, password, role });
    localStorage.setItem('campustour_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setProfile(data.profile);
    return data.user;
  };

  const register = async (regData: any) => {
    const data = await api.post('/auth/register', regData);
    if (data.token) {
      localStorage.setItem('campustour_token', data.token);
      setToken(data.token);
    }
    setUser(data.user);
    return { user: data.user, demoOtp: data.demoOtp };
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('campustour_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const resendOtp = async (email: string) => {
    const data = await api.post('/auth/resend-otp', { email });
    return data.demoOtp;
  };

  const logout = () => {
    localStorage.removeItem('campustour_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const quickDemoLogin = async (role: UserRole) => {
    const credentials: Record<UserRole, { email: string; pass: string }> = {
      student: { email: 'student@campustour.edu', pass: 'password123' },
      parent: { email: 'parent@campustour.edu', pass: 'password123' },
      rep: { email: 'rep@campustour.edu', pass: 'password123' },
      admin: { email: 'admin@campustour.edu', pass: 'password123' },
    };

    const cred = credentials[role];
    return login(cred.email, cred.pass, role);
  };

  const updateProfile = async (data: any) => {
    await api.put('/auth/profile', data);
    await refreshMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        quickDemoLogin,
        updateProfile,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
