'use client';
import { Coins, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';

interface DashboardNavbarProps {
  onLogout: () => void;
}

export function DashboardNavbar({ onLogout }: DashboardNavbarProps) {
  const [activeTab, setActiveTab] = useState('transactions');

  const tabs = [
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'transactions', label: 'Transactions', icon: null },
    { id: 'deposit', label: 'Deposit', icon: null },
    { id: 'user', label: 'Noguis', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-12 py-6">
        <div className="flex items-center justify-between mb-8">
   
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-teal-600">StableCoin</span>
          </div>

         
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome back, Noguis</span>
            <button className="px-6 py-2 text-teal-500 hover:text-teal-600 transition-colors">
              OK
            </button>
          </div>
        </div>

        
        <div className="flex items-center gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}