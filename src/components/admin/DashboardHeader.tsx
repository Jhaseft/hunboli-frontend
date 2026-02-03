"use client";

import { RefreshCw, Bell } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors flex-1 sm:flex-initial">
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Actualizar Reservas</span>
          <span className="sm:hidden">Actualizar</span>
        </button>
        <button className="relative p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
