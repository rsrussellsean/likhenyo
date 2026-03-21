interface BudgetDisplayProps {
  min: number;
  max: number;
  type: "fixed" | "hourly";
}

export default function BudgetDisplay({ min, max, type }: BudgetDisplayProps) {
  const fmt = (n: number) => `₱${n.toLocaleString("en-PH")}`;
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="font-headline font-semibold text-lk-dark text-sm">
        {fmt(min)} – {fmt(max)}
      </span>
      <span className="font-inter text-xs text-lk-dark/40">
        {type === "hourly" ? "/hr" : "fixed"}
      </span>
    </span>
  );
}
