import { DashboardNavbar } from './DashboardNavbar';
import { DashboardSidebar } from './DashboardSidebar';
import { TransactionActivity } from './TransactionActivity';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar onLogout={onLogout} />
      
      <div className="flex">
        <DashboardSidebar />
        
        <main className="flex-1 p-16">
          <TransactionActivity />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-12 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-teal-600">StableCoin</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Knowledge Base</a>
              <a href="#" className="hover:text-gray-900">Transparency</a>
              <a href="#" className="hover:text-gray-900">Legal</a>
              <a href="#" className="hover:text-gray-900">Fees</a>
              <a href="#" className="hover:text-gray-900">Cookie settings</a>
              <span className="text-gray-400">© 2013 - 2026 Tether Operations Limited. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Coins } from 'lucide-react';