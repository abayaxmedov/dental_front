import axiosInstance from '../axios';
import type { Doctor, Specialization } from '../../types';
import { asArray, extractSpecializations } from '../utils';

export interface DoctorFilters {
    specialization?: number;
    search?: string;
    ordering?: string;
}

const doctorsService = {
    getAll: async (filters?: DoctorFilters): Promise<Doctor[]> => {
        const params: Record<string, string | number> = {};
        if (filters?.specialization) params.specialization = filters.specialization;
        if (filters?.search) params.search = filters.search;
        if (filters?.ordering) params.ordering = filters.ordering;
        const response = await axiosInstance.get('/doctors/', { params });
        return asArray<Doctor>(response.data);
    },

    getById: async (id: number): Promise<Doctor> => {
        const response = await axiosInstance.get(`/doctors/${id}/`);
        return response.data;
    },

    getSpecializations: async (): Promise<Specialization[]> => {
        try {
            const response = await axiosInstance.get('/doctors/specializations/');
            return asArray<Specialization>(response.data);
        } catch {
            const doctors = await doctorsService.getAll();
            return extractSpecializations(doctors);
        }
    },
};

export default doctorsService;
