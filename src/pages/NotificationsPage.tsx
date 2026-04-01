import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/layout/Header';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import notificationsService from '../api/services/notificationsService';
import { useAuthStore } from '../store/authStore';

const formatDate = (value: string) =>
    new Date(value).toLocaleString('uz-UZ', {
        day: '2-digit',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    });

export default function NotificationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => notificationsService.getAll(),
        enabled: isAuthenticated,
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => notificationsService.markAllRead(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-[#F8FAFC]">
                <span className="text-7xl mb-4">🔔</span>
                <h3 className="text-xl font-black text-gray-900">Kirish talab qilinadi</h3>
                <p className="text-gray-400 font-bold text-center text-sm mb-6 max-w-[240px]">Bildirishnomalarni ko'rish uchun hisobingizga kiring</p>
                <button className="btn-primary px-10" onClick={() => navigate('/login')}>Kirish</button>
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            <Header
                title="Bildirishnomalar"
                rightElement={notifications.length > 0 ? (
                    <button
                        onClick={() => markAllReadMutation.mutate()}
                        className="px-3 py-2 rounded-xl bg-white/20 text-white text-[11px] font-black uppercase tracking-wider"
                    >
                        Hammasi o'qildi
                    </button>
                ) : null}
            />

            <div className="px-6 mt-8">
                {isLoading ? (
                    <LoadingSpinner text="Bildirishnomalar yuklanmoqda..." />
                ) : notifications.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <span className="text-7xl mb-6 block">🔕</span>
                        <h3 className="text-lg font-black text-gray-900 mb-2">Hozircha bildirishnoma yo'q</h3>
                        <p className="text-gray-400 font-bold text-sm">Yangi bron yoki status o'zgarishi bo'lsa shu yerda chiqadi</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-[28px] p-5 shadow-lg border ${notification.is_read ? 'border-transparent' : 'border-primary/20'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notification.is_read ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary'}`}>
                                        {notification.is_read ? <CheckCheck size={20} /> : <Bell size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-sm font-black text-gray-900">{notification.title}</h3>
                                            <span className="text-[10px] font-black text-gray-300 uppercase whitespace-nowrap">
                                                {formatDate(notification.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 leading-relaxed">{notification.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
