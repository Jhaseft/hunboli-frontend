import { Shield, TrendingUp, Globe, Lock } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Main Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center transform rotate-12">
                  <svg className="w-32 h-32 text-teal-500" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10 L70 30 L70 50 L50 70 L30 50 L30 30 Z" opacity="0.3" />
                    <path d="M50 20 L65 35 L65 50 L50 65 L35 50 L35 35 Z" />
                    <rect x="42" y="40" width="16" height="4" rx="2" fill="white" />
                    <rect x="42" y="48" width="16" height="4" rx="2" fill="white" />
                    <rect x="42" y="56" width="16" height="4" rx="2" fill="white" />
                  </svg>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-400/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-600/20 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl text-white">
              Driving the Future of Money
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              StableCoin powers the most widely adopted stablecoin, enabling 
              innovators and change-makers to create a stable, programmable 
              foundation to bring their big, bold ideas to life. StableCoin is 
              designed to be a trusted solution for seamless, transparent, and 
              revolutionary transactions in the blockchain space, fostering trust 
              and security throughout the ecosystem, which forms a digital bridge 
              built for all currencies and blockchains.
            </p>
            <button className="px-6 py-3 border border-teal-500 text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
              Learn How StableCoin Works
            </button>
          </div>
        </div>

        {/* Secondary Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="text-5xl text-white">
              100% backed and fully transparent
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              All StableCoin tokens are fully backed 1-to-1 with a combination 
              of traditional currency and cash equivalents, and, from time to time, 
              may include other assets and receivables. Our position is that when 
              you redeem your StableCoin tokens, you get cash equal to the current 
              value of the tokens you redeem.
            </p>
            <button className="px-6 py-3 border border-teal-500 text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all">
              Go to Transparency Page
            </button>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-40 h-40 bg-white/90 rounded-full flex items-center justify-center">
                  <Shield className="w-20 h-20 text-teal-500" />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-teal-400/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
