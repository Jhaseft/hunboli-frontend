import { FloatingIcons } from './FloatingIcons';
import { TypewriterText } from './TypewriterText';
import Numeros from './Numeros';
import CrearCuenta from './CrearCuenta';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 sm:pt-20 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:py-16 md:py-16 w-full">

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold mb-6 md:mb-10">
                HUNBOLI Token
              </h1>

              <div className="h-[10rem] sm:h-[11rem] md:h-[12rem] lg:h-[12rem] flex items-center overflow-hidden">
                <h2 className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl text-teal-400 leading-tight">
                  <TypewriterText
                    texts={[
                      'Impulsando el futuro digital',
                      'Finanzas seguras y estables',
                      'Transparencia sin fronteras',
                    ]}
                  />
                </h2>
              </div>

            </div>
            <CrearCuenta/>
            <Numeros />
          </div>
          <div className="relative ">
            <FloatingIcons />
          </div>
        </div>
      </div>

      <div className="absolute top-10 sm:top-20 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-teal-600/5 rounded-full blur-3xl"></div>
    </section>
  );
}