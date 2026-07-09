"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
    <div className="flex flex-col gap-6 px-4 py-4">
      <h1 className="text-xl font-semibold">예약하기</h1>

      <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4">
        <span className="text-base font-semibold">{product.title}</span>
        <span className="text-sm text-muted-foreground">
          픽업 가능 {formatPickupTime(product.pickup_start)} - {formatPickupTime(product.pickup_end)}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <span className="text-sm font-medium">수량</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="flex size-8 items-center justify-center rounded-full bg-muted text-lg disabled:opacity-40"
          >
            −
          </button>
          <span className="w-6 text-center text-base font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.remain_quantity, q + 1))}
            disabled={quantity >= product.remain_quantity}
            className="flex size-8 items-center justify-center rounded-full bg-muted text-lg disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-muted-foreground">결제 금액</span>
        <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
      </div>

      {reserveMutation.isError && (
        <p className="text-sm text-destructive">
          {reserveMutation.error instanceof Error
            ? reserveMutation.error.message
            : "예약에 실패했습니다."}
        </p>
      )}

      <button
        type="button"
        onClick={() => reserveMutation.mutate()}
        disabled={!userId || reserveMutation.isPending}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-60"
      >
        {reserveMutation.isPending ? "예약 중..." : "예약하기"}
      </button>
    </div>
  );
}
