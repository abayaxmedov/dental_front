import type { Appointment, Doctor, Payment, Review, Specialization } from '../types';

const FALLBACK_API_BASE = 'http://localhost:8000';

const inferApiOrigin = () => {
    const configuredOrigin = import.meta.env.VITE_API_ORIGIN;
    if (configuredOrigin) return configuredOrigin.replace(/\/$/, '');

    if (typeof window !== 'undefined') {
        const { protocol, hostname } = window.location;
        const port = import.meta.env.VITE_API_PORT || '8000';
        return `${protocol}//${hostname}:${port}`;
    }

    return FALLBACK_API_BASE;
};

export const API_ORIGIN = inferApiOrigin();

const isLoopbackHost = (hostname: string) => ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname);

export const toMediaUrl = (path?: string | null) => {
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://')) {
        try {
            const url = new URL(path);
            if (!isLoopbackHost(url.hostname)) return path;
            return `${API_ORIGIN}${url.pathname}${url.search}${url.hash}`;
        } catch {
            return path;
        }
    }

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
