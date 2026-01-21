import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Bank = {
  id: number;
  name: string;
  country: 'Bolivia' | 'PERU';
  logo_url: string;
};

interface Props {
  banks: Bank[];
  currency: 'BOB' | 'PEN';
  value: number | null;
  onChange: (bankId: number) => void;
}

export default function BankAccountSelect({
  banks,
  currency,
  value,
  onChange
}: Props) {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filteredBanks = banks.filter(b =>
    currency === 'BOB'
      ? b.country === 'Bolivia'
      : b.country === 'PERU'
  );

  const selectedBank = filteredBanks.find(b => b.id === value);

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
              src={selectedBank.logo_url}
              className="w-7 h-7 rounded object-contain"
              alt={selectedBank.name}
            />
            <div className="text-left">
              <p className="text-sm text-white font-medium">
                {selectedBank.name}
              </p>
              <p className="text-xs text-gray-400">
                {selectedBank.country}
              </p>
        
              <p className="text-xs text-teal-400">
                Cuenta: ********
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
          {filteredBanks.map(bank => (
            <button
              key={bank.id}
              onClick={() => {
                onChange(bank.id);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#13294b] text-left"
            >
              <img
                src={bank.logo_url}
                className="w-8 h-8 rounded object-contain"
                alt={bank.name}
              />
              <div>
                <p className="text-sm text-white">
                  {bank.name}
                </p>
                <p className="text-xs text-gray-400">
                  {bank.country}
                </p>
                <p className="text-xs text-teal-400">
                  Cuenta: ********
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
