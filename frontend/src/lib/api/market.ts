import { apiFetch } from "./client";

export type MarketListItem = {
  id: number;
  name: string;
  address: string;
  thumbnail: string | null;
  discount_count: number;
  avg_discount_percent: number;
};

export function getMarkets(): Promise<MarketListItem[]> {
  return apiFetch<MarketListItem[]>("/markets");
}
