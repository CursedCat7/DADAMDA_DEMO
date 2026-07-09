"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="flex flex-col items-center gap-6 px-4 py-10 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-8px_rgba(107,191,89,0.6)]"
      >
        <Check size={32} strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.25 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-xl font-extrabold text-foreground">예약이 완료되었습니다!</h1>
        <p className="text-sm text-muted-foreground">예약번호 {reservation.reservation_number}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.25 }}
      >
        <Card className="p-6">
          <QRCodeSVG value={reservation.reservation_number} size={180} />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.25 }}
        className="w-full"
      >
        <Card className="flex w-full flex-col gap-2 p-4 text-left">
          {reservation.items.map((item) => (
            <div key={item.product_id} className="flex items-center justify-between text-sm">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
            <span>총 결제 금액</span>
            <span className="text-primary">{formatPrice(reservation.total_price)}</span>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={13} />
            {formatPickupTime(reservation.pickup_time)}까지 QR을 제시해주세요.
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.25 }}
        className="w-full"
      >
        <Button variant="primary" size="lg" render={<Link href="/">홈으로</Link>} />
      </motion.div>
    </div>
  );
}
