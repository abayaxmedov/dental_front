import axiosInstance from '../axios';
import type { Appointment, AppointmentStatus } from '../../types';
import { asArray, normalizeAppointment } from '../utils';

export interface CreateAppointmentData {
    doctor: number;
    date: string;
    time: string;
    notes?: string;
}

const appointmentsService = {
    getAll: async (filters?: { status?: AppointmentStatus }): Promise<Appointment[]> => {
        const params: Record<string, string> = {};
        if (filters?.status) params.status = filters.status;
        const response = await axiosInstance.get('/appointments/', { params });
        return asArray<Appointment>(response.data).map(normalizeAppointment);
    },

    getById: async (id: number): Promise<Appointment> => {
        const response = await axiosInstance.get(`/appointments/${id}/`);
        return normalizeAppointment(response.data);
    },

    create: async (data: CreateAppointmentData): Promise<Appointment> => {
        const response = await axiosInstance.post('/appointments/', data);
        return normalizeAppointment(response.data);
    },

    cancel: async (id: number): Promise<Appointment> => {
        const response = await axiosInstance.patch(`/appointments/${id}/`, { status: 'cancelled' });
        return normalizeAppointment(response.data);
    },
};

export default appointmentsService;
