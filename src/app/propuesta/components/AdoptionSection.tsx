export function AdoptionSection() {
  const partners = [
    { name: 'Bitfinex', logo: '◇' },
    { name: 'Binance', logo: '⬡' },
    { name: 'Kraken', logo: '⬢' },
    { name: 'Coinbase', logo: '◆' },
    { name: 'Huobi', logo: '⬟' },
    { name: 'OKX', logo: '▣' },
  ];

  return (
    <section className="py-32 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl text-white mb-6">
          Widespread adoption
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
          From trading the high-flying latest meme coin to instant over-the-counter 
          market trades to receiving loan disbursements, StableCoin is the most widely 
          adopted stablecoin. Across major centralized and decentralized exchanges, 
          OTC desks, and leading projects, including Binance, Bybit, Kraken, Uniswap, 
          and 1inch.
        </p>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="flex flex-col items-center justify-center gap-3 p-6 hover:opacity-100 transition-opacity"
            >
              <div className="text-5xl text-gray-400">{partner.logo}</div>
              <span className="text-sm text-gray-500">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
