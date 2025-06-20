import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/authApi';

export const useAuthStore = create(persist((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  role: null,
  setRole: (role) => set({ role }),
  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authApi.login(formData);
      set({ token: data.access_token });
      const me = await authApi.getMe();
      set({ user: me.data, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.detail || 'Login failed', loading: false });
      return false;
    }
  },
  logout: () => {
    set({ user: null, token: null });
  },
  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await authApi.getMe();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  }
}), {
  name: 'auth', // storage key
  partialize: (state) => ({ user: state.user, token: state.token, role: state.role }),
}));
