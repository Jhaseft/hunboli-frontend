  import { useState, useRef, useEffect } from "react";
  import { ChevronDown } from "lucide-react";

  type Bank = {
    id: number;
    name: string;
    country: 'Bolivia' | 'PERU';
    logo_url: string;
  };

  interface BankSelectProps {
    banks: Bank[];
    value: number | null;
    onChange: (bankId: number) => void;
  }

  export default function BankSelect({
    banks,
    value,
    onChange
  }: BankSelectProps) {


    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);


    const selectedBank = banks.find(b => b.id === value);

    // cerrar al hacer click fuera
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={ref} className="relative w-full">
  
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between gap-2 bg-[#0f1e33] text-white border border-gray-600 rounded px-3 py-2"
        >
          {selectedBank ? (
            <div className="flex items-center gap-2">
              <img
                src={selectedBank.logo_url}
                alt={selectedBank.name}
                className="w-6 h-6 rounded object-contain"
              />
              <div className="text-left">
                <p className="text-sm font-medium">{selectedBank.name}</p>
                <p className="text-xs text-gray-400">{selectedBank.country}</p>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Selecciona un banco</span>
          )}

          <ChevronDown size={18} />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full bg-[#0a1628] border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
            {banks.map(bank => (
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
                  alt={bank.name}
                  className="w-7 h-7 rounded object-contain"
                />
                <div>
                  <p className="text-sm text-white">{bank.name}</p>
                  <p className="text-xs text-gray-400">{bank.country}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
