import { apiFetch } from "./client";

export type ProductListItem = {
  id: number;
  title: string;
  original_price: number;
  discount_price: number;
  discount_percent: number;
  remain_quantity: number;
  pickup_start: string;
  pickup_end: string;
  image_url: string | null;
  status: string;
};

export function getStoreProducts(storeId: number): Promise<ProductListItem[]> {
  return apiFetch<ProductListItem[]>(`/stores/${storeId}/products`);
}
