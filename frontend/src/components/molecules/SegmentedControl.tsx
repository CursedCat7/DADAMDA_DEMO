import { motion } from "framer-motion";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="relative flex rounded-full bg-secondary/50 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className="relative flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors"
        >
          {value === option.value && (
            <motion.span
              layoutId="segmented-control-pill"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className="absolute inset-0 rounded-full bg-primary shadow-[0_4px_12px_-4px_rgba(107,191,89,0.5)]"
            />
          )}
          <span
            className={`relative z-10 ${
              value === option.value ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
