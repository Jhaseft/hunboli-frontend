import { useCountUp } from '@/Hooks/useCountUp';
import { TrendingUp, Zap, Shield, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fondos = useCountUp(150000, 2000, isVisible);
  const uptime = useCountUp(99, 1500, isVisible);
  const velocidad = useCountUp(50, 1800, isVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect(); // Solo anima una vez
          }
        });
      },
      { threshold: 0.3 } // Se activa cuando el 30% es visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: TrendingUp,
      value: `$${(fondos / 1000).toFixed(0)}K`,
      label: 'Fondos Iniciales',
      description: 'Capital respaldado',
    },
    {
      icon: Zap,
      value: `<${velocidad}ms`,
      label: 'Velocidad de Transacción',
      description: 'Ejecución instantánea',
    },
    {
      icon: Shield,
      value: `${uptime}.9%`,
      label: 'Disponibilidad',
      description: 'Uptime garantizado',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Soporte',
      description: 'Asistencia continua',
    },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 bg-gradient-to-b from-gray-900/50 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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