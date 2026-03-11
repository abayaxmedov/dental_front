import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import appointmentsService from '../api/services/appointmentsService';
import AppointmentCard from '../components/appointments/AppointmentCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import type { AppointmentStatus } from '../types';

const TABS: { label: string; status: AppointmentStatus | 'all' }[] = [
    { label: 'Barchasi', status: 'all' },
    { label: 'Kutilmoqda', status: 'upcoming' },
    { label: 'Bajarildi', status: 'completed' },
    { label: 'Bekor', status: 'cancelled' },
];

export default function AppointmentsPage() {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<AppointmentStatus | 'all'>('all');

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ['appointments', activeTab],
        queryFn: () => activeTab === 'all'
            ? appointmentsService.getAll()
            : appointmentsService.getAll({ status: activeTab as AppointmentStatus }),
        enabled: isAuthenticated,
    });

    const cancelMutation = useMutation({
        mutationFn: (id: number) => appointmentsService.cancel(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    });

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-[#F8FAFC]">
                <span className="text-7xl mb-4">🔒</span>
                <h3 className="text-xl font-black text-gray-900">Kirish talab qilinadi</h3>
                <p className="text-gray-400 font-bold text-center text-sm mb-6 max-w-[240px]">Qabullaringizni ko'rish uchun hisobingizga kiring</p>
                <button className="btn-primary px-10" onClick={() => navigate('/login')}>Kirish</button>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            <Header
                title="Mening qabullarim"
                rightElement={<div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xs font-black">{appointments.length}</div>}
            />

            <div className="px-6 -mt-6 relative z-10">
                <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 shadow-lg border border-white/50">
                    {TABS.map(({ label, status }) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`flex-1 min-w-0 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === status ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-8">
                {isLoading ? (
                    <LoadingSpinner text="Qabullar yuklanmoqda..." />
                ) : appointments.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <span className="text-7xl mb-6 block">📅</span>
                        <h3 className="text-lg font-black text-gray-900 mb-2">Qabullar topilmadi</h3>
                        <p className="text-gray-400 font-bold text-sm mb-8">Hali qabul bron qilmadingiz</p>
                        <button className="text-primary font-black uppercase tracking-widest text-xs py-3 px-6 border-2 border-primary/20 rounded-2xl hover:bg-primary/5" onClick={() => navigate('/doctors')}>
                            Shifokor topish
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onCancel={(id) => cancelMutation.mutate(id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
