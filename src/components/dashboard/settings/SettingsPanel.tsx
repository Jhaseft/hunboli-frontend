"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Tab = "profile" | "preferences" | "api";

export function SettingsPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <section className="w-full rounded-2xl border border-gray-800 bg-[#0f1e33] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>

        <button
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 transition"
          type="button"
        >
          <span className="text-lg">💾</span>
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-6 border-b border-gray-800">
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
            Profile
          </TabButton>
          <TabButton active={tab === "preferences"} onClick={() => setTab("preferences")}>
            Preferences
          </TabButton>
          <TabButton active={tab === "api"} onClick={() => setTab("api")}>
            API Keys
          </TabButton>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
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
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First Name*" placeholder="Your Name" />
        <Field label="Last Name*" placeholder="Your Last Name" />
      </div>

      <Field label="Email*" placeholder="you@example.com" defaultValue={defaultEmail} disabled />

      {/* 2FA */}
      <div className="rounded-xl border border-gray-800 bg-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <Toggle />
          <div className="text-gray-200">
            Google Authentication is <span className="font-semibold text-white">Enabled</span> on your account
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-400 flex items-start gap-2">
          <span className="text-teal-300">ⓘ</span>
          <span>Changing your password will put your account on a 5 day security hold/review</span>
        </div>
      </div>

      <Field label="Current Password*" placeholder="********" type="password" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="New Password*" placeholder="********" type="password" />
        <Field label="Confirm Password*" placeholder="********" type="password" />
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
