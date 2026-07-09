"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { getReservation } from "@/lib/api/reservation";
import { formatPickupTime, formatPrice } from "@/lib/format";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";

export default function ReservationCompletePage() {
  const params = useParams<{ id: string }>();
  const reservationId = Number(params.id);
  const userId = useCurrentUserId();

  const reservationQuery = useQuery({
    queryKey: ["reservation", reservationId, userId],
    queryFn: () => getReservation(userId as string, reservationId),
    enabled: !!userId,
  });

  if (!userId || reservationQuery.isLoading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">불러오는 중...</p>;
  }
  if (reservationQuery.isError || !reservationQuery.data) {
    return (
      <p className="px-4 py-4 text-sm text-destructive">예약 정보를 불러오지 못했습니다.</p>
    );
  }

  const reservation = reservationQuery.data;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 text-center">
      <div className="flex flex-col gap-1">
        <span className="text-2xl">🎉</span>
        <h1 className="text-xl font-semibold">예약이 완료되었습니다!</h1>
        <p className="text-sm text-muted-foreground">예약번호 {reservation.reservation_number}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <QRCodeSVG value={reservation.reservation_number} size={180} />
      </div>

      <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left">
        {reservation.items.map((item) => (
          <div key={item.product_id} className="flex items-center justify-between text-sm">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
          <span>총 결제 금액</span>
          <span className="text-primary">{formatPrice(reservation.total_price)}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          픽업 안내: {formatPickupTime(reservation.pickup_time)}까지 QR을 제시해주세요.
        </p>
      </div>

      <Link
        href="/"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
      >
        홈으로
      </Link>
    </div>
  );
}
