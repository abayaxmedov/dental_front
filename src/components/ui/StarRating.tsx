import { Star } from 'lucide-react';

interface Props {
    rating: number;
    size?: number;
}

export default function StarRating({ rating, size = 14 }: Props) {
    return (
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    fill={star <= Math.round(rating) ? '#F59E0B' : 'none'}
                    color={star <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}
