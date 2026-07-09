import { Search } from "lucide-react";

export function SearchBar({ placeholder = "시장을 검색하세요" }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground shadow-[0_2px_10px_-6px_rgba(43,38,32,0.15)]">
      <Search size={17} className="shrink-0" />
      <span>{placeholder}</span>
    </div>
  );
}
