import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Calendar, ShieldCheck, MapPin, Home, PartyPopper } from 'lucide-react';
import appointmentsService from '../api/services/appointmentsService';

const MONTH_NAMES = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export default function BookingSuccessPage() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    const { data: appointment, isLoading } = useQuery({
        queryKey: ['appointment', Number(appointmentId)],
        queryFn: () => appointmentsService.getById(Number(appointmentId)),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#F8FAFC]">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Tayyorlanmoqda...</p>
            </div>
        );
    }

    const doctor = appointment?.doctor_details;
    const name = doctor ? `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username : '';
    const dateObj = appointment ? new Date(appointment.date) : null;
    const formattedDate = dateObj
        ? `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`
        : '';

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 flex flex-col items-center">
            {/* Celebration Header */}
            <div className="mt-12 mb-10 text-center relative">
                <div className="w-32 h-32 rounded-full gradient-primary flex items-center justify-center shadow-2xl relative z-10 animate-in zoom-in duration-500">
                    <CheckCircle size={64} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-4 -right-4 animate-bounce">
                    <PartyPopper size={40} className="text-yellow-500" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <h1 className="text-3xl font-black text-gray-950 mb-3 text-center">Tayyor! 🎉</h1>
            <p className="text-gray-400 font-bold text-sm text-center mb-10 max-w-[280px]">
                Bron so'rovingiz muvaffaqiyatli qabul qilindi. Administrator siz bilan bog'lanadi.
            </p>

            {/* Details Card */}
            {appointment && (
                <div className="bg-white rounded-[40px] shadow-2xl p-8 w-full border border-gray-50 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-8xl font-black italic">Dental</span>
                    </div>

                    <div className="flex items-center gap-4 pb-6 border-b border-dashed border-gray-100 mb-6">
                        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-black">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-950">Dr. {name}</h3>
                            <p className="text-xs font-bold text-primary">{doctor?.specialization?.name}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <MapPin size={10} className="text-gray-300" />
                                <span className="text-[10px] font-bold text-gray-300">{doctor?.hospital_name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-3xl p-4">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Calendar size={14} className="text-primary" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">Bron sanasi</span>
                            </div>
                            <p className="text-sm font-black text-gray-900">{formattedDate}</p>
                        </div>
                        <div className="bg-gray-50 rounded-3xl p-4">
                            <div className="flex items-center gap-2 mb-1.5">
                                <ShieldCheck size={14} className="text-primary" />
                                <span className="text-[10px] font-black text-gray-400 uppercase">Holat</span>
                            </div>
                            <p className="text-sm font-black text-gray-900">Admin bilan kelishiladi</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="w-full space-y-4">
                <button
                    onClick={() => navigate('/appointments')}
                    className="w-full btn-primary py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                >
                    Qabullarimga o'tish
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-5 rounded-[24px] bg-white text-gray-700 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 border-gray-100 active:scale-95 transition-all"
                >
                    <Home size={16} /> Bosh sahifaga
                </button>
            </div>
        </div>
    );
}
