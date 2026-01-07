'use client';
import { Coins } from 'lucide-react';
import { useState } from 'react';
import { SignUpModal } from './SignUpModal';
import { LogInModal } from './LogInModal';

interface NavbarProps {
  onLoginSuccess: () => void;
}

export function Navbar({ onLoginSuccess }: NavbarProps) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLogInOpen, setIsLogInOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">StableCoin</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#why" className="text-gray-300 hover:text-teal-400 transition-colors">
                Why StableCoin?
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-teal-400 transition-colors">
                How it works
              </a>
              <a href="#news" className="text-gray-300 hover:text-teal-400 transition-colors">
                News
              </a>
              <a href="#gold" className="text-gray-300 hover:text-teal-400 transition-colors">
                StableCoin Gold
              </a>
              <a href="#transparency" className="text-gray-300 hover:text-teal-400 transition-colors">
                Transparency
              </a>
            </div>

         
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLogInOpen(true)}
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
      />
      <LogInModal 
        isOpen={isLogInOpen} 
        onClose={() => setIsLogInOpen(false)} 
        onSwitchToSignUp={() => setIsSignUpOpen(true)}
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
}