import { SettingsSidebar } from "@/components/dashboard/settings/SettingsSidebar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <SettingsSidebar />

          {/* Placeholder del contenido derecha */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-2">
              Aquí luego armamos el contenido (Profile / Preferences / API Keys).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
