import axiosInstance from '../axios';
import type { AuthTokens } from '../../types';

export interface RegisterData {
    username: string;
    email?: string;
    phone_number?: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
}

export interface LoginData {
    username: string;
    password: string;
}

const authService = {
    register: async (data: RegisterData) => {
        const response = await axiosInstance.post('/accounts/register/', data);
        return response.data;
    },

    login: async (data: LoginData): Promise<AuthTokens> => {
        const response = await axiosInstance.post('/accounts/login/', data);
        const { access, refresh, user } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};

export default authService;
