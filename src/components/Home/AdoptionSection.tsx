import { DollarSign, Shield, Wallet, Coins, Lock, TrendingUp } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export function AdoptionSection() {
  const values = [
    { name: "Seguridad", icon: <Shield className="w-12 h-12 text-teal-500" /> },
    { name: "Transparencia", icon: <Lock className="w-12 h-12 text-teal-500" /> },
    { name: "Accesibilidad", icon: <Wallet className="w-12 h-12 text-teal-500" /> },
    { name: "Innovación", icon: <TrendingUp className="w-12 h-12 text-teal-500" /> },
    { name: "Comunidad", icon: <Coins className="w-12 h-12 text-teal-500" /> },
    { name: "Estabilidad", icon: <DollarSign className="w-12 h-12 text-teal-500" /> },
  ];

  const carouselRef = useRef(null);
  const scrollRef = useRef(0); // guardamos el scroll actual
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let frame;

    const scroll = () => {
      if (!isHovered) {
        scrollRef.current += 1; // avanza 1px por frame
        if (scrollRef.current >= carousel.scrollWidth / 2) {
          // efecto infinito: reiniciamos sin saltos
          scrollRef.current -= carousel.scrollWidth / 2;
        }
        carousel.scrollLeft = scrollRef.current;
      }
      frame = requestAnimationFrame(scroll);
    };

    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  // Duplicamos la lista solo una vez
  const displayValues = [...values, ...values];

  return (
    <section className="py-32 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl text-white mb-6">
          Nuestros valores fundamentales
        </h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
          Hunboli es una moneda nueva que empieza su camino, enfocada en generar confianza, estabilidad y oportunidades
          para todos. Estos son los valores que guían nuestra comunidad y nuestra misión.
        </p>

        <div
          ref={carouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-12 overflow-x-hidden whitespace-nowrap py-6"
        >
          {displayValues.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-800/20 rounded-xl hover:bg-gray-800/40 transition-all flex-shrink-0"
              style={{ minWidth: "150px" }}
            >
              {value.icon}
              <span className="text-white text-sm font-semibold">{value.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
