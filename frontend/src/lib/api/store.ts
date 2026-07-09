import { apiFetch } from "./client";

export type StoreListItem = {
  id: number;
  name: string;
  category: string;
  description: string | null;
  thumbnail: string | null;
  phone: string | null;
  owner_name: string | null;
};

export type StoreDetail = StoreListItem & {
  market_id: number;
  discount_count: number;
};

export function getStore(storeId: number): Promise<StoreDetail> {
  return apiFetch<StoreDetail>(`/stores/${storeId}`);
}
