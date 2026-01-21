export default function Tasa({exchangeRates}){
    return(
        <div className="space-y-2">

            <p className="text-sm font-medium text-gray-300">
              Tasas de conversión
            </p>

            <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 
                  border border-teal-700/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center gap-1 bg-black/20 rounded-md p-2">
                  <span className="font-semibold text-white">1BOBH</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-teal-400">
                    {exchangeRates.BOB}BOB
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-black/20 rounded-md p-2">
                  <span className="font-semibold text-white">1BOBH</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-teal-400">
                    {exchangeRates.PEN}PEN
                  </span>
                </div>

              </div>
            </div>
          </div>
    );
}