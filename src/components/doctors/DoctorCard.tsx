import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import type { Doctor } from '../../types';
import { toMediaUrl } from '../../api/utils';

interface Props {
    doctor: Doctor;
}

export default function DoctorCard({ doctor }: Props) {
    const navigate = useNavigate();
    const imageUrl = toMediaUrl(doctor.image);
    const userName = `${doctor.user.first_name} ${doctor.user.last_name}`.trim() || doctor.user.username;

    return (
        <div
            className="card"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            style={{ cursor: 'pointer', marginBottom: '12px' }}
        >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                {/* Avatar */}
                <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #0E4D4D20, #1a7a7a30)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '700' }}>
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                            Dr. {userName}
                        </h3>
                        {doctor.is_available && <span className="badge-available">Mavjud</span>}
                    </div>

                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--primary)', fontWeight: '500' }}>
                        {doctor.specialization?.name}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <MapPin size={12} color="#9CA3AF" />
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doctor.hospital_name}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{doctor.rating.toFixed(1)}</span>
                            </div>
                            <span style={{ color: '#D1D5DB', fontSize: '12px' }}>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={12} color="#9CA3AF" />
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doctor.experience_years} yil</span>
                            </div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                            {Number(doctor.consultation_fee).toLocaleString()} so'm
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
