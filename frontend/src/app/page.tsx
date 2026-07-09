"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { EsgWidget } from "@/components/molecules/EsgWidget";
import { QuickMenu } from "@/components/molecules/QuickMenu";
import { MarketCard } from "@/components/organisms/MarketCard";
import { getMarkets } from "@/lib/api/market";

export default function Home() {
  const {
    data: markets,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["markets"], queryFn: getMarkets });

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <header className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">📍 인천 남동구</p>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <Search size={16} />
          <span>시장을 검색하세요</span>
        </div>
      </header>

      <EsgWidget />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">오늘의 할인</h2>
        {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
        {isError && (
          <p className="text-sm text-destructive">할인 정보를 불러오지 못했습니다.</p>
        )}
        {markets && markets.length === 0 && (
          <p className="text-sm text-muted-foreground">등록된 시장이 없습니다.</p>
        )}
        {markets && markets.length > 0 && (
          <div className="flex gap-3 overflow-x-auto">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Quick Menu</h2>
        <QuickMenu />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">추천시장</h2>
        {markets && markets.length > 0 && (
          <div className="flex flex-col gap-3">
            {markets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
