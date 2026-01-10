import { ArrowRight } from 'lucide-react';
export default function CrearCuenta(){
    return(
        <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-all hover:scale-105">
                Crear cuenta
              </button>

              <button className="px-8 py-4 bg-transparent border border-teal-600 text-teal-400 hover:bg-teal-600/10 rounded-full transition-all flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Conoce cómo funciona HUNBOLI
              </button>
            </div>
    );
}