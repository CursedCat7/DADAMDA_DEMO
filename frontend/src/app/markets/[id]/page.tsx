"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, ImageIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CategoryChips } from "@/components/molecules/CategoryChips";
import { StoreCard } from "@/components/organisms/StoreCard";
import { getMarket, getMarketStores } from "@/lib/api/market";

function formatTime(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 5);
}

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const marketId = Number(params.id);
  const [category, setCategory] = useState<string | null>(null);

  const marketQuery = useQuery({
    queryKey: ["market", marketId],
    queryFn: () => getMarket(marketId),
  });
  const storesQuery = useQuery({
    queryKey: ["market-stores", marketId],
    queryFn: () => getMarketStores(marketId),
  });

  const categories = useMemo(
    () => Array.from(new Set((storesQuery.data ?? []).map((store) => store.category))),
    [storesQuery.data],
  );
  const filteredStores = useMemo(
    () =>
      category
        ? (storesQuery.data ?? []).filter((store) => store.category === category)
        : (storesQuery.data ?? []),
    [storesQuery.data, category],
  );

  if (marketQuery.isLoading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">불러오는 중...</p>;
  }
  if (marketQuery.isError || !marketQuery.data) {
    return (
      <p className="px-4 py-4 text-sm text-destructive">시장 정보를 불러오지 못했습니다.</p>
    );
  }

  const market = marketQuery.data;
  const openTime = formatTime(market.open_time);
  const closeTime = formatTime(market.close_time);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-40 items-center justify-center overflow-hidden bg-secondary text-secondary-foreground/60">
        {market.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={market.thumbnail}
            alt={market.name}
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon size={32} />
        )}
      </div>

      <div className="flex flex-col gap-2 px-4">
        <h1 className="text-xl font-extrabold text-foreground">{market.name}</h1>
        <p className="text-sm text-muted-foreground">{market.address}</p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {openTime && closeTime && (
            <Badge variant="neutral">
              <Clock size={12} />
              {openTime} - {closeTime}
            </Badge>
          )}
          <Badge variant="primary">오늘 할인 {market.discount_count}개</Badge>
          <Badge variant="neutral">상점 {market.store_count}개</Badge>
        </div>
      </div>

      <div className="px-4">
        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {storesQuery.isLoading && (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        )}
        {filteredStores.length === 0 && !storesQuery.isLoading && (
          <p className="text-sm text-muted-foreground">등록된 상점이 없습니다.</p>
        )}
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
