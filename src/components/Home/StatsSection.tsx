import { TrendingUp, Users, Globe, Shield } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: '$120B+',
      label: 'Total Market Cap',
      description: 'Trusted by millions worldwide',
    },
    {
      icon: Users,
      value: '50M+',
      label: 'Active Users',
      description: 'Growing every day',
    },
    {
      icon: Globe,
      value: '200+',
      label: 'Countries Supported',
      description: 'Global coverage',
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Backed & Transparent',
      description: 'Full reserve backing',
    },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="text-center p-8 rounded-2xl bg-gray-800/20 border border-gray-700/50 hover:border-teal-500/30 transition-all"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-teal-400" />
                </div>
              </div>
              <div className="text-4xl text-white mb-2">{stat.value}</div>
              <div className="text-teal-400 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
