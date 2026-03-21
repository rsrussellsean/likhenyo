interface SkillChipProps {
  label: string;
  variant?: "skill" | "tag" | "category";
  onClick?: () => void;
}

const VARIANT_STYLES: Record<string, string> = {
  skill:    "bg-lk-primary-pale text-lk-primary",
  tag:      "bg-lk-neutral-mid text-lk-dark/60",
  category: "bg-lk-yellow-pale text-lk-dark",
};

export default function SkillChip({ label, variant = "skill", onClick }: SkillChipProps) {
  const cls = `inline-flex items-center rounded-full px-2.5 py-1 font-inter text-xs font-medium
               ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.skill}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cls} transition-opacity hover:opacity-70 cursor-pointer`}
      >
        {label}
      </button>
    );
  }

  return <span className={cls}>{label}</span>;
}
