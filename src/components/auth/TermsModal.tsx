'use client';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#1a2332] rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-[#1a2332] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Terms and Conditions</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)] text-gray-300">
                    <div className="space-y-4">
                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                            <p className="text-sm leading-relaxed">
                                By accessing and using HUNBOLI, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">2. Use of Service</h3>
                            <p className="text-sm leading-relaxed">
                                You agree to use HUNBOLI only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">3. Digital Currency</h3>
                            <p className="text-sm leading-relaxed">
                                HUNBOLI provides a stable, secure, and transparent digital currency platform. All transactions are subject to our security protocols and verification processes.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">4. Privacy Policy</h3>
                            <p className="text-sm leading-relaxed">
                                We respect your privacy and are committed to protecting your personal data. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your information.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">5. Limitation of Liability</h3>
                            <p className="text-sm leading-relaxed">
                                HUNBOLI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-white mb-2">6. Changes to Terms</h3>
                            <p className="text-sm leading-relaxed">
                                We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#1a2332] border-t border-gray-700 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};
