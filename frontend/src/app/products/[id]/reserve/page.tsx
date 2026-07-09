"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Clock, Minus, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createReservation } from "@/lib/api/reservation";
import { getProduct } from "@/lib/api/product";
import { formatPickupTime, formatPrice } from "@/lib/format";
import { useCurrentUserId } from "@/lib/hooks/useCurrentUserId";

export default function ReservationInputPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const router = useRouter();
  const userId = useCurrentUserId();
  const [quantity, setQuantity] = useState(1);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });

  const reserveMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("로그인 정보를 확인하는 중입니다.");
      return createReservation(userId, productId, quantity);
    },
    onSuccess: (reservation) => {
      router.push(`/reservations/${reservation.id}/complete`);
    },
  });

  if (productQuery.isLoading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">불러오는 중...</p>;
  }
  if (productQuery.isError || !productQuery.data) {
    return (
      <p className="px-4 py-4 text-sm text-destructive">상품 정보를 불러오지 못했습니다.</p>
    );
  }

  const product = productQuery.data;
  const totalPrice = product.discount_price * quantity;

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-28">
      <h1 className="text-xl font-extrabold text-foreground">예약하기</h1>

      <Card className="flex flex-col gap-1 p-4">
        <span className="text-base font-bold text-foreground">{product.title}</span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock size={13} />
          픽업 가능 {formatPickupTime(product.pickup_start)} -{" "}
          {formatPickupTime(product.pickup_end)}
        </span>
      </Card>

      <Card className="flex items-center justify-between p-4">
        <span className="text-sm font-semibold text-foreground">수량</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="w-6 text-center text-base font-bold text-foreground">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.remain_quantity, q + 1))}
            disabled={quantity >= product.remain_quantity}
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </Card>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-muted-foreground">결제 금액</span>
        <span className="text-xl font-extrabold text-foreground">{formatPrice(totalPrice)}</span>
      </div>

      {reserveMutation.isError && (
        <p className="text-sm text-destructive">
          {reserveMutation.error instanceof Error
            ? reserveMutation.error.message
            : "예약에 실패했습니다."}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-[70px] mx-auto max-w-[430px] bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-6 pb-3">
        <Button
          variant="primary"
          size="lg"
          onClick={() => reserveMutation.mutate()}
          disabled={!userId || reserveMutation.isPending}
        >
          {reserveMutation.isPending ? "예약 중..." : "예약하기"}
        </Button>
      </div>
    </div>
  );
}
