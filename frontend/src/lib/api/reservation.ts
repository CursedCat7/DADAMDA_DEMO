import { apiFetch } from "./client";

export type ReservationItem = {
  product_id: number;
  title: string;
  quantity: number;
  price: number;
  original_price: number;
};

export type Reservation = {
  id: number;
  reservation_number: string;
  status: string;
  total_price: number;
  pickup_time: string;
  created_at: string;
  items: ReservationItem[];
};

export function createReservation(
  userId: string,
  productId: number,
  quantity: number,
): Promise<Reservation> {
  return apiFetch<Reservation>("/reservations", {
    method: "POST",
    headers: { "X-User-Id": userId },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export function getReservation(userId: string, reservationId: number): Promise<Reservation> {
  return apiFetch<Reservation>(`/reservations/${reservationId}`, {
    headers: { "X-User-Id": userId },
  });
}

export function getReservations(userId: string): Promise<Reservation[]> {
  return apiFetch<Reservation[]>("/reservations", {
    headers: { "X-User-Id": userId },
  });
}

export function cancelReservation(userId: string, reservationId: number): Promise<Reservation> {
  return apiFetch<Reservation>(`/reservations/${reservationId}`, {
    method: "DELETE",
    headers: { "X-User-Id": userId },
  });
}
