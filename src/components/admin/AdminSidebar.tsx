"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Plus,
  Minus,
  Banknote,
  ShieldCheck,
  Clock,
  LogOut,
  BadgeCheck,
  Menu,
  X
} from "lucide-react";
import { retiroService } from "@/services/retiro.service";
import { verificationService } from "@/services/verification.service";
import { mintsService } from "@/services/mints.service";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  section?: string;
};


export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [pendingMints, setPendingMints] = useState<number | null>(null);
  const [pendingVerifications, setPendingVerifications] = useState<number | null | undefined>(null);

  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const [retiros, verifications, mints] = await Promise.all([
          retiroService.pendingacoounts(),
          verificationService.getQuantity(),
          mintsService.getPendingCount(),
        ]);
        setPendingCount(retiros.pendingCount);
        setPendingVerifications(verifications?.quantity);
        setPendingMints(mints?.pendingCount ?? null);
      } catch (error) {
        console.error("Error al cargar contadores admin:", error);
      }
    };

    fetchPendingCount();

    // Opcional: Actualizar cada 30 segundos
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };
  const NAV_ITEMS: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Depósitos",
      href: "/admin/deposits",
      icon: <Banknote className="w-5 h-5" />,
      section: "OPERACIONES",
    },
    {
      label: "Solicitudes Mint",
      href: "/admin/mints",
      icon: <Plus className="w-5 h-5" />,
      badge: pendingMints ?? undefined,
      section: "OPERACIONES",
    },
    {
      label: "Solicitudes Redeem",
      href: "/admin/redeem",
      icon: <Minus className="w-5 h-5" />,
      badge: pendingCount ?? undefined,
    },
    {
      label: "Usuarios KYC",
      href: "/admin/kyc",
      icon: <ShieldCheck className="w-5 h-5" />,
      badge: 3,
    },
    {
      label: "Historial",
      href: "/admin/historial",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Verificacion",
      href: "/admin/verification",
      icon: <BadgeCheck className="w-5 h-5" />,
      badge: pendingVerifications ?? undefined,
    }
  ];

  return (
    <>
  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#0a1628] p-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

   
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

     
      <aside className={`
        fixed top-0 left-0
        w-[260px] min-h-screen
        bg-[#0a1628]
        border-r border-gray-800
        flex flex-col justify-between
        z-40
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>

        <div>
          <div className="flex items-center gap-3 px-5 py-6">
            <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-wide">HUNBOLI</div>
              <div className="text-xs text-gray-400">{user?.role}</div>
            </div>
          </div>


          <nav className="mt-2 flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <div key={item.href}>
                  {item.section && (
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 pt-5 pb-2">
                      {item.section}
                    </div>
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
                      ? "bg-teal-600/20 text-teal-300"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      }`}
                  >
                    {active && (
                      <div className="w-1 h-6 rounded-full bg-teal-400 -ml-1 mr-1" />
                    )}
                    <span className={active ? "text-teal-400" : "text-gray-500"}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs font-semibold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 ${active
                          ? "bg-teal-500/30 text-teal-300"
                          : "bg-gray-700 text-gray-300"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>


        <div className="px-3 pb-5">
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="font-semibold text-white text-sm">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{user?.firstName}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
