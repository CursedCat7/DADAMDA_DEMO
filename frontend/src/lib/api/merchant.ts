import { apiFetch } from "./client";
import type { ReservationItem } from "./reservation";

export type MerchantReservation = {
  id: number;
  reservation_number: string;
  status: string;
  total_price: number;
  pickup_time: string;
  created_at: string;
  customer_nickname: string;
  items: ReservationItem[];
};

export function getMerchantReservations(userId: string): Promise<MerchantReservation[]> {
  return apiFetch<MerchantReservation[]>("/merchant/reservations", {
    headers: { "X-User-Id": userId },
  });
}

export function completePickup(
  userId: string,
  reservationId: number,
): Promise<MerchantReservation> {
  return apiFetch<MerchantReservation>(`/merchant/reservations/${reservationId}/pickup`, {
    method: "PUT",
    headers: { "X-User-Id": userId },
  });
}
