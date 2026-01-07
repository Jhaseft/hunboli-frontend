'use client';
export default function BackedTransparentSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-teal-50 to-cyan-50 overflow-hidden">
    
      <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end">
        <div className="relative w-96 h-96">
        
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full opacity-90"></div>
          
        
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-white z-10" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 20 L30 35 L30 65 L50 80 L70 65 L70 35 Z M50 30 L40 38 L40 62 L50 70 L60 62 L60 38 Z" />
              <rect x="35" y="48" width="30" height="4" />
            </svg>
          </div>
          
         
          <div className="absolute bottom-0 right-0 w-64 h-64">
            <div className="w-full h-full bg-gradient-to-tl from-teal-600 to-teal-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            100% backed and fully transparent
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            All Tether tokens (USDT) are pegged at 1-to-1 with a matching fiat 
            currency and are 100% backed by  reserves. As a fully 
            transparent company, we publish a record of the current reserve 
            assets and liabilities.
          </p>
          <button className="text-teal-600 hover:text-teal-700 font-semibold px-6 py-2 border-2 border-teal-600 rounded-full transition-all duration-300 hover:bg-white">
            Go to Transparency Page
          </button>
        </div>
      </div>
    </section>
  );
};

