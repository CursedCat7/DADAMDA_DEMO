import type { LatLng } from "./generateStoreCoordinates";

export type MapStore = {
  id: number;
  name: string;
  category: string;
  discountCount: number;
  topProduct: { title: string; discountPercent: number } | null;
  coordinate: LatLng;
};

export type MapMarket = {
  id: number;
  name: string;
  discountCount: number;
  storeCount: number;
  coordinate: LatLng;
  stores: MapStore[];
};

export type MapSelection =
  | { type: "market"; market: MapMarket }
  | { type: "store"; store: MapStore };
