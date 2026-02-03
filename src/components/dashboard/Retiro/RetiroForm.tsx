import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ModalRetiro from './ModalRetiro';
import Moneda_Retiro from './Moneda_Retiro';
import Tasa from './Tasa';
import Flecha from './Flecha';
import RectanguloDerecha from './RectanguloDerecha';
/////////////contacto con el contrato/////////////
import { useAccount, useWalletClient } from 'wagmi';
import ABI from '@/abi/BobH.json';
import ReportModal from "../ReportModal";
/////////////////////////////////////////////////
type RetiroFormProps = {
  amount_wallet: string;
};

export default function RetiroForm({ amount_wallet }: RetiroFormProps) {
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    success: true,
    message: ''
  });
  const [selectedCurrency, setSelectedCurrency] = useState<'BOB' | 'PEN'>('BOB');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | ''>('');
  const MAX_AMOUNT = Number(amount_wallet) || 0;
  const MAX_DECIMALS = 2;

  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  const [comisionaMinima, setcomisionaMinima] = useState(0);
  const [porcentaje, setporcentaje] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [minAmount, setminAmount] = useState(1);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BOBH_ADDRESS as `0x${string}`;

 

  // Obtener tasas y mínimos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAmin = await api.get('/rate/comision');
        setcomisionaMinima(resAmin.data);

        const resMin = await api.get('/rate/minim_amount');
        setminAmount(resMin.data);

        const resCom = await api.get('/rate/porcentaje');
        setporcentaje(resCom.data);

        const endpoint = selectedCurrency === 'PEN' ? '/rate/bobtopen' : '/rate/bobtobobh';
        const resRate = await api.get(endpoint);
        setExchangeRate(resRate.data);
      } catch (err) {
        console.error('Error fetching rates:', err);
      }
    };
    fetchData();
  }, [selectedCurrency]);

  const validateAmount = (value: string): string => {
    if (!value) return '';
    const num = Number(value);
    if (isNaN(num)) return 'Ingresa un número válido';
    if (num < minAmount) return `El monto mínimo es ${minAmount} BOBH`;
    const decimals = value.split('.')[1];
    if (decimals && decimals.length > MAX_DECIMALS) return `Máximo ${MAX_DECIMALS} decimales permitidos`;
    return '';
  };

  const calculateReceived = (): string => {
    const amountNum = parseFloat(amount) || 0;
    return (amountNum * exchangeRate).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && !error) setIsModalOpen(true);
  };

  
  // Cálculo de comisión y deducción total
  const comisionCalculada = Math.max(parseFloat(amount) * porcentaje, comisionaMinima);
  // amountReceived viene como string, hay que convertirlo a número
  const totalDeduction = parseFloat(calculateReceived()) + comisionCalculada;

  const newBalance = parseFloat(amount_wallet) - totalDeduction;

  // Función corregida para enviar retiro y requestRedemption
  const handleConfirmRetiro = async () => {
    if (!selectedCurrency || !amount || !selectedBankId) {
      setReportModal({ isOpen: true, success: false, message: 'Completa todos los campos' });
      return;
    }

    try {
      
      //  Blockchain
      if (!isConnected || !walletClient) {
        setReportModal({ isOpen: true, success: false, message: 'Conecta tu wallet' });
        return;
      }

      // Convertir amount a BigInt según decimales del token
      const decimals = 6;
      const amountWei = BigInt(Math.floor(Number(totalDeduction) * 10 ** decimals));

      // Enviar transacción al contrato
      const txHash: `0x${string}` = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'requestRedemption',
      args: [amountWei],
    });

    //  Registrar en backend
      await api.post('/retiro', { currency: selectedCurrency, amount, bankAccountId: parseInt(selectedBankId),txHash });


      setReportModal({
        isOpen: true,
        success: true,
        message: `Redención enviada. Hash: ${txHash}`
      });

      setIsModalOpen(false);
      setAmount('');
    } catch (err) {
      console.error(err);
      setReportModal({
        isOpen: true,
        success: false,
        message: 'Error en retiro o redención'
      });
    }
  };


  return (
    <>
      <div className="bg-[#0f1e33] rounded-2xl p-6 border border-gray-800">
        <h2 className="text-2xl font-semibold text-white mb-2">Retirar Fondos</h2>
        <p className="text-gray-400 mb-6">Redime tus tokens BOBH por BOB o PEN</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Moneda_Retiro
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />

          <Tasa
            exchangeRate={exchangeRate}
            currency={selectedCurrency}
          />

          <div className="bg-[#0a1628] border border-gray-700 rounded-xl p-5">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">

              <div>
                <label className="text-sm text-gray-300">
                  Tienes {amount_wallet} BOBH
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val);
                    setError(validateAmount(val));
                  }}
                  step="any"
                  min={minAmount}
                  max={MAX_AMOUNT}
                  className={`w-full px-4 py-3 bg-[#152b47] border rounded-lg text-white
                    ${error ? 'border-red-500' : 'border-gray-600'}`}
                />

                {error && (
                  <p className="text-xs text-red-400 mt-1">{error}</p>
                )}
              </div>

              <Flecha />

              <RectanguloDerecha
                calculateReceived={calculateReceived}
                selectedCurrency={selectedCurrency}
                exchangeRate={exchangeRate}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!amount || !!error}
            className="w-full py-3 bg-teal-600 text-white rounded-lg
              hover:bg-teal-700 disabled:opacity-50"
          >
            Iniciar Retiro
          </button>
        </form>
      </div>

      <ModalRetiro
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={selectedCurrency}
        amountBOBH={amount}
        amountReceived={calculateReceived()}
        comisionCalculada={comisionCalculada}
        newBalance={newBalance}
        totalDeduction={totalDeduction}
        setSelectedBankId={setSelectedBankId}
        onConfirm={handleConfirmRetiro}
      />
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ ...reportModal, isOpen: false })}
        success={reportModal.success}
        message={reportModal.message}
      />
    </>
  );
}
