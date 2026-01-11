'use client';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

import { API_ROUTES } from '@/config/routes';
import { AuthUser as User } from '@/types/auth.types';
import { getAccessToken } from '@/lib/axiosClient';
import { useGet } from '@/hooks/useApiQuery';

const AuthContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading:boolean
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const { resourceData: fetchedUser,loading } = useGet<User>(
    API_ROUTES.AUTH.ME 
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  // Fix: Pass an object to value prop, not comma-separated values
  return (
    <AuthContext.Provider value={{ user, setUser,loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
export const useRequiredAuth = () => {
  const context = useAuthContext();
  if (!context.user) {
      return useAuthContext()
  }
  return context 
};