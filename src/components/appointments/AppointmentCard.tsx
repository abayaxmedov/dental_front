import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import type { Appointment } from '../../types';
import { toMediaUrl } from '../../api/utils';

interface Props {
    appointment: Appointment;
    onCancel?: (id: number) => void;
}

const statusLabel: Record<string, string> = {
    upcoming: 'Kutilmoqda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilindi',
};

export default function AppointmentCard({ appointment, onCancel }: Props) {
    const navigate = useNavigate();
    const doctor = appointment.doctor_details;
    const userName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;
    const imageUrl = toMediaUrl(doctor.image);

    const formattedDate = new Date(appointment.date).toLocaleDateString('uz-UZ', {
        day: '2-digit', month: 'long', year: 'numeric',
    });

    return (
        <div className="card" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
                {/* Avatar */}
                <div style={{
                    width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0,
                    background: 'linear-gradient(135deg, #0E4D4D20, #1a7a7a30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {imageUrl
                        ? <img src={imageUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '22px', color: 'var(--primary)', fontWeight: '700' }}>{userName.charAt(0).toUpperCase()}</span>
                    }
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Dr. {userName}</h3>
                        <span className={`badge-${appointment.status}`}>{statusLabel[appointment.status]}</span>
                    </div>

                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--primary)', fontWeight: '500' }}>
                        {doctor.specialization?.name}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={13} color="#9CA3AF" />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{formattedDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} color="#9CA3AF" />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{appointment.time.slice(0, 5)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} color="#9CA3AF" />
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{doctor.hospital_name}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            {appointment.status === 'upcoming' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                        onClick={() => navigate(`/doctors/${doctor.id}`)}
                        style={{
                            flex: 1, padding: '10px', border: '1.5px solid var(--primary)',
                            borderRadius: '10px', background: 'white', color: 'var(--primary)',
                            fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                        }}
                    >
                        Shifokorni ko'rish
                    </button>
                    {onCancel && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            style={{
                                padding: '10px 14px', border: '1.5px solid #EF4444',
                                borderRadius: '10px', background: 'white', color: '#EF4444',
                                fontWeight: '600', fontSize: '13px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                        >
                            <X size={14} /> Bekor
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
