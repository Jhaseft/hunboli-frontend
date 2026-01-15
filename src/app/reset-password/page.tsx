import { ResetPasswordFrom } from "@/components/auth/ResetPasswordFrom";
import { Suspense } from 'react';

export default function page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center">
                <div className="text-white">Cargando...</div>
            </div>
        }>
            <ResetPasswordFrom />
        </Suspense>
    )
}