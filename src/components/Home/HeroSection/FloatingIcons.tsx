import {
  Bitcoin,
  Coins,
  Wallet,
  TrendingUp,
  Lock,
  Globe,
  Zap,
  Shield,
  Link,
  Cpu,
  Layers,
  Gem,
} from "lucide-react";

export function FloatingIcons() {
  const icons = [
  { Icon: Bitcoin, color: "text-orange-400", size: 220, duration: 18 },   // BTC
  { Icon: Coins, color: "text-yellow-400", size: 250, duration: 21 },    // Tokens
  { Icon: Wallet, color: "text-purple-400", size: 280, duration: 24 },   // Wallet
  { Icon: TrendingUp, color: "text-green-400", size: 320, duration: 28 },// Trading
  { Icon: Lock, color: "text-red-400", size: 200, duration: 16 },        // Seguridad
  { Icon: Shield, color: "text-indigo-400", size: 270, duration: 23 },   // Protección
  { Icon: Globe, color: "text-cyan-400", size: 340, duration: 30 },      // Red global
  { Icon: Zap, color: "text-amber-400", size: 230, duration: 19 },       // Velocidad
  { Icon: Link, color: "text-teal-400", size: 300, duration: 26 },       // Blockchain
  { Icon: Cpu, color: "text-pink-400", size: 260, duration: 22 },        // Smart contracts
  { Icon: Layers, color: "text-lime-400", size: 310, duration: 27 },     // Layer 2
  { Icon: Gem, color: "text-emerald-400", size: 240, duration: 20 },     // Valor
];

  return (
    <div className="relative w-full h-[600px] md:h-[700px]  flex items-center justify-center ">


      <div className="relative z-10">
        <img
          src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767946285/BH-removebg-preview_safcou_1_c3fni5.png"
          alt="Centro"
          className="w-48 h-48 object-contain drop-shadow-2xl"
        />
        <div className="absolute inset-0 bg-teal-500/10 blur-3xl rounded-full"></div>
      </div>


      {icons.map(({ Icon, color, size, duration }, index) => {
        const angle = (360 / icons.length) * index;

        return (
          <div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 10,
            }}
          >

            <div style={{ transform: `rotate(${angle}deg)` }}>

              <div
                className="animate-spin-slow"
                style={{ animationDuration: `${duration}s` }}
              >
                <div className="absolute top-1/2 left-full -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl"></div>
                    <div className="relative w-14 h-14 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Icon className={`w-7 h-7 ${color}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute w-[500px] h-[500px] bg-teal-500/5 blur-3xl rounded-full"></div>
    </div>
  );
}
