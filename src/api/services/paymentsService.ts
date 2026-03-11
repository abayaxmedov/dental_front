import axiosInstance from '../axios';
import type { Payment, PaymentMethod } from '../../types';
import { asArray, normalizePaymentMethod } from '../utils';

const paymentsService = {
    create: async (data: { appointment: number; amount: number; method: PaymentMethod; transaction_id?: string }): Promise<Payment> => {
        const response = await axiosInstance.post('/payments/', {
            ...data,
            method: normalizePaymentMethod(data.method),
        });
        return response.data;
    },

    getByAppointment: async (appointmentId: number): Promise<Payment | null> => {
        const response = await axiosInstance.get('/payments/', {
            params: { appointment: appointmentId },
        });
        const results = asArray<Payment>(response.data);
        return results[0] ?? null;
    },
};

export default paymentsService;
