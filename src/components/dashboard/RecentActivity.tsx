export function RecentActivity() {
  return (
    <div className="bg-[#0f1e33] rounded-2xl p-6 shadow-sm border border-gray-800">
      <h2 className="text-xl font-semibold mb-6 text-white">Actividad Reciente</h2>
      
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400 text-center">No hay transacciones aún</p>
      </div>
    </div>
  );
}