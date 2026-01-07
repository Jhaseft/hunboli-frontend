'use client'; 

export default function DisruptingIndustrySection(){
  const features = [
    {
      title: 'Tether for Individuals',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="50" cy="35" r="15" />
          <path d="M 25 75 Q 25 55 50 55 Q 75 55 75 75" />
        </svg>
      ),
      description:
        'Tether tokens (USD₮) enable individuals to easily send, receive, and hold dollars across blockchains at a fraction of the cost compared to fiat money transfer services.',
      color: 'from-teal-400 to-cyan-400',
    },
    {
      title: 'Tether for Merchants',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="25" y="30" width="50" height="40" rx="5" />
          <path d="M 35 45 L 65 45" />
          <path d="M 35 55 L 65 55" />
        </svg>
      ),
      description:
        'For merchants, integrating Tether tokens removes friction that slows cross-border payments and eliminates middlemen to facilitate online and brick-and-mortar transactions.',
      color: 'from-cyan-400 to-blue-400',
    },
    {
      title: 'Tether for Exchanges',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M 30 40 L 50 20 L 70 40" />
          <path d="M 30 60 L 50 80 L 70 60" />
          <line x1="50" y1="25" x2="50" y2="75" />
        </svg>
      ),
      description:
        'Tether tokens are broadly used as the preferred way to maintain liquidity on exchanges, as they provide both a stable currency hedge in times of high volatility and a means of transfer between exchanges.',
      color: 'from-blue-400 to-indigo-400',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The token that is disrupting the global
            <br />
            financial industry
          </h2>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
            >
             
              <div className="mb-6">
                <div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  {feature.icon}
                </div>
              </div>

              
              <h3 className="text-2xl font-bold text-teal-600 mb-4">
                {feature.title}
              </h3>

             
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

             
              <button className="mt-6 text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 group/link">
                Learn more
                <svg
                  className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

