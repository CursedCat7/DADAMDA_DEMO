"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { EsgWidget } from "@/components/molecules/EsgWidget";
import { QuickMenu } from "@/components/molecules/QuickMenu";
import { SearchBar } from "@/components/molecules/SearchBar";
import { HeroBanner } from "@/components/organisms/HeroBanner";
import { MarketCard } from "@/components/organisms/MarketCard";
import { ProductCard } from "@/components/organisms/ProductCard";
import { getMarkets } from "@/lib/api/market";
import { getProducts } from "@/lib/api/product";

export default function Home() {
  const marketsQuery = useQuery({ queryKey: ["markets"], queryFn: getMarkets });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: getProducts });

  const markets = marketsQuery.data ?? [];
  const heroMarket = [...markets].sort((a, b) => b.discount_count - a.discount_count)[0];

  const popularProducts = [...(productsQuery.data ?? [])]
    .filter((product) => product.status === "판매중")
    .sort((a, b) => b.discount_percent - a.discount_percent)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 px-4 py-4">
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          인천 남동구
        </p>
        <SearchBar />
      </header>

      {marketsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      )}
      {heroMarket && <HeroBanner market={heroMarket} />}

      <EsgWidget />

      {popularProducts.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-foreground">인기 할인 상품</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {popularProducts.map((product) => (
              <div key={product.id} className="w-64 shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-foreground">Quick Menu</h2>
        <QuickMenu />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-foreground">근처 시장 추천</h2>
        {marketsQuery.isError && (
          <p className="text-sm text-destructive">할인 정보를 불러오지 못했습니다.</p>
        )}
        {markets.length === 0 && !marketsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">등록된 시장이 없습니다.</p>
        )}
        {markets.length > 0 && (
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
