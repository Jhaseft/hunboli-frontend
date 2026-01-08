import { Users, Landmark, Store, TrendingUp } from 'lucide-react';

export function UseCasesSection() {
  const useCases = [
    {
      icon: Users,
      title: 'StableCoin for Individuals',
      description: 'Store and send tokens globally with minimal fees, instantly and securely.',
    },
    {
      icon: Landmark,
      title: 'StableCoin for Institutions',
      description: 'Access liquidity and move large amounts of value efficiently across markets.',
    },
    {
      icon: Store,
      title: 'StableCoin for Businesses',
      description: 'Accept payments globally, reduce transaction costs, and expand your reach.',
    },
    {
      icon: TrendingUp,
      title: 'StableCoin for Traders',
      description: 'Trade with confidence using the most liquid stablecoin in the market.',
    },
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-white mb-4">
            The token that is disrupting the global financial industry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase) => (
            <div 
              key={useCase.title}
              className="p-8 bg-gray-800/30 border border-gray-700 rounded-2xl hover:border-teal-500/50 transition-all group"
            >
              <div className="mb-6">
                <div className="w-14 h-14 bg-teal-500/10 rounded-lg flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                  <useCase.icon className="w-7 h-7 text-teal-400" />
                </div>
              </div>
              <h3 className="text-xl text-teal-400 mb-4">
                {useCase.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
