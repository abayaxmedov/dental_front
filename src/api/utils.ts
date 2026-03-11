import type { Appointment, Doctor, Payment, Review, Specialization } from '../types';

const FALLBACK_API_BASE = 'http://localhost:8000';

export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || FALLBACK_API_BASE).replace(/\/$/, '');

export const toMediaUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

export const asArray = <T>(payload: T[] | { results?: T[] } | undefined | null): T[] => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    return payload.results ?? [];
};

export const extractSpecializations = (doctors: Doctor[]): Specialization[] => {
    const map = new Map<number, Specialization>();

    doctors.forEach((doctor) => {
        if (doctor.specialization) {
            map.set(doctor.specialization.id, doctor.specialization);
        }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const normalizeAppointment = (appointment: Appointment): Appointment => ({
    ...appointment,
    doctor_details: (appointment as Appointment & { doctor_details?: Doctor; doctor?: Doctor | number }).doctor_details
        ?? ((appointment as Appointment & { doctor?: Doctor | number }).doctor as Doctor),
    patient_details: (appointment as Appointment & { patient_details?: Appointment['patient_details'] }).patient_details ?? null,
    doctor: typeof appointment.doctor === 'number'
        ? appointment.doctor
        : (appointment.doctor as unknown as Doctor).id,
    patient: typeof appointment.patient === 'number'
        ? appointment.patient
        : ((appointment.patient as unknown as { id?: number })?.id ?? 0),
});

export const normalizeReview = (review: Review): Review => ({
    ...review,
    patient_name: review.patient_name || 'Foydalanuvchi',
});

export const normalizePaymentMethod = (value: string) => value.toUpperCase() as Payment['method'];
