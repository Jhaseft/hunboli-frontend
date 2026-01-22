interface InfoAdicionalProps {
  gasFee: number;
  comision: number;
  totalDeduction: number;
  newBalance: number;
}

export default function Infoadicional({
  gasFee,
  comision,
  totalDeduction,
  newBalance,
}: InfoAdicionalProps) {
    return(
        <>
        <div className="bg-[#0a1628] border border-gray-700 p-3 rounded-lg flex justify-between text-sm text-gray-400">
            <span>Costo del gas:</span>
            <span>{(gasFee).toFixed(3)} BOBH</span>
        </div>

        <div className="bg-[#0a1628] border border-gray-700 p-3 rounded-lg flex justify-between text-sm text-gray-400">
            <span>Comision:</span>
            <span>{(comision).toFixed(2)} BOBH</span>
        </div>

        <div className="bg-[#0a1628] border border-gray-700 p-3 rounded-lg flex justify-between text-sm text-gray-400">
            <span>Total a Pagar:</span>
            <span>{(totalDeduction).toFixed(3)} BOBH</span>
        </div>
       
        <div className="bg-yellow-900/30 border border-yellow-600/50 p-3 rounded-lg text-yellow-400 text-sm">
            Se descontará {totalDeduction.toFixed(3)} BOBH. Saldo nuevo: {newBalance.toFixed(3)} BOBH
        </div>
        
        </>
    );
}