import { apiFetch } from "./client";
import type { StoreListItem } from "./store";

export type MarketListItem = {
  id: number;
  name: string;
  address: string;
  thumbnail: string | null;
  discount_count: number;
  avg_discount_percent: number;
};

export type MarketDetail = MarketListItem & {
  latitude: number;
  longitude: number;
  description: string | null;
  phone: string | null;
  open_time: string | null;
  close_time: string | null;
  store_count: number;
};

export function getMarkets(): Promise<MarketListItem[]> {
  return apiFetch<MarketListItem[]>("/markets");
}

export function getMarket(marketId: number): Promise<MarketDetail> {
  return apiFetch<MarketDetail>(`/markets/${marketId}`);
}

export function getMarketStores(marketId: number): Promise<StoreListItem[]> {
  return apiFetch<StoreListItem[]>(`/markets/${marketId}/stores`);
}
