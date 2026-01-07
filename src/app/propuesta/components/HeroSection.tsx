import { ArrowRight } from 'lucide-react';
import { FloatingIcons } from './FloatingIcons';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl text-white">
                StableCoin token
              </h1>
              <h2 className="text-6xl lg:text-7xl text-teal-400">
                Driving
              </h2>
              <p className="text-xl text-gray-400 max-w-xl">
                The future of digital currency. Stable, secure, and transparent.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-all hover:scale-105">
                Create Account
              </button>
              <button className="px-8 py-4 bg-transparent border border-teal-600 text-teal-400 hover:bg-teal-600/10 rounded-full transition-all flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Learn How StableCoin Works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl text-teal-400">$120B+</div>
                <div className="text-sm text-gray-500">Market Cap</div>
              </div>
              <div>
                <div className="text-3xl text-teal-400">50M+</div>
                <div className="text-sm text-gray-500">Users</div>
              </div>
              <div>
                <div className="text-3xl text-teal-400">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block">
            <FloatingIcons />
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl"></div>
    </section>
  );
}
