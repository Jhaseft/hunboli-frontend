"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const ADMIN_ROLES = ["ADMIN", "OPERATOR_BO", "OPERATOR_PE"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (!ADMIN_ROLES.includes(user.role)) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Mientras carga o si no tiene permisos, no renderizar el contenido admin
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#060e1a]">
      <AdminSidebar />
      <main className="flex-1 ml-[270px] overflow-auto">{children}</main>
    </div>
  );
}
