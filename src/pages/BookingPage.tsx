import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, AlertCircle, Info } from 'lucide-react';
import doctorsService from '../api/services/doctorsService';
import appointmentsService from '../api/services/appointmentsService';
import patientsService from '../api/services/patientsService';
import { toMediaUrl } from '../api/utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Header from '../components/layout/Header';
import { useAuthStore } from '../store/authStore';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

const MONTH_NAMES = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

const DAY_NAMES = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

function buildCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
}

export default function BookingPage() {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { data: doctor, isLoading } = useQuery({
        queryKey: ['doctor', Number(doctorId)],
        queryFn: () => doctorsService.getById(Number(doctorId)),
    });
    const { data: patientProfile } = useQuery({
        queryKey: ['patient-profile'],
        queryFn: () => patientsService.getCurrent(),
        enabled: !!user,
    });

    const calDays = buildCalendar(calYear, calMonth);

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
        else setCalMonth(calMonth - 1);
        setSelectedDay(null);
    };
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
        else setCalMonth(calMonth + 1);
        setSelectedDay(null);
    };

    const isPast = (day: number) => {
        const d = new Date(calYear, calMonth, day);
        d.setHours(0, 0, 0, 0);
        const now = new Date(); now.setHours(0, 0, 0, 0);
        return d < now;
    };

    const handleBook = async () => {
        if (!user || !selectedDay || !selectedTime) return;

        setError('');
        setLoading(true);
        try {
            if (!patientProfile) {
                throw new Error("Patient profile topilmadi. Backend foydalanuvchi uchun patient profile yaratishi kerak.");
            }
            const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
            const appointment = await appointmentsService.create({
                doctor: Number(doctorId),
                date: dateStr,
                time: `${selectedTime}:00`,
                notes,
            });
            navigate(`/payment/${appointment.id}`);
        } catch (e: any) {
            const msg = e.response?.data ? Object.values(e.response.data).flat()[0] as string : "Bron qilishda xato.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (!doctor) return null;

    const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;
    const canContinue = selectedDay && selectedTime && user && patientProfile;

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

                {/* Calendar Widget */}
                <div className="card border-none bg-white p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs">Sana tanlang</h4>
                        <div className="flex items-center gap-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                                <ChevronRight size={18} className="rotate-180" />
                            </button>
                            <span className="text-sm font-black text-gray-900 mx-2">{MONTH_NAMES[calMonth]} {calYear}</span>
                            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAY_NAMES.map(d => <div key={d} className="text-[10px] font-black text-gray-300 text-center uppercase">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {calDays.map((day, i) => {
                            if (!day) return <div key={i}></div>;
                            const past = isPast(day);
                            const isSelected = selectedDay === day;
                            return (
                                <button
                                    key={i}
                                    disabled={past}
                                    onClick={() => setSelectedDay(day)}
                                    className={`h-11 rounded-xl text-xs font-black transition-all ${isSelected ? 'gradient-primary text-white shadow-lg' : past ? 'text-gray-200 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 border border-gray-100'}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Widget */}
                <div className="mb-6">
                    <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs mb-4 ml-2">Vaqt tanlang</h4>
                    <div className="grid grid-cols-4 gap-3">
                        {TIME_SLOTS.map(time => {
                            const isSelected = selectedTime === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-3 rounded-2xl text-[13px] font-black transition-all border-2 ${isSelected ? 'border-primary bg-white text-primary shadow-lg' : 'border-transparent bg-white text-gray-500 shadow-sm'}`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Note widget */}
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
                        Keyingi bosqichda siz to'lov usulini tanlaysiz va bron qilishni yakunlaysiz.
                    </p>
                </div>
                {user && !patientProfile && (
                    <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-3 border border-amber-100 mb-8">
                        <AlertCircle size={20} className="text-amber-500" />
                        <p className="text-xs font-bold text-amber-700">
                            Patient profile topilmadi. Backendda ushbu foydalanuvchi uchun patient profile yaratilmaguncha bron ishlamaydi.
                        </p>
                    </div>
                )}
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
                                {loading ? 'Yuborilmoqda...' : 'Davom etish'}
                            </span>
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
