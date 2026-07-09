import { Store } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { StoreListItem } from "@/lib/api/store";

export function StoreCard({
  store,
  className = "",
}: {
  store: StoreListItem;
  className?: string;
}) {
  return (
    <Link href={`/stores/${store.id}`} className={className}>
      <Card className="flex gap-3 p-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
          {store.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={store.thumbnail} alt={store.name} className="size-full object-cover" />
          ) : (
            <Store size={18} className="text-primary" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">{store.name}</span>
            <Badge variant="secondary">{store.category}</Badge>
          </div>
          {store.description && (
            <span className="text-sm text-muted-foreground">{store.description}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
