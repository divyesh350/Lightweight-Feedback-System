import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/authApi';

export const useAuthStore = create(persist((set, get) => ({
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
      const token = data.access_token;
      localStorage.setItem('access_token', token);
      set({ 
        token: token, 
        role: data.role,
        loading: false 
      });
      const me = await authApi.getMe();
      set({ user: me.data });
      return { success: true, user: me.data, role: data.role };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
  register: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authApi.register(formData);
      set({ loading: false });
      return { success: true, user: data };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, role: null, error: null });
  },
  clearError: () => set({ error: null }),
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
