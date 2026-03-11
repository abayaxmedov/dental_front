import { create } from 'zustand';
import type { User } from '../types';
import authService from '../api/services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    initialize: () => {
        const user = authService.getCurrentUser();
        const token = localStorage.getItem('access_token');
        if (user && token) {
            set({ user, isAuthenticated: true });
        }
    },

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
    },
}));
