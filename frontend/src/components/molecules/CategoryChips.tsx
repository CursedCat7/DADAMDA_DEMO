export function CategoryChips({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
          selected === null ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
        }`}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
            selected === category
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
