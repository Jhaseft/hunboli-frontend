"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../ui/LogoAnimacion";
import { MobileMenu } from "../Home/Layouts/MobileMenu";


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

  const hideNavbar =
  pathname === "/login" ||
  pathname === "/sign-up" ||
  pathname.startsWith("/login/") ||
  pathname.startsWith("/sign-up/");

  const isDashboard = pathname.startsWith("/dashboard");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token"); // cambia el key si usas otro
    setIsAuthenticated(!!token);
  }, []);

  const showDashboardUI = isDashboard;

  if (hideNavbar) return null;

  return (
    <>
      <nav
  className={`${
    showDashboardUI ? "relative bg-gray-950" : "fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg"
  } z-50 border-b border-gray-800`}
>

        <div className="max-w-7xl mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            <Logo />

            {/*Links del home solo si NO es dashboard y NO está logueado */}
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

            <div className="flex items-center gap-1">
             
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
                  {/* Usuario */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-200">
                    <span className="opacity-80">👤</span>
                    <span className="text-sm">Juanito</span>
                  </div>

                  {/* KYC */}
                  <div className="px-3 py-2 rounded-md text-sm font-medium bg-yellow-600/20 text-yellow-300 border border-yellow-500/30">
                    KYC Pendiente
                  </div>

                  {/* Salir (por ahora solo al home) */}
                  <button
                    onClick={() => router.push("/")}
                    className="relative text-gray-300 hover:text-teal-400 transition-colors px-4 py-2 rounded-md"
                  >
                    Salir
                  </button>
                </>
              )}
            </div>

          
            <button
              className="md:hidden hidden lg:hidden sm:hidden  flex-col gap-1 z-[60]"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={`h-0.5 w-8 bg-gray-300 transition ${
                  isOpen && "rotate-45 translate-y-2"
                }`}
              />
              <span
                className={`h-0.5 w-8 bg-gray-300 transition ${
                  isOpen && "opacity-0"
                }`}
              />
              <span
                className={`h-0.5 w-8 bg-gray-300 transition ${
                  isOpen && "-rotate-45 -translate-y-2"
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/*MobileMenu solo en landing (para que no aparezca en dashboard) */}
      {!showDashboardUI && (
        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={NAV_LINKS} />
      )}
    </>
  );
}
