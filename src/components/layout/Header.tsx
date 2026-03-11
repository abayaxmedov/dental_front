import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightElement?: React.ReactNode;
    variant?: 'primary' | 'white';
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBack = true,
    onBack,
    rightElement,
    variant = 'primary'
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    if (variant === 'white') {
        return (
            <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-xl bg-gray-50 border border-gray-100"
                        >
                            <ChevronLeft size={20} className="text-gray-900" />
                        </button>
                    )}
                    <h1 className="text-lg font-extrabold text-gray-900">{title}</h1>
                </div>
                <div>{rightElement}</div>
            </header>
        );
    }

    return (
        <header className="gradient-primary p-6 pt-12 rounded-b-[32px] sticky top-0 z-50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-xl bg-white/20 backdrop-blur-md"
                        >
                            <ChevronLeft size={20} className="text-white" />
                        </button>
                    )}
                    <h1 className="text-xl font-black text-white">{title}</h1>
                </div>
                <div>{rightElement}</div>
            </div>
        </header>
    );
};

export default Header;
