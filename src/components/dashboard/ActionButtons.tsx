import { ArrowDown, ArrowLeftRight, ArrowUp } from 'lucide-react';

interface ActionButtonsProps {
  activeTab: 'depositar' | 'retirar';
  setActiveTab: (tab: 'depositar' | 'retirar') => void;
}

export function ActionButtons({ activeTab, setActiveTab }: ActionButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => setActiveTab('depositar')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
          activeTab === 'depositar'
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-[#0f1e33] text-gray-300 border border-gray-700 hover:bg-[#152b47]'
        }`}
      >
        <ArrowDown className="w-4 h-4" />
        Depositar
      </button>
      
      <button
        onClick={() => setActiveTab('retirar')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
          activeTab === 'retirar'
            ? 'bg-teal-600 text-white shadow-md'
            : 'bg-[#0f1e33] text-gray-300 border border-gray-700 hover:bg-[#152b47]'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
        Retirar
      </button>
    </div>
  );
}