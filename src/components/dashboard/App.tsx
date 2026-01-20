"use client";

import { useState } from "react";
import { BalanceCard } from "./BalanceCard";
import { ActionButtons } from "./ActionButtons";
import { DepositForm } from "./DepositForm";
import { RecentActivity } from "./RecentActivity";
import RetiroForm from "./Retiro/RetiroForm";

export default function App() {
  const [activeTab, setActiveTab] = useState<"depositar" | "retirar">("depositar");
  const [mobileModalOpen, setMobileModalOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState<string>("0");

  const openMobileModal = (tab: "depositar" | "retirar") => {
    setActiveTab(tab);
    setMobileModalOpen(true);
  };

  const closeMobileModal = () => setMobileModalOpen(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* pb-24 para que la barra fija de abajo no tape el contenido en móvil */}
      <div className="mx-auto w-full max-w-md lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <BalanceCard onBalanceChange={setWalletBalance} />

            {/* En móvil: historial debajo del balance */}
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
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>

   
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur border-t border-gray-800">
        <div className="mx-auto w-full max-w-md px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => openMobileModal("depositar")}
              className="w-full rounded-xl py-3 text-sm font-semibold transition bg-teal-600 text-white hover:bg-teal-500"
            >
              Depositar
            </button>

            <button
              onClick={() => openMobileModal("retirar")}
              className="w-full rounded-xl py-3 text-sm font-semibold transition bg-gray-800/60 text-gray-200 border border-gray-700 hover:bg-gray-800"
            >
              Retirar
            </button>
          </div>
        </div>
      </div>

      {mobileModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={closeMobileModal} />

          {/* sheet */}
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md rounded-t-2xl border border-gray-800 bg-[#0f1e33] p-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">
                {activeTab === "depositar" ? "Depositar Fondos" : "Retirar"}
              </h2>

              <button
                onClick={closeMobileModal}
                className="text-gray-300 hover:text-white px-2 py-1 rounded-md"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            {activeTab === "depositar" ? (
              <DepositForm />
            ) : (
              <RetiroForm
              amount_wallet={walletBalance}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
