import axios from 'axios';
import { API_BASE_URL, buildApiUrl } from '../config/runtime';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: har so'rovga JWT token qo'shish
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: 401 da token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const res = await axios.post(buildApiUrl('/accounts/token/refresh/'), {
                        refresh: refreshToken,
                    });
                    const newAccess = res.data.access;
                    localStorage.setItem('access_token', newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return axiosInstance(originalRequest);
                } catch {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            } else {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
