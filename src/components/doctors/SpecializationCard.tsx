import React from 'react';

interface SpecializationCardProps {
    id: number;
    name: string;
    icon?: string;
    onClick?: () => void;
}

const SpecializationCard: React.FC<SpecializationCardProps> = ({ name, icon, onClick }) => {
    // Default icons mapping if backend doesn't provide SVG/Path
    const getIcon = (specName: string) => {
        const lowerName = specName.toLowerCase();
        if (lowerName.includes('tish')) return '🦷';
        if (lowerName.includes('og\'iz')) return '👄';
        if (lowerName.includes('bola')) return '👶';
        if (lowerName.includes('jarroh')) return '🔪';
        if (lowerName.includes('ortodont')) return '😬';
        return icon || '👨‍⚕️';
    };

    return (
        <div
            onClick={onClick}
            className="card flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ minWidth: '100px', borderRadius: '20px' }}
        >
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
                style={{ background: 'rgba(14, 77, 77, 0.05)' }}
            >
                {getIcon(name)}
            </div>
            <span className="text-xs font-bold text-center text-gray-700">{name}</span>
        </div>
    );
};

export default SpecializationCard;
