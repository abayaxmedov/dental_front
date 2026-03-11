import axiosInstance from '../axios';
import type { Patient } from '../../types';
import { asArray } from '../utils';

const patientsService = {
    getCurrent: async (): Promise<Patient | null> => {
        const response = await axiosInstance.get('/patients/');
        return asArray<Patient>(response.data)[0] ?? null;
    },
};

export default patientsService;
