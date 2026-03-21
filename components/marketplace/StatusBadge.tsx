const COLOR_MAP: Record<string, string> = {
  open:        "bg-green-50 text-green-700",
  in_progress: "bg-lk-primary-pale text-lk-primary",
  completed:   "bg-lk-neutral-mid text-lk-dark/60",
  pending:     "bg-lk-yellow-pale text-lk-dark",
  shortlisted: "bg-lk-primary-pale text-lk-primary",
  hired:       "bg-green-50 text-green-700",
  rejected:    "bg-lk-red-pale text-lk-red",
  active:      "bg-lk-primary-pale text-lk-primary",
  submitted:   "bg-lk-yellow-pale text-lk-dark",
  unverified:  "bg-lk-neutral-mid text-lk-dark/50",
  verified:    "bg-green-50 text-green-700",
  downpaid:    "bg-lk-yellow-pale text-lk-dark",
  fully_paid:  "bg-green-50 text-green-700",
  unpaid:      "bg-lk-red-pale text-lk-red",
};

const LABEL_MAP: Record<string, string> = {
  in_progress: "In Progress",
  fully_paid:  "Fully Paid",
  downpaid:    "Downpaid",
};

function toLabel(status: string): string {
  if (LABEL_MAP[status]) return LABEL_MAP[status];
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function StatusBadge({ status }: { status: string }) {
  const color = COLOR_MAP[status] ?? "bg-lk-neutral-mid text-lk-dark/60";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-inter font-semibold text-xs ${color}`}>
      {toLabel(status)}
    </span>
  );
}
