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
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">{store.name}</span>
          <Badge variant="secondary">{store.category}</Badge>
        </div>
        {store.description && (
          <span className="text-sm text-muted-foreground">{store.description}</span>
        )}
      </Card>
    </Link>
  );
}
