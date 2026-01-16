import { SettingsSidebar } from "@/components/dashboard/settings/SettingsSidebar";
import { SettingsPanel } from "@/components/dashboard/settings/SettingsPanel";
import { BackButton } from "@/components/ui/BackButton";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <BackButton href="/dashboard" label="Volver al Dashboard" />
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="md:w-[320px] shrink-0">
            <SettingsSidebar />
          </div>
          <div className="flex-1 min-w-0">
            <SettingsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
