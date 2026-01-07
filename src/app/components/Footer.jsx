'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/17wKnBY4TL/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/pragatimotorsbolivia?igsh=aTZqYmV3ZXkzMHF4',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-black text-white mt-1">
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">


            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {!logoError ? (
                  <div className="h-16 w-[220px] relative">
                    <Image
                      src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767750866/pragatilogo_cw8xso.jpg"
                      alt="Pragbati | Nibol Logo"
                      fill
                      sizes="220px"
                      className="object-contain"
                      onError={() => setLogoError(true)}
                    />
                  </div>

                ) : (
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">PRAGBATI</h3>
                    <p className="text-sm text-gray-400">| NIBOL</p>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
                <span className="font-bold text-white">PRAGBATI</span> el líder en la fabricación de
                vehículos comerciales y de carga, ahora con el respaldo de{' '}
                <span className="font-bold text-white">NIBOL Ltda</span> como representante oficial
                para brindar asesoramiento y soporte técnico en todo Bolivia.
              </p>

              <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  Contáctanos
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p>
              © {new Date().getFullYear()} <span className="font-bold text-white">Pragbati Bolivia</span> – Todos los derechos reservados
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110"
                aria-label={social.name}
              >
                <span className="text-white hover:text-black transition-colors">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
