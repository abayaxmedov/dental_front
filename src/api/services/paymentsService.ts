import axiosInstance from '../axios';
import type { Payment, PaymentMethod } from '../../types';
import { asArray, normalizePaymentMethod } from '../utils';

export interface CreatePaymentData {
    appointment: number;
    method: PaymentMethod;
    transaction_id?: string;
}

const paymentsService = {
    create: async (data: CreatePaymentData): Promise<Payment> => {
        const response = await axiosInstance.post('/payments/', {
            appointment: data.appointment,
            method: normalizePaymentMethod(data.method),
            transaction_id: data.transaction_id,
        });
        const payment = await paymentsService.getByAppointment(response.data.appointment);
        if (!payment) {
            throw new Error('To\'lov ma\'lumotini yuklab bo\'lmadi.');
        }
        return payment;
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
