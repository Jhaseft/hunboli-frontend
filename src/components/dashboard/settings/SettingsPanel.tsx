"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";

export function SettingsPanel() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Usuario";
  const userInitial = (user?.firstName?.[0] ?? "U").toUpperCase();
  const roleLabel = user?.role === "ADMIN" ? "Administrador" : "Usuario";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.phoneNumber.trim()) {
      setError("El número de teléfono es obligatorio");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await userService.editPhoneNumber(formData.phoneNumber);
      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al actualizar el número de teléfono");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      phoneNumber: user?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  return (
    <section className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Mi Perfil</h1>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6 space-y-6">
        {/* Bloque 1: Encabezado de Identidad */}
        <IdentityHeader
          initial={userInitial}
          fullName={fullName}
          role={roleLabel}
        />

        {/* Bloque 2: Datos de Cuenta (Bloqueados) */}
        <AccountDataSection
          email={user?.email || ""}
          userId={user?.id || ""}
          country={user?.country || ""}
        />

        {/* Bloque 3: Datos de Contacto (Editables) */}
        <ContactDataSection
          phoneNumber={formData.phoneNumber}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChange={handleInputChange}
          error={error}
        />

        {/* Botones de acción */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// Bloque 1: Encabezado de Identidad
// ============================================
function IdentityHeader({
  initial,
  fullName,
  role,
}: {
  initial: string;
  fullName: string;
  role: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gradient-to-r from-[#0f1e33] to-[#0a1929] p-5 sm:p-6">
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Avatar */}
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 border-2 border-teal-400/30 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <span className="font-bold text-white text-2xl sm:text-3xl">{initial}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">{fullName}</h2>
          <RoleBadge role={role} />
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "Administrador";
  return (
    <span
      className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold ${isAdmin
        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
        : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
        }`}
    >
      {isAdmin ? <ShieldIcon /> : <UserIcon />}
      {role}
    </span>
  );
}

// ============================================
// Bloque 2: Datos de Cuenta (Bloqueados)
// ============================================
function AccountDataSection({
  email,
  userId,
  country,
}: {
  email: string;
  userId: string;
  country: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#0f1e33] overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-gray-800 bg-gray-800/30">
        <div className="flex items-center gap-2">
          <LockIcon className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-300">Datos de Cuenta</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Estos datos no pueden ser modificados. Contacta a soporte si necesitas cambiarlos.
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <LockedField label="Correo electrónico" value={email} icon={<EmailIcon />} />
        <LockedField label="ID de Usuario" value={userId} icon={<IdIcon />} copyable />
        <LockedField label="País" value={formatCountry(country)} icon={<GlobeIcon />} />
      </div>
    </div>
  );
}

function LockedField({
  label,
  value,
  icon,
  copyable,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
        {icon}
        {label}
        <LockIcon className="w-3 h-3 text-gray-600" />
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-gray-400 text-sm">
          {value || "-"}
        </div>
        {copyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg border border-gray-700/50 bg-gray-900/50 text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition"
            title="Copiar"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-teal-400" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Bloque 3: Datos de Contacto (Editables)
// ============================================
function ContactDataSection({
  phoneNumber,
  isEditing,
  onEdit,
  onChange,
  error,
}: {
  phoneNumber: string;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (field: string, value: string) => void;
  error: string | null;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#0f1e33] overflow-hidden">
      <div className="px-4 sm:px-5 py-3 border-b border-gray-800 bg-gray-800/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <EditIcon className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-semibold text-gray-300">Datos de Contacto</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">Puedes actualizar esta información</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-teal-400 hover:bg-teal-500/10 border border-teal-500/30 transition"
          >
            <EditIcon className="w-3.5 h-3.5" />
            Editar
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <EditableField
          label="Teléfono"
          value={phoneNumber}
          placeholder="+591 70000000"
          icon={<PhoneIcon />}
          isEditing={isEditing}
          onChange={(v) => onChange("phoneNumber", v)}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  placeholder,
  icon,
  isEditing,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
        {icon}
        {label}
      </label>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-700 bg-gray-900/70 px-4 py-2.5 text-gray-100 text-sm placeholder:text-gray-600 outline-none focus:border-teal-500/70 focus:ring-2 focus:ring-teal-500/20 transition"
        />
      ) : (
        <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-2.5 text-gray-300 text-sm">
          {value || <span className="text-gray-600">{placeholder}</span>}
        </div>
      )}
    </div>
  );
}

// ============================================
// Helpers
// ============================================
function formatCountry(country: string | null | undefined): string {
  if (!country) return "-";
  const countries: Record<string, string> = {
    BOLIVIA: "Bolivia",
    PERU: "Perú",
  };
  return countries[country] || country;
}

// ============================================
// Icons
// ============================================
function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function EditIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
