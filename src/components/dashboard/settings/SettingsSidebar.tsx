"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Item = {
  label: string;
  href?: string;
  key: "account" | "security" | "bank_accounts" | "whitelist" | "transparency" | "logout";
  icon: React.ReactNode;
};

const ITEMS: Item[] = [
  {
    key: "account",
    label: "Mi Perfil",
    href: "/dashboard/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    key: "security",
    label: "Seguridad ",
    href: "/dashboard/settings/security",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    key: "bank_accounts",
    label: "Cuentas Bancarias",
    href: "/dashboard/settings/bank-accounts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    key: "whitelist",
    label: "Verificacion",
    href: "/dashboard/settings/verification",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  {
    key: "logout",
    label: "Cerrar sesión",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  },
];

export function SettingsSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userName = user?.firstName || "Usuario";
  const userInitial = (userName?.[0] ?? "U").toUpperCase();

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard/settings") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const getCurrentLabel = () => {
    const current = ITEMS.find(item => item.href && isActive(item.href));
    return current?.label || "Configuración de cuenta";
  };

  const handleItemClick = (item: Item) => {
    if (item.key === "logout") {
      logout();
      router.push("/");
    } else if (item.href) {
      router.push(item.href);
      setIsMenuOpen(false);
    }
  };

  return (
    <aside className="w-full xl:w-[320px] xl:shrink-0">
      {/* Mobile/Tablet: Selector desplegable */}
      <div className="xl:hidden">
        <div className="rounded-xl border border-gray-800 bg-[#0f1e33] overflow-hidden">
          {/* Header con usuario y selector */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
            <div className="h-9 w-9 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <span className="font-semibold text-teal-300 text-sm">{userInitial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-white text-sm truncate">{userName}</div>
              <div className="text-xs text-gray-500">Cuenta</div>
            </div>
          </div>

          {/* Botón selector de sección */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition"
          >
            <span className="text-teal-300 font-medium text-sm">{getCurrentLabel()}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Menú desplegable */}
          {isMenuOpen && (
            <nav className="border-t border-gray-800 py-1">
              {ITEMS.map((item) => {
                const active = isActive(item.href);
                const isLogout = item.key === "logout";

                return (
                  <button
                    key={item.key}
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${isLogout
                      ? "text-red-400 hover:bg-red-500/10"
                      : active
                        ? "bg-teal-600/10 text-teal-300"
                        : "text-gray-300 hover:bg-white/5"
                      }`}
                  >
                    <span className={isLogout ? "text-red-400" : active ? "text-teal-400" : "text-gray-500"}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {active && !isLogout && (
                      <svg className="w-4 h-4 ml-auto text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Desktop: Sidebar tradicional */}
      <div className="hidden xl:block rounded-2xl border border-gray-800 bg-[#0f1e33] shadow-sm overflow-hidden">
        {/* Header usuario */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center">
            <span className="font-semibold text-teal-300">{userInitial}</span>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-gray-400 truncate">Cuenta</div>
          </div>
        </div>

        <div className="h-px bg-gray-800" />

        {/* Items */}
        <nav className="py-2">
          {ITEMS.map((item) => {
            const active = isActive(item.href);
            const isLogout = item.key === "logout";

            if (isLogout) {
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full text-left px-5 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition"
                >
                  <span className="text-red-400">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href!}
                className={`px-5 py-3 flex items-center gap-3 transition ${active ? "bg-teal-600/10 text-teal-300" : "text-gray-300 hover:bg-white/5"
                  }`}
              >
                <span
                  className={`h-6 w-1 rounded-full ${active ? "bg-teal-500" : "bg-transparent"
                    }`}
                />
                <span className={active ? "text-teal-400" : "text-gray-500"}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
