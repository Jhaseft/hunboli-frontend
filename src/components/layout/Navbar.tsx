"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../ui/LogoAnimacion";
import { MobileMenu } from "../Home/Layouts/MobileMenu";
import { useAuth } from "@/context/AuthContext";
import { AuthResponse, User } from "@/types";



const NAV_LINKS = [
  { label: "¿Por qué Hunboli?", href: "/why" },
  { label: "Cómo funciona", href: "/how-it-works" },
  { label: "Transparencia", href: "/transparency" },
  { label: "Noticias", href: "/news" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  //  Condicional por ruta + auth (mínimo)
  const pathname = usePathname();
  const router = useRouter();

  // Usar el contexto de autenticación
  const { user, token, logout } = useAuth();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/sign-up/");

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthenticated = !!token && !!user;

  const showDashboardUI = isDashboard;

  if (hideNavbar) return null;
  console.log(user);
  return (
    <>
      <nav
        className={`${showDashboardUI ? "relative bg-gray-950" : "fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg"
          } z-50 border-b border-gray-800`}
      >

        <div className="max-w-7xl mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            <Logo />


            {!showDashboardUI && (
              <div className="hidden md:flex items-center gap-8 relative">
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="relative">
                    <span className="navLinkGlow"></span>
                    <Link
                      href={link.href}
                      className="relative text-gray-300 hover:text-teal-400 transition-colors px-3 py-1 rounded-md"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="md:flex lg:flex hidden items-center gap-1">

              {!showDashboardUI ? (
                <>
                  <div className="relative">
                    <span className="buttonGlow"></span>
                    <Link
                      href="/login"
                      className="relative text-gray-300 hover:text-teal-400 transition-colors px-4 py-2 rounded-md"
                    >
                      Iniciar sesión
                    </Link>
                  </div>

                  <div className="relative">
                    <span className="buttonGlow"></span>
                    <Link
                      href="/sign-up"
                      className="relative px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors"
                    >
                      Registrarse
                    </Link>
                  </div>
                </>
              ) : (
                <>

                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-200">
                    <span className="opacity-80">👤</span>
                    <span className="text-sm">{user?.firstName || 'Usuario'}</span>
                  </div>


                  <div className={`px-3 py-2 rounded-md text-sm font-medium ${user?.KycStatus === 'APPROVED'
                    ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                    : user?.KycStatus === 'REJECTED'
                      ? 'bg-red-600/20 text-red-300 border border-red-500/30'
                      : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                    {user?.KycStatus === 'APPROVED'
                      ? 'KYC Aprobado'
                      : user?.KycStatus === 'REJECTED'
                        ? 'KYC Rechazado'
                        : 'KYC Pendiente'}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="relative text-gray-300 hover:text-teal-400 transition-colors px-4 py-2 rounded-md"
                  >
                    Salir
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                className="flex flex-col items-end gap-1 z-[60]"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span
                  className={`h-0.5 w-8 bg-gray-300 transition ${isOpen && "rotate-45 translate-y-2"
                    }`}
                />
                <span
                  className={`h-0.5 w-5  bg-gray-300 transition ${isOpen && "opacity-0"
                    }`}
                />
                <span
                  className={`h-0.5 w-3 bg-gray-300 transition ${isOpen && "-rotate-45 -translate-y-2"
                    }`}
                />
              </button>
            </div>


          </div>
        </div>
      </nav>

      {!showDashboardUI && (
        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={NAV_LINKS} />
      )}
    </>
  );
}
