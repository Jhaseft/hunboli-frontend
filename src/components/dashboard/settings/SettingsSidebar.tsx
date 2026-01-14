"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Item = {
  label: string;
  href?: string;
  key: "account" | "verification" | "payments" | "whitelist" | "transparency" | "logout";
};

const ITEMS: Item[] = [
  { key: "account", label: "Account settings", href: "/dashboard/settings" },
  { key: "verification", label: "Verification", href: "/dashboard/settings/verification" },
  { key: "payments", label: "My Payment Accounts", href: "/dashboard/settings/payments" },
  { key: "whitelist", label: "Address Whitelist", href: "/dashboard/settings/whitelist" },
  { key: "transparency", label: "Transparency", href: "/dashboard/settings/transparency" },
  { key: "logout", label: "Log Out" },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userName = user?.firstName || "Usuario";
  const userInitial = (userName?.[0] ?? "U").toUpperCase();

  const isActive = (href?: string) => {
    if (!href) return false;
    // activo exacto o subrutas
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-full lg:w-[320px]">
      {/* Card contenedora */}
      <div className="rounded-2xl border border-gray-800 bg-[#0f1e33] shadow-sm overflow-hidden">
        {/* Header usuario */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center">
            <span className="font-semibold text-teal-700">{userInitial}</span>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-gray-400 truncate">Account</div>
          </div>
        </div>

        <div className="h-px bg-gray-800" />

        {/* Items */}
        <nav className="py-2">
          {ITEMS.map((item) => {
            const active = isActive(item.href);

            // Logout item (no Link)
            if (item.key === "logout") {
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="w-full text-left px-5 py-3 flex items-center gap-3 text-gray-200 hover:bg-white/5 transition"
                >
                  <span className="text-gray-400">⟵</span>
                  <span className="font-medium">Log Out</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href!}
                className={`px-5 py-3 flex items-center gap-3 transition ${
                  active ? "bg-teal-600/10 text-teal-200" : "text-gray-200 hover:bg-white/5"
                }`}
              >
                <span
                  className={`h-6 w-1 rounded-full ${
                    active ? "bg-teal-500" : "bg-transparent"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
