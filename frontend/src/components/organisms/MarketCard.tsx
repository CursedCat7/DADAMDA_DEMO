import { Store } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MarketListItem } from "@/lib/api/market";

export function MarketCard({
  market,
  className = "",
}: {
  market: MarketListItem;
  className?: string;
}) {
  return (
    <Link href={`/markets/${market.id}`} className={className}>
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-base font-bold text-foreground">{market.name}</span>
            <span className="text-xs text-muted-foreground">{market.address}</span>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Store size={17} />
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="primary">{market.discount_count}개 할인</Badge>
          {market.avg_discount_percent > 0 && (
            <Badge variant="accent">평균 {market.avg_discount_percent}%</Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
