// src/app/dashboard/settings/layout.tsx
import { SettingsSidebar } from "@/components/dashboard/settings/SettingsSidebar";
import { BackButton } from "@/components/ui/BackButton";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <BackButton href="/dashboard" label="Volver al Dashboard" />
                <div className="flex flex-col gap-5 sm:flex-row">

                    <div className="w-full lg:w-[320px] lg:shrink-0">
                        <SettingsSidebar />
                    </div>

                    <div className="flex-1 bg-[#0f1e33] border border-gray-800 rounded-xl shadow-sm overflow-hidden">
                        {children}
                    </div>


                </div>
            </div>
        </div>
    );
}