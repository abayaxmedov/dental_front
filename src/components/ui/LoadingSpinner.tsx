export default function LoadingSpinner({ text = 'Yuklanmoqda...' }: { text?: string }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            gap: '16px',
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{text}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
