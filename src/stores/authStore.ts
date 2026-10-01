import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT } from '@constants/student';

export interface AuthState {
  token: string | null;
  phoneOrEmail: string | null;
  login: (token: string, phoneOrEmail?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      phoneOrEmail: null,
      login: (token: string, phoneOrEmail?: string) =>
        set({ token, phoneOrEmail: phoneOrEmail || null }),
      logout: () => set({ token: null, phoneOrEmail: null }),
    }),
    {
      name: `ktxgo-auth-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
