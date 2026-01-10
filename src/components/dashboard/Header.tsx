import { User, LogOut } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#0f1e33] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-teal-400">HUNBOLI</h1>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4" />
              <span className="text-sm">Juanito</span>
            </div>
            
            <div className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 text-sm rounded font-medium">
              KYC Pendiente
            </div>
            
            <button className="flex items-center gap-2 text-gray-300 hover:text-white">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}