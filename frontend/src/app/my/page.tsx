"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, Package, User } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { EsgWidget } from "@/components/molecules/EsgWidget";
import { getReservations } from "@/lib/api/reservation";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";
import { useAuthStore } from "@/lib/store/auth";
import { formatPrice } from "@/lib/format";

export default function MyPage() {
  const userId = useCurrentUserId();
  const nickname = useAuthStore((state) => state.usersByRole.USER?.nickname);

  const reservationsQuery = useQuery({
    queryKey: ["reservations", userId],
    queryFn: () => getReservations(userId as string),
    enabled: !!userId,
  });

  const { reservationCount, savedMoney } = useMemo(() => {
    const reservations = reservationsQuery.data ?? [];
    const count = reservations.length;
    const saved = reservations.reduce(
      (sum, r) =>
        sum + r.items.reduce((s, item) => s + (item.original_price - item.price) * item.quantity, 0),
      0,
    );
    return { reservationCount: count, savedMoney: saved };
  }, [reservationsQuery.data]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex items-center gap-3">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <User size={26} />
        </span>
        <div className="flex flex-col">
          <p className="text-lg font-extrabold text-foreground">{nickname ?? "손님"}</p>
          <p className="text-sm text-muted-foreground">다담다와 함께 알뜰하게 장보는 중</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary/60 text-primary">
            <Package size={16} />
          </span>
          <span className="text-lg font-bold text-foreground">{reservationCount}건</span>
          <span className="text-xs text-muted-foreground">예약 수</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 p-4 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary/60 text-primary">
            <Coins size={16} />
          </span>
          <span className="text-lg font-bold text-foreground">{formatPrice(savedMoney)}</span>
          <span className="text-xs text-muted-foreground">절약금액</span>
        </Card>
      </div>

      <EsgWidget />
    </div>
  );
}
