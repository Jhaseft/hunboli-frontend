import React from 'react';

export default function WidespreadAdoptionSection() {
  // Logo placeholders - In production, replace with actual logo images or SVGs
  const partners = [
    { name: 'BitcoinVN', color: 'text-gray-400' },
    { name: 'Bittrex', color: 'text-gray-400' },
    { name: 'BTSE', color: 'text-gray-400' },
    { name: 'cobo', color: 'text-gray-400' },
    { name: 'coinbase', color: 'text-gray-400' },
  ];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
       
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Widespread adoption
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From being the first, to the most used, stablecoins, and one of the most 
            traded coins by volume, Tether tokens have come a long way. Tether 
            is now widely used by nearly every major OTC desk, exchange, wallet, 
            merchant, ATM, wallet, and wallets. Including:
          </p>
        </div>

      
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
            >
              <span className={`text-2xl md:text-3xl font-bold ${partner.color} opacity-60 hover:opacity-100 transition-opacity`}>
                {partner.name}
              </span>
            </div>
          ))}
        </div>

      
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-8">
          {['BitcoinVN', 'BTCEX', 'BTSE', 'cobo', 'coinbase'].map((name, index) => (
            <div
              key={index}
              className="w-32 h-12 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-400 text-sm font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

