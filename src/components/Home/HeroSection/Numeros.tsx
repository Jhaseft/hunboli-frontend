import { useEffect, useRef, useState } from 'react';
import { useCountUp } from '@/Hooks/useCountUp';

export default function Numeros() {
    const [isVisible, setIsVisible] = useState(false);
    const numerosRef = useRef<HTMLDivElement>(null);

    const fondos = useCountUp(150000, 2000, isVisible);
    const velocidad = useCountUp(99, 1500, isVisible);

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

        if (numerosRef.current) {
            observer.observe(numerosRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={numerosRef}
            className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8"
        >
            <div>
                <div className="text-2xl sm:text-3xl md:text-3xl text-teal-400 font-bold">
                    ${(fondos / 1000).toFixed(0)}K
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Fondos Iniciales</div>
            </div>
            <div>
                <div className="text-2xl sm:text-3xl md:text-3xl text-teal-400 font-bold">24/7</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">Soporte</div>
            </div>
        </div>
    );
}