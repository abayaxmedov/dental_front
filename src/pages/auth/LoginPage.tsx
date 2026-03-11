import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import authService from '../../api/services/authService';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(form);
            setUser(data.user);
            navigate('/');
        } catch {
            setError("Username yoki parol noto'g'ri. Qayta urinib ko'ring.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'white' }}>
            {/* Header gradient */}
            <div className="gradient-primary" style={{
                padding: '60px 24px 50px',
                borderBottomLeftRadius: '32px',
                borderBottomRightRadius: '32px',
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    fontSize: '32px',
                }}>
                    🦷
                </div>
                <h1 style={{ color: 'white', margin: '0 0 8px', fontSize: '26px', fontWeight: '800' }}>
                    Xush kelibsiz!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px' }}>
                    Hisobingizga kiring
                </p>
            </div>

            {/* Form */}
            <div style={{ padding: '32px 24px', flex: 1 }}>
                {error && (
                    <div style={{
                        background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '12px',
                        padding: '12px 16px', marginBottom: '20px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <AlertCircle size={18} color="#EF4444" />
                        <span style={{ fontSize: '14px', color: '#DC2626' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Username */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                placeholder="Username kiriting"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Parol
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field"
                                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                placeholder="Parolingizni kiriting"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                        {loading ? 'Kirilmoqda...' : 'Kirish'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Hisobingiz yo'qmi? </span>
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                        Ro'yxatdan o'tish
                    </Link>
                </div>
            </div>
        </div>
    );
}
