import { useQueries, useQuery } from "@tanstack/react-query";
import { getMarket, getMarketStores } from "@/lib/api/market";
import { getStoreProducts } from "@/lib/api/product";
import { generateStoreCoordinate } from "./generateStoreCoordinates";
import type { MapMarket } from "./types";

/**
 * Resolves everything KakaoMap needs to render a single market: its own
 * coordinate plus one dummy-scattered coordinate per store, each store's
 * discount count and top on-sale product (both derived from its product
 * list rather than a separate GET /stores/{id} call, since we're already
 * fetching products here for the "대표 할인 상품" bottom sheet field).
 *
 * MVP only ever calls this with one real market id. Extending to several
 * markets means calling this hook once per id (or generalizing it to take
 * `marketIds: number[]` and looping the same fetch/derive steps) and
 * concatenating the resulting MapMarket arrays - KakaoMap itself already
 * takes an array and doesn't know or care how many markets are "real".
 */
export function useMarketMapData(marketId: number | null): {
  market: MapMarket | null;
  isLoading: boolean;
  isError: boolean;
} {
  const enabled = marketId != null;

  const marketQuery = useQuery({
    queryKey: ["market", marketId],
    queryFn: () => getMarket(marketId as number),
    enabled,
  });
  const storesQuery = useQuery({
    queryKey: ["market-stores", marketId],
    queryFn: () => getMarketStores(marketId as number),
    enabled,
  });

  const stores = storesQuery.data ?? [];
  const productsQueries = useQueries({
    queries: stores.map((store) => ({
      queryKey: ["store-products", store.id],
      queryFn: () => getStoreProducts(store.id),
      enabled: storesQuery.isSuccess,
    })),
  });

  const isLoading =
    marketQuery.isLoading || storesQuery.isLoading || productsQueries.some((q) => q.isLoading);
  const isError = marketQuery.isError || storesQuery.isError;

  if (!marketQuery.data || isLoading || isError) {
    return { market: null, isLoading, isError };
  }

  const marketCenter = { lat: marketQuery.data.latitude, lng: marketQuery.data.longitude };

  const mapStores = stores.map((store, index) => {
    const products = productsQueries[index]?.data ?? [];
    const onSaleProducts = products.filter((p) => p.status === "판매중");
    const topProduct = [...onSaleProducts].sort(
      (a, b) => b.discount_percent - a.discount_percent,
    )[0];

    return {
      id: store.id,
      name: store.name,
      category: store.category,
      discountCount: onSaleProducts.length,
      topProduct: topProduct
        ? { title: topProduct.title, discountPercent: topProduct.discount_percent }
        : null,
      coordinate: generateStoreCoordinate(marketCenter, store.id),
    };
  });

  const market: MapMarket = {
    id: marketQuery.data.id,
    name: marketQuery.data.name,
    discountCount: marketQuery.data.discount_count,
    storeCount: marketQuery.data.store_count,
    coordinate: marketCenter,
    stores: mapStores,
  };

  return { market, isLoading: false, isError: false };
}
