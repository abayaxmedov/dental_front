import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CreditCard, ShieldCheck, ChevronRight, Wallet, Smartphone } from 'lucide-react';
import appointmentsService from '../api/services/appointmentsService';
import paymentsService from '../api/services/paymentsService';
import { toMediaUrl } from '../api/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Header from '../components/layout/Header';

const PAYMENT_METHODS = [
    { id: 'PAYME', name: 'Payme', icon: <Smartphone className="text-blue-400" />, color: 'bg-blue-50' },
    { id: 'CLICK', name: 'Click', icon: <Smartphone className="text-blue-600" />, color: 'bg-blue-100' },
    { id: 'CARD', name: 'Karta orqali', icon: <CreditCard className="text-primary" />, color: 'bg-primary/10' },
    { id: 'CASH', name: 'Naqd (klinikada)', icon: <Wallet className="text-green-500" />, color: 'bg-green-50' },
];

export default function PaymentPage() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('PAYME');

    const { data: appointment, isLoading } = useQuery({
        queryKey: ['appointment', Number(appointmentId)],
        queryFn: () => appointmentsService.getById(Number(appointmentId)),
    });

    const payMutation = useMutation({
        mutationFn: (data: any) => paymentsService.create(data),
        onSuccess: () => {
            navigate(`/booking-success/${appointmentId}`);
        },
    });

    const handlePayment = () => {
        if (!appointment) return;

        payMutation.mutate({
            appointment: appointment.id,
            amount: Number(appointment.doctor_details.consultation_fee),
            method: selectedMethod as 'PAYME' | 'CLICK' | 'CARD' | 'CASH',
            transaction_id: `TX-${Date.now()}`,
        });
    };

    if (isLoading) return <LoadingSpinner />;
    if (!appointment) return null;

    const doctor = appointment.doctor_details;
    const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-32">
            <Header title="To'lov" />

            <div className="px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-[32px] shadow-xl p-6 border border-gray-50 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary text-xl font-black">
                            {doctor.user.user_image ? (
                                <img src={toMediaUrl(doctor.user.user_image) ?? undefined} alt={fullName} className="w-full h-full object-cover rounded-2xl" />
                            ) : fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 leading-tight">Dr. {fullName}</h3>
                            <p className="text-xs font-bold text-gray-400">{doctor.specialization?.name || 'Mutaxassis'}</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-dashed border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400">Qabul turi</span>
                            <span className="text-sm font-black text-gray-900">Konsultatsiya</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400">Sana va vaqt</span>
                            <span className="text-sm font-black text-gray-900">{appointment.date} • {appointment.time.slice(0, 5)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-base font-black text-gray-900">Jami to'lov</span>
                            <span className="text-xl font-black text-primary">{Number(doctor.consultation_fee).toLocaleString()} so'm</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-gray-950 font-black mb-4">To'lov usuli</h3>
                <div className="grid grid-cols-1 gap-3 mb-8">
                    {PAYMENT_METHODS.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-3xl flex items-center justify-between border-2 transition-all ${selectedMethod === method.id ? 'border-primary bg-white shadow-lg' : 'border-transparent bg-white shadow-sm hover:border-gray-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${method.color}`}>
                                    {method.icon}
                                </div>
                                <span className="font-black text-gray-900">{method.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-primary' : 'border-gray-200'}`}>
                                {selectedMethod === method.id && <div className="w-3 h-3 rounded-full bg-primary animate-in zoom-in"></div>}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100 mb-8">
                    <ShieldCheck className="text-blue-500 flex-shrink-0" size={20} />
                    <p className="text-[11px] font-bold text-blue-700/70 leading-relaxed">
                        Sizning to'lovingiz 128-bit shifrlash bilan himoyalangan. To'lov amalga oshirilgandan so'ng sizga tasdiqlash xabari yuboriladi.
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
                <div className="max-w-[430px] mx-auto">
                    <button
                        onClick={handlePayment}
                        disabled={payMutation.isPending}
                        className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        <span className="font-black text-sm uppercase tracking-wider">
                            {payMutation.isPending ? "To'lov kutilmoqda..." : "To'lovni tasdiqlash"}
                        </span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
