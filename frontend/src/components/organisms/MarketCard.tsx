import Link from "next/link";
import type { MarketListItem } from "@/lib/api/market";

export function MarketCard({
  market,
  className = "",
}: {
  market: MarketListItem;
  className?: string;
}) {
  return (
    <Link
      href={`/markets/${market.id}`}
      className={`flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-sm ${className}`}
    >
      <span className="text-base font-semibold">{market.name}</span>
      <span className="text-sm text-muted-foreground">{market.address}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-primary">{market.discount_count}개 할인</span>
        {market.avg_discount_percent > 0 && (
          <span className="text-muted-foreground">
            평균 {market.avg_discount_percent}%
          </span>
        )}
      </div>
    </Link>
  );
}
