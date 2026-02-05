"use client";

import { useState } from "react";
import { BalanceCard } from "./BalanceCard";
import { ActionButtons } from "./ActionButtons";
import { DepositForm } from "./DepositForm";
import { RecentActivity } from "./RecentActivity";
import { Banknote, CircleDollarSign, Repeat } from 'lucide-react';
import RetiroForm from "./Retiro/RetiroForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import ReportModal from "../dashboard/ReportModal";

export default function App() {
   const [reportModal, setReportModal] = useState({
      isOpen: false,
      success: true,
      message: ''
    });
  const [activeTab, setActiveTab] = useState<"depositar" | "retirar" | "transferir">("depositar");
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const { user } = useAuth();
  const router = useRouter();

  const openMobileModal = (tab: "depositar" | "retirar" | "transferir") => {
    if (!user) return;

    // Verificar cuenta
    if (!user.isVerified) {
      setReportModal({
        isOpen: true,
        success: false,
        message: "Por favor, verifica tu cuenta para acceder a esta función."
      });
      setTimeout(() => {
        router.push('/dashboard/verify-account');
      }, 2000);
      return;
    }

    // Verificar KYC
    if (user.kycStatus !== "VERIFIED") {
      setReportModal({
        isOpen: true,
        success: false,
        message: "Por favor, completa el proceso de KYC para acceder a esta función."
      });
      setTimeout(() => {
        router.push('/dashboard/kyc');
      }, 2000);
      return;
    }

    // Verificar onboarding
    if (!user.isOnboardingCompleted) {
      setReportModal({
        isOpen: true,
        success: false,
        message: "Por favor, completa el proceso de onboarding para acceder a esta función."
      });
      setTimeout(() => {
        router.push('/onboarding');
      }, 2000);
      return;
    }

    // Si todas las validaciones pasaron, abrir modal
    setActiveTab(tab);
    setMobileModalOpen(true);
  };

  const closeMobileModal = () => setMobileModalOpen(false);

  return (
    <>
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">

      <div className="mx-auto w-full max-w-md lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <BalanceCard onBalanceChange={setWalletBalance} />


            <div className="lg:hidden">
              <RecentActivity />
            </div>

            <div className="hidden lg:block">
              <ActionButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="hidden lg:block">
              {activeTab === "depositar" && <DepositForm />}

              {activeTab === "retirar" && (
                <RetiroForm
                  amount_wallet={walletBalance}
                />
              )}

              {activeTab === "transferir" && (
                <RetiroForm
                  amount_wallet={walletBalance}
                />
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>


      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-sm border-t border-gray-800">
        <div className="mx-auto w-full max-w-md px-4 py-2">
          <div className="relative flex items-center justify-center gap-32 px-4">
            <button
              onClick={() => openMobileModal("retirar")}
              className="flex flex-col items-center gap-2 rounded-xl py-3 px-7 text-sm font-medium transition-all text-gray-400 hover:bg-gray-800/50 hover:text-orange-300 active:scale-95"
            >
              <Banknote className="w-10 h-10 text-teal-600" />
              <span className="text-sm">Retirar</span>
            </button>

            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <button
                onClick={() => openMobileModal("transferir")}
                className="rounded-full p-5 transition-all bg-teal-600 text-white hover:bg-teal-500 active:scale-95 shadow-xl border-4 border-gray-950"
              >
                <Repeat className="w-7 h-7" />
              </button>
              <span className="text-sm font-medium text-gray-400">Transferir</span>
            </div>

            <button
              onClick={() => openMobileModal("depositar")}
              className="flex flex-col items-center gap-2 rounded-xl py-3 px-7 text-sm font-medium transition-all text-gray-400 hover:bg-gray-800/50 hover:text-cyan-300 active:scale-95"
            >
              <CircleDollarSign className="w-10 h-10 text-teal-600" />
              <span className="text-sm">Depositar</span>
            </button>
          </div>
        </div>
      </div>



      {mobileModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50">

          <div className="absolute inset-0 bg-black/50" onClick={closeMobileModal} />


          <div className="absolute  bottom-0 left-0 right-0 mx-auto w-full max-w-md rounded-t-2xl border border-gray-800 bg-[#0f1e33] p-4 pb-6">
            <div className="flex  items-center justify-between ">
              <h2 className="text-white  font-semibold">
              </h2>
              <button
                onClick={closeMobileModal}
                className="text-gray-300 hover:text-white px-2 py-1 rounded-md"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {activeTab === "depositar" && <DepositForm />}

            {activeTab === "retirar" && (
              <RetiroForm
                amount_wallet={walletBalance}
              />
            )}

            {activeTab === "transferir" && (
              <RetiroForm
                amount_wallet={walletBalance}
              />
            )}
          </div>
        </div>
      )}
    </div>

    <ReportModal
            isOpen={reportModal.isOpen}
            onClose={() => setReportModal({ ...reportModal, isOpen: false })}
            success={reportModal.success}
            message={reportModal.message}
          />
          </>
  );
}
