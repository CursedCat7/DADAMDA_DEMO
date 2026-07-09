"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completePickup, getMerchantReservations } from "@/lib/api/merchant";
import { formatPickupTime, formatPrice } from "@/lib/format";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";

const STATUS_LABEL: Record<string, string> = {
  예약중: "픽업 대기",
  픽업완료: "수령 완료",
  취소: "취소됨",
};

export default function MerchantPage() {
  const merchantId = useCurrentUserId("MERCHANT");
  const queryClient = useQueryClient();

  const reservationsQuery = useQuery({
    queryKey: ["merchant-reservations", merchantId],
    queryFn: () => getMerchantReservations(merchantId as string),
    enabled: !!merchantId,
  });

  const pickupMutation = useMutation({
    mutationFn: (reservationId: number) =>
      completePickup(merchantId as string, reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-reservations", merchantId] });
    },
  });

  if (!merchantId || reservationsQuery.isLoading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">불러오는 중...</p>;
  }
  if (reservationsQuery.isError) {
    return (
      <p className="px-4 py-4 text-sm text-destructive">
        예약 목록을 불러오지 못했습니다.
      </p>
    );
  }

  const reservations = reservationsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">상인 화면</h1>
        <p className="text-sm text-muted-foreground">영희반찬 · 예약 현황</p>
      </header>

      {reservations.length === 0 && (
        <p className="text-sm text-muted-foreground">예약이 없습니다.</p>
      )}

      <div className="flex flex-col gap-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{reservation.reservation_number}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  reservation.status === "예약중"
                    ? "bg-primary/10 text-primary"
                    : reservation.status === "픽업완료"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {STATUS_LABEL[reservation.status] ?? reservation.status}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {reservation.customer_nickname} ·{" "}
              {reservation.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
            </span>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                픽업 {formatPickupTime(reservation.pickup_time)}
              </span>
              <span className="font-medium">{formatPrice(reservation.total_price)}</span>
            </div>
            {reservation.status === "예약중" && (
              <button
                type="button"
                onClick={() => pickupMutation.mutate(reservation.id)}
                disabled={pickupMutation.isPending}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                수령 확인
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
