'use client';
import { X, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import { Coins } from 'lucide-react';

interface LogInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onLoginSuccess: () => void;
}

export function LogInModal({ isOpen, onClose, onSwitchToSignUp, onLoginSuccess }: LogInModalProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Login submitted:', { emailOrUsername, password });
    onClose();
    onLoginSuccess();
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
              Log in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email or Username Input */}
              <div>
                <label htmlFor="emailOrUsername" className="block text-teal-400 mb-3">
                  Email or Username*
                </label>
                <input
                  id="emailOrUsername"
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder:text-gray-500 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-teal-400 mb-3">
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-gray-900/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder:text-gray-500 transition-all"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-start">
                <button
                  type="button"
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-all shadow-lg hover:shadow-teal-500/20"
              >
                Log in
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <span className="text-gray-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToSignUp();
                  }}
                  className="text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Sign up
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