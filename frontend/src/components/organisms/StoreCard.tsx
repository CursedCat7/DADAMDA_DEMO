import Link from "next/link";
import type { StoreListItem } from "@/lib/api/store";

export function StoreCard({
  store,
  className = "",
}: {
  store: StoreListItem;
  className?: string;
}) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className={`flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold">{store.name}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {store.category}
        </span>
      </div>
      {store.description && (
        <span className="text-sm text-muted-foreground">{store.description}</span>
      )}
    </Link>
  );
}
