import { getCategoryColor } from "@/lib/map/categoryColors";

export function MapLegend({ categories }: { categories: string[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5 rounded-2xl bg-card/95 p-2 shadow-[0_4px_14px_-6px_rgba(43,38,32,0.25)] backdrop-blur">
      {categories.map((category) => (
        <span
          key={category}
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-foreground"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: getCategoryColor(category) }}
          />
          {category}
        </span>
      ))}
    </div>
  );
}
