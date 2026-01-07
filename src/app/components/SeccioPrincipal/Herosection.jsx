'use client';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-cyan-50 to-teal-50 overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-40 right-60 w-32 h-32 bg-teal-300 rounded-full opacity-30"></div>
    
        <div className="absolute top-20 right-96">
          <div className="w-8 h-8 bg-teal-400 rounded-full opacity-40 animate-pulse"></div>
        </div>
        <div className="absolute top-60 right-80">
          <div className="w-6 h-6 bg-cyan-400 rounded-full opacity-30 animate-bounce"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
            Tether token
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-700 mb-8">
            Widespread Adoption
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Create Account
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-full border-2 border-gray-300 transition-all duration-300 hover:border-teal-500">
              Learn How Tether Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

