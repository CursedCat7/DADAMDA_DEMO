"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { completePickup, getMerchantReservations } from "@/lib/api/merchant";
import { formatPickupTime, formatPrice } from "@/lib/format";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";

const STATUS_LABEL: Record<string, string> = {
  예약중: "픽업 대기",
  픽업완료: "수령 완료",
  취소: "취소됨",
};

const STATUS_VARIANT: Record<string, "accent" | "primary" | "neutral"> = {
  예약중: "accent",
  픽업완료: "primary",
  취소: "neutral",
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
      <header className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
          <Store size={20} />
        </span>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-foreground">상인 화면</h1>
          <p className="text-sm text-muted-foreground">영희반찬 · 예약 현황</p>
        </div>
      </header>

      {reservations.length === 0 && (
        <p className="text-sm text-muted-foreground">예약이 없습니다.</p>
      )}

      <div className="flex flex-col gap-3">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">{reservation.reservation_number}</span>
              <Badge variant={STATUS_VARIANT[reservation.status] ?? "neutral"}>
                {STATUS_LABEL[reservation.status] ?? reservation.status}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {reservation.customer_nickname} ·{" "}
              {reservation.items.map((item) => `${item.title} x${item.quantity}`).join(", ")}
            </span>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock size={13} />
                픽업 {formatPickupTime(reservation.pickup_time)}
              </span>
              <span className="font-semibold text-foreground">
                {formatPrice(reservation.total_price)}
              </span>
            </div>
            {reservation.status === "예약중" && (
              <Button
                variant="primary"
                size="sm"
                className="mt-1 w-full"
                onClick={() => pickupMutation.mutate(reservation.id)}
                disabled={pickupMutation.isPending}
              >
                수령 확인
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
