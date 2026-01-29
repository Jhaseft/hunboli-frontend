import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Bank = {
  id: number;
  name: string;
  country: 'Bolivia' | 'PERU';
  logo_url: string;
};

type BankAccount = {
  id: string;
  userId: string;
  bankId: number;
  accountNumber: string;
  bank: Bank;
};

type Props = {
  banks: BankAccount[];
  currency: 'BOB' | 'PEN';
  value: string | null;
  onChange: (id: string) => void;
};

export default function BankAccountSelect({
  banks,
  currency,
  value,
  onChange
}: Props) {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedBank = banks.find(b => b.id === value) || null;
   
  // cerrar al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 bg-[#0f1e33] border border-gray-600 rounded px-3 py-2"
      >
        {selectedBank ? (
          <div className="flex items-center gap-3">
            <img 
            src={selectedBank.bank.logo_url}
              className="w-7 h-7 rounded object-contain"
              alt={selectedBank.bank.name}
            />
            <div className="text-left">
              <p className="text-sm text-white font-medium">
                {selectedBank.bank.name}
              </p>
              <p className="text-xs text-gray-400">
                {selectedBank.bank.country}
              </p>
              <p className="text-xs text-teal-400">
                Cuenta: ****{selectedBank.accountNumber.slice(-4)}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Selecciona una cuenta</span>
        )}

        <ChevronDown size={18} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0a1628] border border-gray-700 rounded-lg max-h-72 overflow-y-auto">
          {banks.map(account => (
            <button
              key={account.id}
              onClick={() => {
                onChange(account.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#13294b] text-left"
            >
              <img
                src={account.bank.logo_url}
                className="w-8 h-8 rounded object-contain"
                alt={account.bank.name}
              />
              <div>
                <p className="text-sm text-white">
                  {account.bank.name}
                </p>
                <p className="text-xs text-gray-400">
                  {account.bank.country}
                </p>
                <p className="text-xs text-teal-400">
                  Cuenta: ****{account.accountNumber.slice(-4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
