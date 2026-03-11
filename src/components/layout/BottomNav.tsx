import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';

const navItems = [
    { path: '/', icon: Home, label: "Bosh sahifa" },
    { path: '/doctors', icon: Search, label: "Shifokorlar" },
    { path: '/appointments', icon: Calendar, label: "Qabullar" },
    { path: '/profile', icon: User, label: "Profil" },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            {navItems.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path ||
                    (path !== '/' && location.pathname.startsWith(path));
                return (
                    <Link
                        key={path}
                        to={path}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                            color: active ? 'var(--primary)' : '#9CA3AF',
                            flex: 1,
                        }}
                    >
                        <div style={{
                            padding: '6px 14px',
                            borderRadius: '12px',
                            background: active ? 'rgba(14,77,77,0.1)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: active ? '700' : '500' }}>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
