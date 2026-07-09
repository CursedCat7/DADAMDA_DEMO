"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapBottomSheet } from "@/components/map/MapBottomSheet";
import { MapControls } from "@/components/map/MapControls";
import { MapLegend } from "@/components/map/MapLegend";
import { createMarketMarkerElement, setMarketMarkerSelected } from "@/components/map/MarketMarker";
import { createStoreMarkerElement, setStoreMarkerSelected } from "@/components/map/StoreMarker";
import { type KakaoCustomOverlay, type KakaoMap as KakaoMapInstance, loadKakaoMaps } from "@/lib/kakao/loadKakaoMaps";
import type { MapMarket, MapSelection } from "@/lib/map/types";

// Demo-only stand-in for real geolocation (§ brief: "GPS Permission이
// 없어도 동작"): 인천 남동구청 인근 좌표.
const DEMO_CURRENT_LOCATION = { lat: 37.4468, lng: 126.731 };

const MISSING_KEY_MESSAGE =
  "서비스 준비 중 입니다.";

type MarkerEntry = {
  overlay: KakaoCustomOverlay;
  element: HTMLElement;
  setSelected: (el: HTMLElement, selected: boolean) => void;
};

export function KakaoMap({
  markets,
  selectedMarketId = null,
  className = "",
}: {
  markets: MapMarket[];
  selectedMarketId?: number | null;
  className?: string;
}) {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const selectedKeyRef = useRef<string | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    appKey ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    appKey ? null : MISSING_KEY_MESSAGE,
  );
  const [selection, setSelection] = useState<MapSelection | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(markets.flatMap((m) => m.stores.map((s) => s.category)))),
    [markets],
  );

  const selectMarker = useCallback((key: string, next: MapSelection) => {
    const previousKey = selectedKeyRef.current;
    if (previousKey && previousKey !== key) {
      const prev = markersRef.current.get(previousKey);
      if (prev) prev.setSelected(prev.element, false);
    }
    const current = markersRef.current.get(key);
    if (current) current.setSelected(current.element, true);
    selectedKeyRef.current = key;
    setSelection(next);
  }, []);

  useEffect(() => {
    if (!appKey || !containerRef.current || markets.length === 0) return;

    let cancelled = false;
    const markers = markersRef.current;

    loadKakaoMaps(appKey)
      .then((kakao) => {
        if (cancelled || !containerRef.current) return;

        const center = markets[0].coordinate;
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 4,
        });
        mapRef.current = map;

        for (const market of markets) {
          const marketKey = `market-${market.id}`;
          const el = createMarketMarkerElement(market);
          el.addEventListener("click", () =>
            selectMarker(marketKey, { type: "market", market }),
          );
          const overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(market.coordinate.lat, market.coordinate.lng),
            content: el,
            yAnchor: 0.5,
          });
          overlay.setMap(map);
          markers.set(marketKey, { overlay, element: el, setSelected: setMarketMarkerSelected });

          for (const store of market.stores) {
            const storeKey = `store-${store.id}`;
            const storeEl = createStoreMarkerElement(store);
            storeEl.addEventListener("click", () =>
              selectMarker(storeKey, { type: "store", store }),
            );
            const storeOverlay = new kakao.maps.CustomOverlay({
              position: new kakao.maps.LatLng(store.coordinate.lat, store.coordinate.lng),
              content: storeEl,
              yAnchor: 0.5,
            });
            storeOverlay.setMap(map);
            markers.set(storeKey, {
              overlay: storeOverlay,
              element: storeEl,
              setSelected: setStoreMarkerSelected,
            });
          }
        }

        if (selectedMarketId != null) {
          const market = markets.find((m) => m.id === selectedMarketId);
          if (market) {
            selectMarker(`market-${market.id}`, { type: "market", market });
          }
        }

        setStatus("ready");
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(err.message);
      });

    return () => {
      cancelled = true;
      for (const { overlay } of markers.values()) {
        overlay.setMap(null);
      }
      markers.clear();
      selectedKeyRef.current = null;
    };
  }, [appKey, markets, selectedMarketId, selectMarker]);

  function handleLocate() {
    if (!mapRef.current) return;
    const kakao = window.kakao;
    mapRef.current.panTo(
      new kakao.maps.LatLng(DEMO_CURRENT_LOCATION.lat, DEMO_CURRENT_LOCATION.lng),
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-secondary/40 ${className}`}>
      <div ref={containerRef} className="h-full w-full" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          지도를 불러오는 중...
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
          {errorMessage}
        </div>
      )}
      {status === "ready" && (
        <>
          <MapLegend categories={categories} />
          <MapControls onLocate={handleLocate} />
        </>
      )}

      <MapBottomSheet selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}
