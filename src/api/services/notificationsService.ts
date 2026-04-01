import axiosInstance from '../axios';
import type { Notification } from '../../types';
import { asArray } from '../utils';

const notificationsService = {
    getAll: async (filters?: { is_read?: boolean }): Promise<Notification[]> => {
        const params: Record<string, string> = {};

        if (typeof filters?.is_read === 'boolean') {
            params.is_read = String(filters.is_read);
        }

        const response = await axiosInstance.get('/notifications/', { params });
        return asArray<Notification>(response.data);
    },

    markRead: async (id: number): Promise<void> => {
        await axiosInstance.patch(`/notifications/${id}/`, { is_read: true });
    },

    markAllRead: async (): Promise<void> => {
        await axiosInstance.post('/notifications/mark-all-read/');
    },
};

export default notificationsService;
