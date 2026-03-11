// API uchun TypeScript turlar

export interface User {
    id: number;
    username: string;
    email: string | null;
    phone_number: string | null;
    first_name: string;
    last_name: string;
    user_image: string | null;
}

export interface AuthTokens {
    access: string;
    refresh: string;
    user: User;
}

export interface Specialization {
    id: number;
    name: string;
    icon: string | null;
    description: string;
    created_at: string;
}

export interface Doctor {
    id: number;
    user: User;
    specialization: Specialization | null;
    hospital_name: string;
    experience_years: number;
    consultation_fee: string;
    rating: number;
    patients_count: number;
    bio: string;
    image: string | null;
    is_available: boolean;
    created_at: string;
}

export interface Patient {
    id: number;
    user: User;
    blood_type: string;
    allergies: string;
    medical_history: string;
    emergency_contact: string;
    emergency_contact_name: string;
    image: string | null;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
    id: number;
    doctor: number;
    patient: number;
    doctor_details: Doctor;
    patient_details: Patient | null;
    date: string;
    time: string;
    status: AppointmentStatus;
    notes: string;
    created_at: string;
}

export interface Review {
    id: number;
    doctor: number;
    patient: number;
    patient_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export type PaymentMethod = 'CARD' | 'CASH' | 'PAYME' | 'CLICK';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
    id: number;
    appointment: number;
    amount: string;
    method: PaymentMethod;
    transaction_id: string | null;
    status: PaymentStatus;
    created_at: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
