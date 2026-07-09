"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Package } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/molecules/SegmentedControl";
import { getReservations, type Reservation } from "@/lib/api/reservation";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";
import { formatPickupTime, formatPrice } from "@/lib/format";

type StatusTab = "예약중" | "픽업완료" | "취소";

const TABS: { value: StatusTab; label: string }[] = [
  { value: "예약중", label: "진행중" },
  { value: "픽업완료", label: "완료" },
  { value: "취소", label: "취소" },
];

function statusBadgeVariant(status: string): "primary" | "neutral" | "accent" {
  if (status === "예약중") return "primary";
  if (status === "픽업완료") return "neutral";
  return "accent";
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const itemSummary =
    reservation.items.length === 1
      ? reservation.items[0].title
      : `${reservation.items[0]?.title ?? ""} 외 ${reservation.items.length - 1}건`;

  return (
    <Link href={`/reservations/${reservation.id}/complete`}>
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            예약번호 {reservation.reservation_number}
          </span>
          <Badge variant={statusBadgeVariant(reservation.status)}>{reservation.status}</Badge>
        </div>
        <p className="text-[15px] font-bold text-foreground">{itemSummary}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock size={13} />
            {formatPickupTime(reservation.pickup_time)}까지
          </span>
          <span className="font-semibold text-primary">
            {formatPrice(reservation.total_price)}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function ReservationHistoryPage() {
  const [tab, setTab] = useState<StatusTab>("예약중");
  const userId = useCurrentUserId();

  const reservationsQuery = useQuery({
    queryKey: ["reservations", userId],
    queryFn: () => getReservations(userId as string),
    enabled: !!userId,
  });

  const filtered = useMemo(
    () => reservationsQuery.data?.filter((r) => r.status === tab) ?? [],
    [reservationsQuery.data, tab],
  );

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex flex-col gap-3">
        <h1 className="text-xl font-extrabold text-foreground">예약 내역</h1>
        <SegmentedControl value={tab} onChange={setTab} options={TABS} />
      </header>

      <div className="flex flex-col gap-3">
        {(!userId || reservationsQuery.isLoading) && (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        )}
        {reservationsQuery.isError && (
          <p className="text-sm text-destructive">예약 내역을 불러오지 못했습니다.</p>
        )}
        {reservationsQuery.data && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
            <Package size={32} />
            <p className="text-sm">해당하는 예약 내역이 없습니다.</p>
          </div>
        )}
        {filtered.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}
