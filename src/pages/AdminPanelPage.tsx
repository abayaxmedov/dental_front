import { useDeferredValue, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ClipboardList, Phone, Search, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import appointmentsService from '../api/services/appointmentsService';
import notificationsService from '../api/services/notificationsService';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthStore } from '../store/authStore';
import type { Appointment, AppointmentStatus } from '../types';

const statusLabels: Record<AppointmentStatus, string> = {
    confirmed: 'Tasdiqlangan',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan',
};

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('uz-UZ', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });

function StatusBadge({ status }: { status: AppointmentStatus }) {
    const classes: Record<AppointmentStatus, string> = {
        confirmed: 'bg-primary/10 text-primary',
        completed: 'bg-emerald-50 text-emerald-600',
        cancelled: 'bg-red-50 text-red-500',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${classes[status]}`}>
            {statusLabels[status]}
        </span>
    );
}

function AppointmentRow({
    appointment,
    onStatusChange,
    isPending,
}: {
    appointment: Appointment;
    onStatusChange: (status: AppointmentStatus) => void;
    isPending: boolean;
}) {
    return (
        <div className="bg-white rounded-[30px] p-5 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <p className="text-lg font-black text-gray-950">{appointment.patient_name}</p>
                    <p className="text-xs font-bold text-gray-400">Dr. {appointment.doctor_details.user.first_name} {appointment.doctor_details.user.last_name}</p>
                </div>
                <StatusBadge status={appointment.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Telefon</p>
                    <p className="text-sm font-black text-gray-800 flex items-center gap-2">
                        <Phone size={14} className="text-primary" />
                        {appointment.patient_phone || "Ko'rsatilmagan"}
                    </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Bron vaqti</p>
                    <p className="text-sm font-black text-gray-800">{formatDateTime(appointment.created_at)}</p>
                </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-4">
                <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Eslatma</p>
                <p className="text-sm font-bold text-primary/80">{appointment.notes || "Eslatma qoldirilmagan"}</p>
            </div>

            {appointment.status === 'confirmed' && (
                <div className="flex gap-3">
                    <button
                        onClick={() => onStatusChange('completed')}
                        disabled={isPending}
                        className="flex-1 py-3 rounded-2xl bg-emerald-50 text-emerald-600 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <CheckCircle2 size={16} /> Bajarildi
                    </button>
                    <button
                        onClick={() => onStatusChange('cancelled')}
                        disabled={isPending}
                        className="flex-1 py-3 rounded-2xl bg-red-50 text-red-500 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <XCircle size={16} /> Bekor qilish
                    </button>
                </div>
            )}
        </div>
    );
}

export default function AdminPanelPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuthStore();
    const [search, setSearch] = useState('');
    const deferredSearch = useDeferredValue(search);

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['admin-appointments', deferredSearch],
        queryFn: () => appointmentsService.getAll({
            ordering: '-created_at',
            search: deferredSearch.trim() || undefined,
        }),
        enabled: isAuthenticated && !!user?.is_staff,
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: () => notificationsService.getAll({ is_read: false }),
        enabled: isAuthenticated && !!user?.is_staff,
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
            appointmentsService.updateStatus(id, status),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }),
                queryClient.invalidateQueries({ queryKey: ['appointments'] }),
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['admin-notifications'] }),
            ]);
        },
    });

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-[#F8FAFC]">
                <span className="text-7xl mb-4">🛡️</span>
                <h3 className="text-xl font-black text-gray-900">Kirish talab qilinadi</h3>
                <p className="text-gray-400 font-bold text-center text-sm mb-6 max-w-[240px]">Admin panelga kirish uchun hisobingizga kiring</p>
                <button className="btn-primary px-10" onClick={() => navigate('/login')}>Kirish</button>
            </div>
        );
    }

    if (!user?.is_staff) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-[#F8FAFC]">
                <span className="text-7xl mb-4">🚫</span>
                <h3 className="text-xl font-black text-gray-900">Ruxsat yo'q</h3>
                <p className="text-gray-400 font-bold text-center text-sm mb-6 max-w-[260px]">Bu sahifa faqat administratorlar uchun ochiq</p>
                <button className="btn-primary px-10" onClick={() => navigate('/')}>Bosh sahifa</button>
            </div>
        );
    }

    const confirmedCount = appointments.filter((appointment) => appointment.status === 'confirmed').length;
    const completedCount = appointments.filter((appointment) => appointment.status === 'completed').length;
    const cancelledCount = appointments.filter((appointment) => appointment.status === 'cancelled').length;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-10">
            <Header
                title="Admin Panel"
                rightElement={
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-black">
                        {notifications.length}
                    </div>
                }
            />

            <div className="px-6 -mt-8 relative z-10">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Yangi bron', value: confirmedCount, className: 'bg-primary text-white' },
                        { label: 'Bajarildi', value: completedCount, className: 'bg-emerald-50 text-emerald-600' },
                        { label: 'Bekor', value: cancelledCount, className: 'bg-red-50 text-red-500' },
                    ].map((item) => (
                        <div key={item.label} className={`rounded-[26px] p-4 shadow-lg ${item.className}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">{item.label}</p>
                            <p className="text-2xl font-black">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[30px] p-4 shadow-lg border border-gray-100 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Bemor ismi, telefon yoki izoh bo'yicha qidiring"
                            className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[30px] p-5 shadow-lg border border-gray-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <ClipboardList size={22} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900">Yangi notificationlar</h3>
                                <p className="text-xs font-bold text-gray-400">Polling orqali avtomatik yangilanadi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/notifications')}
                            className="text-primary text-xs font-black uppercase tracking-widest"
                        >
                            Hammasi
                        </button>
                    </div>

                    {notifications.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">Hozircha yangi notification yo'q</p>
                    ) : (
                        <div className="space-y-3">
                            {notifications.slice(0, 4).map((notification) => (
                                <div key={notification.id} className="bg-gray-50 rounded-2xl p-4">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <p className="text-sm font-black text-gray-900">{notification.title}</p>
                                        <span className="text-[10px] font-black text-gray-300 uppercase">{formatDateTime(notification.created_at)}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">{notification.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <LoadingSpinner text="Bronlar yuklanmoqda..." />
                ) : appointments.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <span className="text-7xl mb-6 block">📋</span>
                        <h3 className="text-lg font-black text-gray-900 mb-2">Bronlar topilmadi</h3>
                        <p className="text-gray-400 font-bold text-sm">Yangi bronlar shu yerda paydo bo'ladi</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {appointments.map((appointment) => (
                            <AppointmentRow
                                key={appointment.id}
                                appointment={appointment}
                                onStatusChange={(status) => statusMutation.mutate({ id: appointment.id, status })}
                                isPending={statusMutation.isPending}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
