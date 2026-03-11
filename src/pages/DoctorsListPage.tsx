import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X } from 'lucide-react';
import doctorsService from '../api/services/doctorsService';
import DoctorCard from '../components/doctors/DoctorCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Header from '../components/layout/Header';

export default function DoctorsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);

    const search = searchParams.get('search') || '';
    const specId = searchParams.get('specialization') || '';
    const ordering = searchParams.get('ordering') || '';

    const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
        queryKey: ['doctors', search, specId, ordering],
        queryFn: () => doctorsService.getAll({
            search,
            specialization: specId ? Number(specId) : undefined,
            ordering
        }),
    });

    const { data: specializations } = useQuery({
        queryKey: ['specializations'],
        queryFn: () => doctorsService.getSpecializations(),
    });

    const updateFilters = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
        setShowFilters(false);
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            <Header
                title="Shifokorlar"
                rightElement={
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-2xl transition-all ${showFilters ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}
                    >
                        <Filter size={20} />
                    </button>
                }
            />

            <div className="px-6 -mt-4 relative z-10">
                <div className="bg-white rounded-[24px] shadow-xl p-3 flex items-center gap-3 border border-gray-100">
                    <div className="flex-1 relative flex items-center">
                        <Search className="absolute left-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="w-full bg-gray-50 border-none rounded-xl h-11 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20"
                            placeholder="Qidirish..."
                            value={search}
                            onChange={(e) => updateFilters('search', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="px-6 mt-4 animate-in slide-in-from-top duration-300">
                    <div className="card p-6 border-none shadow-xl bg-white/80 backdrop-blur-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Filtrlar</h4>
                            <button onClick={clearFilters} className="text-red-500 text-xs font-bold flex items-center gap-1">
                                <X size={14} /> Tozalash
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Sohalar</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => updateFilters('specialization', '')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!specId ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        Barchasi
                                    </button>
                                    {specializations?.map((spec: any) => (
                                        <button
                                            key={spec.id}
                                            onClick={() => updateFilters('specialization', String(spec.id))}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${Number(specId) === spec.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {spec.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Saralash</label>
                                <select
                                    className="w-full bg-gray-50 border-none rounded-xl h-11 px-4 text-xs font-bold text-gray-700"
                                    value={ordering}
                                    onChange={(e) => updateFilters('ordering', e.target.value)}
                                >
                                    <option value="">Standart</option>
                                    <option value="-rating">Reyting (baland)</option>
                                    <option value="consultation_fee">Narx (past)</option>
                                    <option value="-consultation_fee">Narx (baland)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-gray-950 font-black">Natijalar: <span className="text-primary">{doctorsData?.length || 0}</span></h3>
                </div>

                {doctorsLoading ? (
                    <LoadingSpinner text="Qidirilmoqda..." />
                ) : (
                    <div className="space-y-5">
                        {doctorsData?.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}

                        {(!doctorsData || doctorsData.length === 0) && (
                            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <span className="text-6xl mb-4 block">🔍</span>
                                <p className="text-gray-400 font-bold mb-2">Hech narsa topilmadi</p>
                                <p className="text-gray-300 text-xs">Boshqa kalit so'zlar bilan qidirib ko'ring</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
