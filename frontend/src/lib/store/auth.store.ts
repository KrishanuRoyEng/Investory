import { create } from 'zustand';
import { queryClient } from './query';

export type Role = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  
  // Actions
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  setStatus: (status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'idle',

  setAuth: (accessToken, user) => 
    set({ accessToken, user, status: 'authenticated' }),

  clearAuth: () => 
    set({ accessToken: null, user: null, status: 'unauthenticated' }),

  setStatus: (status) => 
    set({ status }),
}));

export const logout = async () => {
  useAuthStore.getState().clearAuth();
  queryClient.clear();
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    console.error('Logout request failed', e);
  }
  if (typeof window !== 'undefined') {
    window.location.assign('/login');
  }
};
