import { apiFetch } from "./client";

export type EsgSummary = {
  saved_food_kg: number;
  saved_co2: number;
  saved_money: number;
};

export function getEsgSummary(): Promise<EsgSummary> {
  return apiFetch<EsgSummary>("/esg");
}
