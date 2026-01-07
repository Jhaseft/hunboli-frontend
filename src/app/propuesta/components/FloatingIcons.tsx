import { Bitcoin, DollarSign, Euro, Coins, Wallet, TrendingUp, Lock, Globe, Zap, Shield, CircleDollarSign, Banknote } from 'lucide-react';

export function FloatingIcons() {
  const icons = [
    { Icon: Bitcoin, position: 'top-10 left-20', delay: '0s', color: 'text-orange-400' },
    { Icon: DollarSign, position: 'top-32 right-20', delay: '0.5s', color: 'text-green-400' },
    { Icon: Euro, position: 'top-52 left-32', delay: '1s', color: 'text-blue-400' },
    { Icon: Coins, position: 'top-20 right-40', delay: '1.5s', color: 'text-teal-400' },
    { Icon: Wallet, position: 'bottom-40 left-10', delay: '2s', color: 'text-purple-400' },
    { Icon: TrendingUp, position: 'bottom-20 right-32', delay: '2.5s', color: 'text-pink-400' },
    { Icon: Lock, position: 'top-64 right-10', delay: '3s', color: 'text-yellow-400' },
    { Icon: Globe, position: 'bottom-52 right-20', delay: '3.5s', color: 'text-cyan-400' },
    { Icon: Zap, position: 'top-40 left-10', delay: '4s', color: 'text-red-400' },
    { Icon: Shield, position: 'bottom-32 left-40', delay: '4.5s', color: 'text-indigo-400' },
    { Icon: CircleDollarSign, position: 'top-80 left-24', delay: '5s', color: 'text-lime-400' },
    { Icon: Banknote, position: 'bottom-64 right-36', delay: '5.5s', color: 'text-emerald-400' },
  ];

  return (
    <div className="relative w-full h-[600px]">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Curved decorative lines */}
        <path
          d="M 100 100 Q 300 150 400 200"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 200 300 Q 350 250 450 350"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 150 400 Q 250 350 350 450"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Floating crypto icons */}
      {icons.map(({ Icon, position, delay, color }, index) => (
        <div
          key={index}
          className={`absolute ${position} animate-float`}
          style={{
            animationDelay: delay,
            animationDuration: '6s',
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl"></div>
            <div className="relative w-16 h-16 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Icon className={`w-8 h-8 ${color}`} />
            </div>
          </div>
        </div>
      ))}

      {/* Large decorative circles */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-20 w-80 h-80 bg-teal-600/5 rounded-full blur-3xl"></div>
    </div>
  );
}
