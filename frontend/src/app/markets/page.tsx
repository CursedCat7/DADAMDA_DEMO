"use client";

import { useQuery } from "@tanstack/react-query";
import { MarketCard } from "@/components/organisms/MarketCard";
import { getMarkets } from "@/lib/api/market";

export default function MarketListPage() {
  const {
    data: markets,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["markets"], queryFn: getMarkets });

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">시장 목록</h1>
        <p className="text-sm text-muted-foreground">📍 인천 남동구 근처 시장</p>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {isError && (
        <p className="text-sm text-destructive">시장 목록을 불러오지 못했습니다.</p>
      )}
      {markets && markets.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 시장이 없습니다.</p>
      )}
      {markets && markets.length > 0 && (
        <div className="flex flex-col gap-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
}
