type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          className: "border border-amber-500/30 bg-amber-500/10 text-amber-200",
          label: "Pendiente"
        };
      case "PROCESSED":
        return {
          className: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
          label: "Procesado"
        };
      case "REJECTED":
        return {
          className: "border border-red-500/30 bg-red-500/10 text-red-200",
          label: "Rechazado"
        };
      default:
        return {
          className: "border border-gray-500/30 bg-gray-500/10 text-gray-200",
          label: status
        };
    }
  };

  const { className, label } = getStatusStyle(status);

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}