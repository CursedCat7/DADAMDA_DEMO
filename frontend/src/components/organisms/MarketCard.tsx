import { Map, Store } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { MarketListItem } from "@/lib/api/market";

export function MarketCard({
  market,
  className = "",
  onViewOnMap,
}: {
  market: MarketListItem;
  className?: string;
  onViewOnMap?: (marketId: number) => void;
}) {
  return (
    <Link href={`/markets/${market.id}`} className={className}>
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
              {market.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={market.thumbnail}
                  alt={market.name}
                  className="size-full object-cover"
                />
              ) : (
                <Store size={22} className="text-primary" />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-base font-bold text-foreground">{market.name}</span>
              <span className="truncate text-xs text-muted-foreground">{market.address}</span>
            </div>
          </div>
          {onViewOnMap && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onViewOnMap(market.id);
              }}
              className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-xs font-medium text-primary"
            >
              <Map size={13} />
              지도에서 보기
            </button>
          )}
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
