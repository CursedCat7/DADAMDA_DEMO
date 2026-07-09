"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/molecules/SearchBar";
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
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold text-foreground">시장 둘러보기</h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} className="text-primary" />
            인천 남동구 근처 시장
          </p>
        </div>
        <SearchBar />
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
