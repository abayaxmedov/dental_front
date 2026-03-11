import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, LogOut, ChevronRight, Calendar, Shield, Settings, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { toMediaUrl } from '../api/utils';
import Header from '../components/layout/Header';

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#F8FAFC]">
                <span className="text-7xl mb-6">👤</span>
                <h3 className="text-xl font-black text-gray-900">Kirish talab qilinadi</h3>
                <p className="text-gray-400 font-bold text-center text-sm mb-8">Profilingizni ko'rish uchun kiring</p>
                <button className="btn-primary w-full max-w-[240px]" onClick={() => navigate('/login')}>Kirish</button>
            </div>
        );
    }

    const fullName = `${user.first_name} ${user.last_name}`.trim() || user.username;
    const avatarUrl = toMediaUrl(user.user_image);
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    const menuItems = [
        { icon: <Calendar size={18} className="text-primary" />, label: 'Mening qabullarim', action: () => navigate('/appointments'), color: 'bg-primary/10' },
        { icon: <Shield size={18} className="text-indigo-500" />, label: 'Maxfiylik siyosati', action: () => { }, color: 'bg-indigo-50' },
        { icon: <Settings size={18} className="text-gray-500" />, label: 'Sozlamalar', action: () => { }, color: 'bg-gray-100' },
    ];

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24">
            <Header title="Mening profilim" />

            <div className="px-6 -mt-10 relative z-10">
                {/* Profile Card */}
                <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-50 text-center mb-8">
                    <div className="relative inline-block mb-6">
                        <div className="w-28 h-28 rounded-[38px] overflow-hidden bg-gray-100 border-4 border-white shadow-2xl flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-black text-primary">{initials}</span>
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border-4 border-gray-50 rounded-2xl flex items-center justify-center shadow-lg text-primary">
                            <Camera size={18} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-1">{fullName}</h2>
                    <p className="text-gray-400 font-bold text-sm tracking-wide">@{user.username}</p>
                </div>

                {/* Info Grid */}
                <div className="card p-6 border-none shadow-lg mb-8">
                    <div className="space-y-6">
                        {[
                            { icon: <User size={18} className="text-gray-400" />, label: 'Ism sharif', value: fullName },
                            { icon: <Mail size={18} className="text-gray-400" />, label: 'Email', value: user.email || '—' },
                            { icon: <Phone size={18} className="text-gray-400" />, label: 'Telefon', value: user.phone_number || '—' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{item.icon}</div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                                    <p className="text-sm font-black text-gray-700">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu */}
                <div className="card p-4 border-none shadow-lg mb-8">
                    {menuItems.map((item, i) => (
                        <Fragment key={i}>
                            <button
                                onClick={item.action}
                                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <span className="font-black text-gray-800 text-sm">{item.label}</span>
                                </div>
                                <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {i < menuItems.length - 1 && <div className="h-px bg-gray-50 mx-4"></div>}
                        </Fragment>
                    ))}
                </div>

                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full py-5 rounded-[24px] bg-red-50 text-red-500 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 border-red-100/50 hover:bg-red-100 transition-all"
                >
                    <LogOut size={18} /> Tizimdan chiqish
                </button>
            </div>
        </div>
    );
}
