import axiosInstance from '../axios';
import type { Appointment, AppointmentStatus } from '../../types';
import { asArray, normalizeAppointment } from '../utils';

export interface CreateAppointmentData {
    doctor: number;
    notes?: string;
}

const appointmentsService = {
    getAll: async (filters?: { status?: AppointmentStatus; search?: string; ordering?: string }): Promise<Appointment[]> => {
        const params: Record<string, string> = {};
        if (filters?.status) params.status = filters.status;
        if (filters?.search) params.search = filters.search;
        if (filters?.ordering) params.ordering = filters.ordering;
        const response = await axiosInstance.get('/appointments/', { params });
        return asArray<Appointment>(response.data).map(normalizeAppointment);
    },

    getById: async (id: number): Promise<Appointment> => {
        const response = await axiosInstance.get(`/appointments/${id}/`);
        return normalizeAppointment(response.data);
    },

    create: async (data: CreateAppointmentData): Promise<Appointment> => {
        const response = await axiosInstance.post('/appointments/', data);
        return appointmentsService.getById(response.data.id);
    },

    cancel: async (id: number): Promise<Appointment> => {
        await axiosInstance.patch(`/appointments/${id}/`, { status: 'cancelled' });
        return appointmentsService.getById(id);
    },

    updateStatus: async (id: number, status: AppointmentStatus): Promise<Appointment> => {
        await axiosInstance.patch(`/appointments/${id}/`, { status });
        return appointmentsService.getById(id);
    },
};

export default appointmentsService;
