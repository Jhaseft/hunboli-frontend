'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NavLink from './Header/Navlink';
import Logo from '../Components/Logo';
 
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: '/quienes', label: 'Quienes ' },
    { href: '/quienes-somos', label: 'Quienes Somos' },
    { href: '/why-tether', label: 'Porque Hunboli?' },
    { href: '/how-it-works', label: 'Como funciona' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/noticias', label: 'Noticias' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full bg-white  sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">

        <div className="flex items-center gap-4">
          <Logo />

          <span
            className={`font-bold text-xl md:text-2xl text-gray-800 transition-all duration-300 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
              }`}
          >
            HUNBOLI
          </span>
           
        </div>

        <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}  

          <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLogInOpen(true)}
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors"
              >
                Sign Up
              </button>
            </div>
        </nav>
        <button
          className="lg:hidden text-gray-700 hover:text-black transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-black font-semibold transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
