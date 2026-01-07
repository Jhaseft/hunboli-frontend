import { X, Mail } from 'lucide-react';
import { useState } from 'react';
import { Coins } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [isHuman, setIsHuman] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Email submitted:', email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-7xl h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-48 w-80 h-80 bg-teal-400/8 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-64 h-64 bg-gray-700/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-600/5 rounded-full"></div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-10 w-12 h-12 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content Container */}
        <div className="relative h-full flex flex-col items-center justify-center px-12 py-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl text-white">StableCoin</span>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-xl bg-gray-800/60 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-10">
            <h2 className="text-center text-white mb-10">
              Create a StableCoin Account
            </h2>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-300">Email Confirmation</span>
              </div>
              
              {/* Progress dots */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-teal-400 mb-3">
                  Email*
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder:text-gray-500 transition-all"
                  required
                />
              </div>

              {/* CAPTCHA */}
              <div className="flex items-center justify-between gap-4 p-5 bg-gray-900/50 border border-gray-600 rounded-xl">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="captcha"
                    checked={isHuman}
                    onChange={(e) => setIsHuman(e.target.checked)}
                    className="w-6 h-6 rounded border-gray-600 bg-gray-800 text-teal-600 focus:ring-teal-500 focus:ring-offset-gray-900 cursor-pointer"
                    required
                  />
                  <label htmlFor="captcha" className="text-gray-300 cursor-pointer">
                    I am human
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">h</span>
                  </div>
                  <div className="text-gray-400">
                    <div className="text-sm font-medium">hCaptcha</div>
                    <div className="text-xs text-gray-500">Privacy - Terms</div>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="submit"
                disabled={!email || !isHuman}
                className="w-full py-4 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/20"
              >
                Next
              </button>

              {/* Log In Link */}
              <div className="text-center pt-4">
                <span className="text-gray-400">Already have an account? </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center space-y-3">
            <p className="text-sm text-gray-400">
              Copyright © 2003 - 2025 StableCoin Operations, S.A. de C.V. All rights reserved.
            </p>
            <button className="text-sm text-gray-400 hover:text-gray-300 underline transition-colors">
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}