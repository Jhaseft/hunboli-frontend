'use client';
import { ArrowUpCircle, ArrowDownCircle, Coins } from 'lucide-react';
import { useState } from 'react';

export function DashboardSidebar() {
  const [activeWallet, setActiveWallet] = useState('tether');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');

  const balances = [
    { currency: 'USDT', amount: '$0.00' },
    { currency: 'CNH₮', amount: '¥0.00' },
    { currency: 'MXN₮', amount: '$0.00' },
  ];

  return (
    <aside className="w-96 bg-white border-r border-gray-200 p-6">
      <div className="space-y-6">
        {/* Wallet Toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveWallet('tether')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeWallet === 'tether'
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span className="text-sm">tether</span>
          </button>
          <button
            onClick={() => setActiveWallet('gold')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeWallet === 'gold'
                ? 'bg-gray-300 text-white'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span className="text-sm">tether</span>
            <span className="text-xs ml-1">GOLD</span>
          </button>
        </div>

        {/* Balances */}
        <div className="space-y-0 pt-8">
          {balances.map((balance) => (
            <div
              key={balance.currency}
              onClick={() => setSelectedCurrency(balance.currency)}
              className={`relative flex items-center justify-between py-5 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCurrency === balance.currency ? 'bg-gray-50' : ''
              }`}
            >
              {/* Active indicator line */}
              {selectedCurrency === balance.currency && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
              )}
              
              <span className={`text-gray-900 ${
                selectedCurrency === balance.currency ? 'pl-6' : 'pl-4'
              }`}>
                {balance.currency}
              </span>
              <span className="text-gray-900 pr-4">{balance.amount}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-8">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-sm">Redeem</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm">Acquire</span>
          </button>
        </div>
      </div>
    </aside>
  );
}