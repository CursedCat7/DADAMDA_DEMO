"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { KakaoMap } from "@/components/map/KakaoMap";
import { SearchBar } from "@/components/molecules/SearchBar";
import { SegmentedControl } from "@/components/molecules/SegmentedControl";
import { MarketCard } from "@/components/organisms/MarketCard";
import { getMarkets } from "@/lib/api/market";
import { useMarketMapData } from "@/lib/map/useMarketMapData";

type ViewMode = "list" | "map";

export default function MarketListPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [selectedMarketId, setSelectedMarketId] = useState<number | null>(null);

  const {
    data: markets,
    isLoading,
    isError,
  } = useQuery({ queryKey: ["markets"], queryFn: getMarkets });

  // MVP scope: 모래내시장 하나만 실제 데이터로 지도에 표시. 여러 시장이
  // 생기면 markets 전체를 순회하며 useMarketMapData(market.id)를 모아
  // KakaoMap에 배열로 넘기면 된다 (KakaoMap은 이미 배열을 받는 구조).
  const primaryMarketId = markets?.[0]?.id ?? null;
  const mapData = useMarketMapData(primaryMarketId);

  function handleViewOnMap(marketId: number) {
    setSelectedMarketId(marketId);
    setView("map");
  }

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
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: "list", label: "리스트 보기" },
            { value: "map", label: "지도 보기" },
          ]}
        />
      </header>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
            {isError && (
              <p className="text-sm text-destructive">시장 목록을 불러오지 못했습니다.</p>
            )}
            {markets && markets.length === 0 && (
              <p className="text-sm text-muted-foreground">등록된 시장이 없습니다.</p>
            )}
            {markets?.map((market) => (
              <MarketCard key={market.id} market={market} onViewOnMap={handleViewOnMap} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
          >
            {mapData.isLoading && (
              <p className="text-sm text-muted-foreground">지도 데이터를 준비하는 중...</p>
            )}
            {mapData.isError && (
              <p className="text-sm text-destructive">지도 정보를 불러오지 못했습니다.</p>
            )}
            {mapData.market && (
              <KakaoMap
                markets={[mapData.market]}
                selectedMarketId={selectedMarketId}
                className="h-[70vh] min-h-[420px] w-full"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
