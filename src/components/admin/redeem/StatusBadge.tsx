type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-600",
    PROCESSED: "bg-green-600",
    REJECTED: "bg-red-600",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[status] || "bg-gray-600"}`}>
      {status}
    </span>
  );
}