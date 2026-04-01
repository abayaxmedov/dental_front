import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, AlertCircle, Info } from 'lucide-react';
import doctorsService from '../api/services/doctorsService';
import appointmentsService from '../api/services/appointmentsService';
import { getApiErrorMessage, toMediaUrl } from '../api/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';

export default function BookingPage() {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { data: doctor, isLoading } = useQuery({
        queryKey: ['doctor', Number(doctorId)],
        queryFn: () => doctorsService.getById(Number(doctorId)),
    });

    const handleBook = async () => {
        if (!user) return;

        setError('');
        setLoading(true);
        try {
            const appointment = await appointmentsService.create({
                doctor: Number(doctorId),
                notes,
            });
            navigate(`/booking-success/${appointment.id}`);
        } catch (error: unknown) {
            setError(getApiErrorMessage(error, "Bron qilishda xato."));
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!doctor) return null;

    const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;
    const canContinue = !!user;

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-32">
            <Header title="Bron qilish" />

            <div className="px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-[32px] shadow-xl p-5 border border-gray-50 mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 relative">
                        {doctor.user.user_image ? (
                            <img src={toMediaUrl(doctor.user.user_image) ?? undefined} alt={fullName} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-2xl font-black rounded-2xl">
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-black uppercase">On</div>
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 leading-tight">Dr. {fullName}</h3>
                        <p className="text-xs font-bold text-primary mb-1">{doctor.specialization?.name || 'Mutaxassis'}</p>
                        <div className="flex items-center gap-1.5">
                            <AlertCircle size={10} className="text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400">{doctor.hospital_name}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] shadow-xl p-6 border border-gray-50 mb-6">
                    <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs mb-4">Qanday ishlaydi</h4>
                    <div className="space-y-4">
                        {[
                            "Siz faqat bron qilish tugmasini bosasiz.",
                            "So'rovingiz darhol admin panelga tushadi.",
                            "Administrator siz bilan bog'lanib vaqtni alohida kelishadi.",
                        ].map((item) => (
                            <div key={item} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black">✓</div>
                                <p className="text-sm font-bold text-gray-600">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs mb-4 ml-2">Eslatma qoldiring</h4>
                    <textarea
                        className="w-full bg-white border-none rounded-[24px] shadow-sm p-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 placeholder:text-gray-300 min-h-[100px]"
                        placeholder="Sizni nima bezovta qilyapti? (masalan: Tish og'rig'i...)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 border border-red-100 mb-8">
                        <AlertCircle size={20} className="text-red-500" />
                        <p className="text-xs font-bold text-red-600">{error}</p>
                    </div>
                )}

                <div className="bg-primary/5 p-4 rounded-2xl flex items-start gap-3 border border-primary/10 mb-8">
                    <Info className="text-primary flex-shrink-0" size={20} />
                    <p className="text-[11px] font-bold text-primary/70 leading-relaxed">
                        Bron yuborilgach u avtomatik qabul qilinadi va admin panelda darhol ko'rinadi.
                    </p>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
                <div className="max-w-[430px] mx-auto">
                    {!user ? (
                        <button onClick={() => navigate('/login')} className="w-full btn-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Kirish talab qilinadi</button>
                    ) : (
                        <button
                            onClick={handleBook}
                            disabled={!canContinue || loading}
                            className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 shadow-xl"
                        >
                            <span className="font-black text-sm uppercase tracking-wider">
                                {loading ? 'Yuborilmoqda...' : 'Bron qilish'}
                            </span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
