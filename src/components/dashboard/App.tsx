import { useState } from 'react';
import { Header } from './Header';
import { BalanceCard } from './BalanceCard';
import { ActionButtons } from './ActionButtons';
import { DepositForm } from './DepositForm';
import { RecentActivity } from './RecentActivity';

export default function App() {
  const [activeTab, setActiveTab] = useState<'depositar' | 'intercambiar' | 'retirar'>('depositar');

  return (
    <div className="min-h-screen bg-[#0a281e]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <BalanceCard />
            
            <ActionButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {activeTab === 'depositar' && <DepositForm />}
            {activeTab === 'intercambiar' && (
              <div className="bg-[#0f1e33] rounded-lg p-6 shadow-sm border border-gray-800">
                <h2 className="text-xl font-semibold mb-2 text-white">Intercambiar</h2>
                <p className="text-gray-400">Funcionalidad de intercambio próximamente</p>
              </div>
            )}
            {activeTab === 'retirar' && (
              <div className="bg-[#0f1e33] rounded-lg p-6 shadow-sm border border-gray-800">
                <h2 className="text-xl font-semibold mb-2 text-white">Retirar</h2>
                <p className="text-gray-400">Funcionalidad de retiro próximamente</p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}