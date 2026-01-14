"use client";

import { useState, useRef, useEffect } from "react";
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { user, token, logout, isLoading } = useAuth();

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/sign-up" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/sign-up/");

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthenticated = !!token && !!user;

  const showDashboardUI = isDashboard;

  const userInitial = (user?.firstName?.[0] ?? "U").toUpperCase();
  const userName = user?.firstName || "Usuario";

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isProfileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    router.push("/");
  };

  const handleNavigation = (href: string) => {
    setIsProfileMenuOpen(false);
    router.push(href);
  };

  if (hideNavbar) return null;

  // Componente del menú desplegable reutilizable
  const ProfileDropdown = () => (
    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-900 border border-gray-700 shadow-xl overflow-hidden z-50">
      <div className="py-1">
        {/* Home o Dashboard según la ubicación */}
        {isDashboard ? (
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-colors w-full text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </button>
        ) : (
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-colors w-full text-left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboard</span>
          </button>
        )}

        <div className="border-t border-gray-800 my-1"></div>

        {/* Configuración */}
        <button
          onClick={() => handleNavigation("/dashboard/settings")}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-colors w-full text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Configuración</span>
        </button>

        {/* KYC */}
        <button
          onClick={() => handleNavigation("/dashboard/kyc")}
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-teal-400 transition-colors w-full text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>KYC</span>
        </button>

        <div className="border-t border-gray-800 my-1"></div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors w-full text-left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <nav
        className={`${showDashboardUI
            ? "relative bg-gray-950"
            : "fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg"
          } z-50 border-b border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-6 py-1 relative">
          <div className="flex items-center justify-between">
            <Logo disableLink={showDashboardUI} />

            {!showDashboardUI && (
              <div className="hidden md:!flex items-center gap-8 relative">
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

            {/* Desktop: botones de auth o perfil */}
            <div className="hidden md:!flex items-center gap-1">
              {!isAuthenticated ? (
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
                  {showDashboardUI && (
                    <>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-200">
                        <span className="opacity-80">👤</span>
                        <span className="text-sm">{user?.firstName || "Usuario"}</span>
                      </div>

                      <div
                        className={`px-3 py-2 rounded-md text-sm font-medium ${user?.KycStatus === "APPROVED"
                            ? "bg-green-600/20 text-green-300 border border-green-500/30"
                            : user?.KycStatus === "REJECTED"
                              ? "bg-red-600/20 text-red-300 border border-red-500/30"
                              : "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                      >
                        {user?.KycStatus === "APPROVED"
                          ? "KYC Aprobado"
                          : user?.KycStatus === "REJECTED"
                            ? "KYC Rechazado"
                            : "KYC Pendiente"}
                      </div>
                    </>
                  )}

                  {/* perfil de usuario - Desktop */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="relative inline-flex items-center gap-2 rounded-full bg-gray-800/40 border border-gray-700 px-3 py-2 text-gray-100 hover:bg-gray-800/70 transition"
                      aria-label="Perfil"
                      title="Perfil"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-200 font-semibold">
                        {userInitial}
                      </span>
                      <span className="text-sm font-medium">{userName}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Menú desplegable Desktop */}
                    {isProfileMenuOpen && <ProfileDropdown />}
                  </div>
                </>
              )}
            </div>

            {/* Mobile: hamburguesa (solo cuando NO está en dashboard) */}
            {!showDashboardUI && (
              <button
                className="md:!hidden flex flex-col items-end gap-1 z-60"
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
            )}
          </div>
        </div>
      </nav>

      {!showDashboardUI && (
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          links={NAV_LINKS}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      )}
    </>
  );
}
