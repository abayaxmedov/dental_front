import { X } from 'lucide-react';

interface ImageLightboxProps {
    src: string;
    alt: string;
    onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    return (
        <div
            className="fixed inset-0 z-[120] bg-slate-950/85 p-4 flex items-center justify-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md"
                aria-label="Yopish"
            >
                <X size={20} />
            </button>
            <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain rounded-[28px] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            />
        </div>
    );
}
