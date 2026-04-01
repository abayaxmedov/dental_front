import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Bell, SlidersHorizontal } from 'lucide-react';
import doctorsService from '../api/services/doctorsService';
import DoctorCard from '../components/doctors/DoctorCard';
import SpecializationCard from '../components/doctors/SpecializationCard';
import { useAuthStore } from '../store/authStore';
import type { Specialization } from '../types';

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: specializations, isLoading: specsLoading } = useQuery({
        queryKey: ['specializations'],
        queryFn: () => doctorsService.getSpecializations(),
    });

    const { data: topDoctors, isLoading: doctorsLoading } = useQuery({
        queryKey: ['top-doctors'],
        queryFn: () => doctorsService.getAll({ ordering: '-rating' }),
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/doctors?search=${searchQuery}`);
        }
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            {/* Search Header Section */}
            <div className="gradient-primary px-6 pt-16 pb-12 rounded-b-[40px] shadow-xl relative overflow-hidden">
                {/* Subtle decorative circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-1">Xush kelibsiz 👋</p>
                        <h1 className="text-white text-2xl font-black">
                            {user ? `${user.first_name || user.username}` : 'Mehmon'}
                        </h1>
                    </div>
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white relative">
                        <Bell size={22} />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-primary rounded-full"></span>
                    </button>
                </div>

                <form onSubmit={handleSearch} className="relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-white text-gray-900 h-14 pl-12 pr-4 rounded-2xl border-none focus:ring-4 focus:ring-white/30 shadow-lg text-sm font-medium transition-all"
                            placeholder="Shifokor yoki mutaxassislik qidirish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Banner Section */}
            <div className="px-6 -mt-6 relative z-20">
                <div className="bg-gradient-to-br from-secondary to-blue-600 rounded-[30px] p-6 shadow-2xl flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10 w-2/3">
                        <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                            Bugun bron qiling
                        </span>
                        <h2 className="text-white text-xl font-extrabold leading-tight mb-2">
                            Tish shifokorini <br /> tezda toping 🦷
                        </h2>
                        <p className="text-white/80 text-xs font-bold mb-4">+500 mamnun bemor</p>
                        <button
                            onClick={() => navigate('/doctors')}
                            className="bg-white text-secondary px-6 py-2.5 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-all"
                        >
                            Bron qilish →
                        </button>
                    </div>
                    <div className="absolute -right-6 -bottom-6 opacity-30 group-hover:scale-110 transition-transform">
                        <span className="text-[140px]">🦷</span>
                    </div>
                </div>
            </div>

            {/* Specializations */}
            <div className="mt-10 px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-950 text-lg font-black">Mutaxassisliklar</h3>
                    <button onClick={() => navigate('/doctors')} className="text-primary text-xs font-black hover:underline">Hammasi</button>
                </div>

                {specsLoading ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {[1, 2, 3, 4].map(i => <div key={i} className="min-w-[100px] h-28 bg-gray-100 rounded-3xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                        {specializations?.map((spec: Specialization) => (
                            <SpecializationCard
                                key={spec.id}
                                id={spec.id}
                                name={spec.name}
                                onClick={() => navigate(`/doctors?specialization=${spec.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Top Doctors */}
            <div className="mt-6 px-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-950 text-lg font-black">Eng yaxshi shifokorlar</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/doctors')} className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <SlidersHorizontal size={16} className="text-gray-500" />
                        </button>
                        <button onClick={() => navigate('/doctors')} className="text-primary text-xs font-black hover:underline">Hammasi</button>
                    </div>
                </div>

                {doctorsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-full h-32 bg-gray-100 rounded-3xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topDoctors?.slice(0, 5).map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                        {(!topDoctors || topDoctors.length === 0) && (
                            <div className="text-center py-12 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <span className="text-5xl mb-4 block">🦷</span>
                                <p className="text-gray-400 font-bold">Shifokorlar topilmadi</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
