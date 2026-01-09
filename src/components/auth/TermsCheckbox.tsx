'use client';

import { useState } from 'react';
import { TermsModal } from './TermsModal';

interface TermsCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const TermsCheckbox = ({ checked, onChange }: TermsCheckboxProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLinkClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="terms"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-[#1a2332] text-cyan-500 focus:ring-2 focus:ring-cyan-500"
                    required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                    I accept the{' '}
                    <button
                        type="button"
                        onClick={handleLinkClick}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
                    >
                        Terms and Conditions
                    </button>
                    {' '}and{' '}
                    <button
                        type="button"
                        onClick={handleLinkClick}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
                    >
                        Privacy Policy
                    </button>
                </label>
            </div>

            <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};
