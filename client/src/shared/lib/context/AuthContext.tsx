'use client';
import  {
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

import { AuthUser } from '@/shared/types';

export const AuthContext = createContext<{
  user: AuthUser | null;
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  loading:boolean
} | null>(null);



