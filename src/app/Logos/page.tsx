import React from 'react';

export default function HunboliLogos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-white">
          Propuestas de Logo Hunboli (BH)
        </h1>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Inspirados en Bitcoin, Tether y otras criptomonedas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Propuesta 1: Estilo Bitcoin Clásico */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 1: Bitcoin Style</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#f7931a', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ff6b00', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#grad1)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="3" />
                <text x="100" y="120" fontFamily="Arial Black, sans-serif" fontSize="80" fontWeight="900" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Círculo naranja con letras blancas bold, inspirado en Bitcoin</p>
          </div>

          {/* Propuesta 2: Estilo Tether Moderno */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 2: Tether Style</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#26a17b', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#1e8a66', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#grad2)" />
                <text x="100" y="125" fontFamily="Arial, sans-serif" fontSize="85" fontWeight="700" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Verde Tether con tipografía limpia y moderna</p>
          </div>

          {/* Propuesta 3: Estilo Ethereum */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 3: Ethereum Style</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#627eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#4a5fd8', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 100 10 L 190 100 L 100 190 L 10 100 Z" fill="url(#grad3)" />
                <text x="100" y="120" fontFamily="Arial, sans-serif" fontSize="70" fontWeight="900" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Diamante azul al estilo Ethereum</p>
          </div>

          {/* Propuesta 4: Estilo Minimalista Monocromático */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 4: Minimal Black</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="95" fill="#000000" />
                <text x="100" y="125" fontFamily="Arial Black, sans-serif" fontSize="90" fontWeight="900" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Negro sólido minimalista y elegante</p>
          </div>

          {/* Propuesta 5: Estilo Dorado Luxury */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 5: Gold Luxury</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#ffed4e', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ffb700', stopOpacity: 1}} />
                  </linearGradient>
                  <radialGradient id="radGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#16213e', stopOpacity: 1}} />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#radGrad)" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#grad5)" strokeWidth="4" />
                <text x="100" y="125" fontFamily="Georgia, serif" fontSize="85" fontWeight="bold" fill="url(#grad5)" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Dorado premium sobre fondo oscuro</p>
          </div>

          {/* Propuesta 6: Estilo Cyber Neón */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 6: Cyber Neon</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00ffff', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ff00ff', stopOpacity: 1}} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="95" fill="#0a0a1a" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#grad6)" strokeWidth="3" filter="url(#glow)" />
                <text x="100" y="125" fontFamily="Courier New, monospace" fontSize="80" fontWeight="bold" fill="url(#grad6)" textAnchor="middle" filter="url(#glow)">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Neón ciberpunk con efecto brillante</p>
          </div>

          {/* Propuesta 7: Estilo Hexágono Tech */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 7: Hexagon Tech</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad7" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#667eea', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#764ba2', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 100 5 L 180 55 L 180 145 L 100 195 L 20 145 L 20 55 Z" fill="url(#grad7)" />
                <text x="100" y="125" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="900" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Hexágono tech con gradiente púrpura</p>
          </div>

          {/* Propuesta 8: Estilo Shield/Escudo */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 8: Shield Security</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad8" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#2c3e50', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#34495e', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <path d="M 100 10 Q 180 40, 180 100 Q 180 160, 100 190 Q 20 160, 20 100 Q 20 40, 100 10" fill="url(#grad8)" />
                <text x="100" y="125" fontFamily="Arial Black, sans-serif" fontSize="80" fontWeight="900" fill="#ecf0f1" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Escudo de seguridad, confianza y protección</p>
          </div>

          {/* Propuesta 9: Estilo Ripple/Ondas */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
            <h3 className="text-center mb-6 text-xl font-bold text-gray-800">Propuesta 9: Wave Flow</h3>
            <div className="flex justify-center items-center h-64">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad9" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#00a8ff', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#0097e6', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#grad9)" />
                <circle cx="100" cy="100" r="75" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
                <text x="100" y="120" fontFamily="Arial, sans-serif" fontSize="75" fontWeight="bold" fill="white" textAnchor="middle">BH</text>
              </svg>
            </div>
            <p className="text-center text-gray-600 mt-4">Ondas concéntricas estilo Ripple</p>
          </div>

        </div>

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Notas de Diseño</h2>
          <ul className="text-gray-200 space-y-2 list-disc list-inside">
            <li>Todas las propuestas usan las letras <span className="font-bold">BH</span> para Hunboli</li>
            <li>Inspiradas en los logos más reconocidos de criptomonedas</li>
            <li>Cada diseño es escalable (SVG) y funciona en cualquier tamaño</li>
            <li>Puedes elegir la que más te guste y personalizarla con otros colores</li>
            <li>Recomendación: Propuestas 1, 2, 5 o 7 son las más versátiles para una criptomoneda</li>
          </ul>
        </div>
      </div>
    </div>
  );
}