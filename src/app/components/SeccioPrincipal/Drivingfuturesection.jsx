'use client';

export default function DrivingFutureSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <svg className="w-32 h-32 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 20 L30 35 L30 65 L50 80 L70 65 L70 35 Z M50 30 L40 38 L40 62 L50 70 L60 62 L60 38 Z" />
                  <rect x="35" y="48" width="30" height="4" />
                </svg>
              </div>
            
              <div className="absolute inset-0 w-64 h-64 border-4 border-teal-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

        
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Driving the Future of Money
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Tether tokens are the first and most widely adopted stablecoins, 
              having pioneered the concept in the digital token space. A disruptor 
              to the conventional financial system and a trailblazer in the digital 
              use of traditional currencies, Tether Tokens support and empower 
              growing ventures and innovation throughout the blockchain space. 
              Tether Tokens exist as a digital token built on multiple blockchains.
            </p>
            <button className="text-teal-600 hover:text-teal-700 font-semibold px-6 py-2 border-2 border-teal-600 rounded-full transition-all duration-300 hover:bg-teal-50">
              Learn How Tether Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

