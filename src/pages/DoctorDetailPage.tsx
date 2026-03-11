import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Clock, ShieldCheck, ChevronRight, Award } from 'lucide-react';
import doctorsService from '../api/services/doctorsService';
import reviewsService from '../api/services/reviewsService';
import { toMediaUrl } from '../api/utils';
import ImageLightbox from '../components/ui/ImageLightbox';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StarRating from '../components/ui/StarRating';
import Header from '../components/layout/Header';

export default function DoctorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showPreview, setShowPreview] = useState(false);

    const { data: doctor, isLoading: doctorLoading } = useQuery({
        queryKey: ['doctor', Number(id)],
        queryFn: () => doctorsService.getById(Number(id)),
    });

    const { data: reviews, isLoading: reviewsLoading } = useQuery({
        queryKey: ['reviews', Number(id)],
        queryFn: () => reviewsService.getByDoctor(Number(id)),
    });

    if (doctorLoading) return <LoadingSpinner />;
    if (!doctor) return null;

    const fullName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;
    const profileImage = toMediaUrl(doctor.user.user_image);

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-32">
            <Header title="Doktor Profili" />

            {/* Profile Info Section */}
            <div className="px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-[32px] shadow-xl p-6 border border-gray-50">
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => profileImage && setShowPreview(true)}
                            className="w-24 h-24 rounded-[30px] overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-white shadow-lg p-0 border-white"
                            style={{ cursor: profileImage ? 'zoom-in' : 'default' }}
                            aria-label={profileImage ? `${fullName} rasmini kattalashtirish` : `${fullName} rasmi mavjud emas`}
                        >
                            {profileImage ? (
                                <img src={profileImage} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-3xl font-black">
                                    {fullName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </button>
                        <div className="flex-1 py-1">
                            <div className="flex items-center gap-1 mb-1">
                                <ShieldCheck size={14} className="text-blue-500" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Tasdiqlangan</span>
                            </div>
                            <h2 className="text-xl font-black text-gray-900 mb-1 leading-tight">Dr. {fullName}</h2>
                            <p className="text-primary font-bold text-sm mb-2">{doctor.specialization?.name}</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-black text-gray-900">{doctor.rating}</span>
                                </div>
                                <div className="w-px h-3 bg-gray-200"></div>
                                <span className="text-xs font-bold text-gray-400">{reviews?.length || 0} ta sharh</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-2">
                        {[
                            { label: 'Tajriba', value: `${doctor.experience_years} yil`, icon: <Award size={14} className="text-primary" /> },
                            { label: 'Bemorlar', value: '1,000+', icon: <ShieldCheck size={14} className="text-blue-500" /> },
                            { label: 'Reyting', value: doctor.rating, icon: <Star size={14} className="text-yellow-500" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center text-center">
                                <div className="mb-1">{stat.icon}</div>
                                <span className="text-[10px] font-black text-gray-400 uppercase mb-0.5 tracking-tighter">{stat.label}</span>
                                <span className="text-xs font-black text-gray-900">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 mt-6">
                {/* About */}
                <section className="mb-8">
                    <h3 className="text-gray-900 font-extrabold mb-3">Doktor haqida</h3>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                        {doctor.bio || `Dr. ${fullName} — o'z sohasining yetuk mutaxassisi bo'lib, ${doctor.experience_years} yillik tajribaga ega. Shifokor zamonaviy usullarni qo'llagan holda bemorlarga yuqori sifatli xizmat ko'rsatib kelmoqda.`}
                    </p>
                </section>

                {/* Location & Time */}
                <div className="grid grid-cols-1 gap-4 mb-8">
                    <div className="card border-none bg-blue-50 p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-blue-900 mb-0.5">Manzil</h4>
                            <p className="text-xs font-bold text-blue-700/70">{doctor.hospital_name}</p>
                        </div>
                    </div>

                    <div className="card border-none bg-primary/5 p-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white flex-shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-primary mb-0.5">Ish vaqti</h4>
                            <p className="text-xs font-bold text-primary/60">Dushanba - Shanba, 09:00 - 18:00</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900 font-extrabold">Bemorlar fikri</h3>
                        <button className="text-primary text-xs font-black">Barchasi</button>
                    </div>

                    {reviewsLoading ? (
                        <div className="animate-pulse flex gap-2 overflow-x-auto">
                            {[1, 2].map(i => <div key={i} className="min-w-[280px] h-32 bg-gray-100 rounded-3xl"></div>)}
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {reviews?.map((review) => (
                                <div key={review.id} className="min-w-[280px] bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                {review.patient_name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{review.patient_name || 'Foydalanuvchi'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">2 kun avval</p>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium line-clamp-2 italic">"{review.comment}"</p>
                                </div>
                            ))}
                            {(!reviews || reviews.length === 0) && (
                                <p className="text-gray-400 text-xs italic font-bold py-4">Hali sharhlar qoldirilmagan</p>
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* Sticky Book Now Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
                <div className="max-w-[430px] mx-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Qabul narxi</p>
                        <p className="text-lg font-black text-gray-900">{Number(doctor.consultation_fee).toLocaleString()} <span className="text-xs text-primary font-black uppercase">so'm</span></p>
                    </div>
                    <button
                        onClick={() => navigate(`/booking/${doctor.id}`)}
                        className="flex-1 btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group"
                    >
                        <span className="font-black text-sm uppercase tracking-wider">Qabulga yozilish</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
            {showPreview && profileImage && (
                <ImageLightbox
                    src={profileImage}
                    alt={fullName}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}
