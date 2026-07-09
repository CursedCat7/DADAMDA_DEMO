export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-transparent bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_rgba(107,191,89,0.5)]"
        : "border-border/70 bg-card text-foreground"
    }`;

  return (
    <div className="flex gap-2 overflow-x-auto">
      <button type="button" onClick={() => onSelect(null)} className={chipClass(selected === null)}>
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={chipClass(selected === category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
