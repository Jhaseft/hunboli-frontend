"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Tab = "profile" | "preferences" | "api";

export function SettingsPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Configuración de cuenta</h1>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2.5 transition text-sm sm:text-base w-full sm:w-auto"
          type="button"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Guardar cambios
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-800 overflow-x-auto scrollbar-hide">
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
            Perfil
          </TabButton>
          <TabButton active={tab === "preferences"} onClick={() => setTab("preferences")}>
            Preferencias
          </TabButton>
          <TabButton active={tab === "api"} onClick={() => setTab("api")}>
            API Keys
          </TabButton>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        {tab === "profile" && <ProfileForm defaultEmail={(user as any)?.email ?? ""} />}
        {tab === "preferences" && (
          <div className="text-gray-300">Aquí van preferencias (luego lo armamos).</div>
        )}
        {tab === "api" && <div className="text-gray-300">Aquí van tus API Keys (luego lo armamos).</div>}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 text-sm font-semibold transition ${
        active ? "text-white" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
      {/* underline */}
      <span
        className={`absolute left-0 -bottom-[1px] h-[2px] w-full ${
          active ? "bg-teal-500" : "bg-transparent"
        }`}
      />
    </button>
  );
}

function ProfileForm({ defaultEmail }: { defaultEmail: string }) {
  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nombre*" placeholder="Tu nombre" />
        <Field label="Apellido*" placeholder="Tu apellido" />
      </div>

      <Field label="Correo electrónico*" placeholder="tu@ejemplo.com" defaultValue={defaultEmail} disabled />

      {/* 2FA */}
      <div className="rounded-xl border border-gray-800 bg-white/5 px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-start sm:items-center gap-3">
          <Toggle />
          <div className="text-gray-200 text-sm sm:text-base">
            Google Authentication está <span className="font-semibold text-white">Habilitado</span> en tu cuenta
          </div>
        </div>

        <div className="mt-3 text-xs sm:text-sm text-gray-400 flex items-start gap-2">
          <span className="text-teal-300 shrink-0">ⓘ</span>
          <span>Cambiar tu contraseña pondrá tu cuenta en espera de seguridad por 5 días</span>
        </div>
      </div>

      <Field label="Contraseña actual*" placeholder="********" type="password" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nueva contraseña*" placeholder="********" type="password" />
        <Field label="Confirmar contraseña*" placeholder="********" type="password" />
      </div>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  defaultValue,
  disabled,
}: {
  label: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-200 mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-800 bg-gray-950/40 px-4 py-3 text-gray-100 placeholder:text-gray-500 outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 transition ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

function Toggle() {
  // Toggle visual (por ahora solo UI)
  return (
    <div className="relative h-6 w-11 rounded-full bg-teal-600/70 border border-teal-500/30">
      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white" />
    </div>
  );
}
