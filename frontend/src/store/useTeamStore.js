import { create } from 'zustand';
import * as teamApi from '../api/teamApi';

export const useTeamStore = create((set, get) => ({
  // State
  teamMembers: [],
  availableEmployees: [],
  loading: {
    team: false,
    available: false,
    add: false,
    remove: false,
  },
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // Load team members
  loadTeamMembers: async () => {
    set({ loading: { ...get().loading, team: true }, error: null });
    try {
      const { data } = await teamApi.getTeamMembers();
      set({ 
        teamMembers: data, 
        loading: { ...get().loading, team: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load team members', 
        loading: { ...get().loading, team: false } 
      });
      throw error;
    }
  },

  // Load available employees
  loadAvailableEmployees: async () => {
    set({ loading: { ...get().loading, available: true }, error: null });
    try {
      const { data } = await teamApi.getAvailableEmployees();
      set({ 
        availableEmployees: data, 
        loading: { ...get().loading, available: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load available employees', 
        loading: { ...get().loading, available: false } 
      });
      throw error;
    }
  },

  // Add team member
  addTeamMember: async (employeeId) => {
    set({ loading: { ...get().loading, add: true }, error: null });
    try {
      const { data } = await teamApi.addTeamMember(employeeId);
      // Refresh team members after adding
      await get().loadTeamMembers();
      // Refresh available employees
      await get().loadAvailableEmployees();
      set({ loading: { ...get().loading, add: false } });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to add team member', 
        loading: { ...get().loading, add: false } 
      });
      throw error;
    }
  },

  // Remove team member
  removeTeamMember: async (employeeId) => {
    set({ loading: { ...get().loading, remove: true }, error: null });
    try {
      const { data } = await teamApi.removeTeamMember(employeeId);
      // Refresh team members after removing
      await get().loadTeamMembers();
      // Refresh available employees
      await get().loadAvailableEmployees();
      set({ loading: { ...get().loading, remove: false } });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to remove team member', 
        loading: { ...get().loading, remove: false } 
      });
      throw error;
    }
  },

  // Load all team data
  loadAllTeamData: async () => {
    try {
      await Promise.all([
        get().loadTeamMembers(),
        get().loadAvailableEmployees(),
      ]);
    } catch (error) {
      console.error('Failed to load team data:', error);
    }
  },
})); 