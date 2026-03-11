import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Mail, Phone, ChevronLeft, AlertCircle } from 'lucide-react';
import authService from '../../api/services/authService';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const [form, setForm] = useState({
        username: '', first_name: '', last_name: '',
        email: '', phone_number: '', password: '', password_confirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.password_confirm) {
            setError("Parollar mos kelmaydi!");
            return;
        }
        setLoading(true);
        try {
            await authService.register(form);
            // Auto login after register
            const loginData = await authService.login({ username: form.username, password: form.password });
            setUser(loginData.user);
            navigate('/');
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: Record<string, string[]> } };
            const errData = anyErr?.response?.data;
            if (errData) {
                const msgs = Object.values(errData).flat();
                setError(msgs[0] || "Xato yuz berdi. Qayta urinib ko'ring.");
            } else {
                setError("Xato yuz berdi. Qayta urinib ko'ring.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputGroups = [
        { label: 'Ism', key: 'first_name', icon: User, placeholder: 'Ismingiz', type: 'text' },
        { label: 'Familiya', key: 'last_name', icon: User, placeholder: 'Familiyangiz', type: 'text' },
        { label: 'Username', key: 'username', icon: User, placeholder: 'username', type: 'text' },
        { label: 'Email (ixtiyoriy)', key: 'email', icon: Mail, placeholder: 'email@example.com', type: 'email' },
        { label: 'Telefon (ixtiyoriy)', key: 'phone_number', icon: Phone, placeholder: '+998901234567', type: 'tel' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            {/* Header */}
            <div className="gradient-primary" style={{ padding: '50px 24px 40px', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                    <ChevronLeft size={20} color="white" />
                </button>
                <h1 style={{ color: 'white', margin: '0 0 6px', fontSize: '24px', fontWeight: '800' }}>Hisob yaratish</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '13px' }}>Ma'lumotlaringizni kiriting</p>
            </div>

            {/* Form */}
            <div style={{ padding: '24px 24px 40px' }}>
                {error && (
                    <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertCircle size={16} color="#EF4444" />
                        <span style={{ fontSize: '13px', color: '#DC2626' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {inputGroups.map(({ label, key, icon: Icon, placeholder, type }) => (
                        <div key={key}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
                            <div style={{ position: 'relative' }}>
                                <Icon size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type={type}
                                    className="input-field"
                                    style={{ paddingLeft: '38px', fontSize: '14px', padding: '12px 12px 12px 38px' }}
                                    placeholder={placeholder}
                                    value={form[key as keyof typeof form]}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    required={['username', 'first_name', 'last_name', 'password', 'password_confirm'].includes(key)}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Parol</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type={showPassword ? 'text' : 'password'} className="input-field"
                                style={{ padding: '12px 38px', fontSize: '14px' }}
                                placeholder="Kamida 6 ta belgi" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Parolni tasdiqlang</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type={showPassword ? 'text' : 'password'} className="input-field"
                                style={{ fontSize: '14px', padding: '12px 12px 12px 38px' }}
                                placeholder="Parolni qayta kiriting" value={form.password_confirm}
                                onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Hisobingiz bormi? </span>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', textDecoration: 'none' }}>Kirish</Link>
                </div>
            </div>
        </div>
    );
}
