"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/api/product";
import { formatPickupTime, formatPrice } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const productQuery = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
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
  const isReservable = product.status === "판매중" && product.remain_quantity > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-56 items-center justify-center bg-muted text-sm text-muted-foreground">
        상품 이미지 준비중
      </div>

      <div className="flex flex-col gap-3 px-4">
        <h1 className="text-xl font-semibold">{product.title}</h1>
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </span>
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.discount_price)}
          </span>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive">
            {product.discount_percent}%
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>남은 수량 {product.remain_quantity}개</span>
          <span>
            픽업 가능 {formatPickupTime(product.pickup_start)} - {" "}
            {formatPickupTime(product.pickup_end)}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        {isReservable ? (
          <Link
            href={`/products/${product.id}/reserve`}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
          >
            예약하기
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-12 w-full items-center justify-center rounded-xl bg-muted text-base font-semibold text-muted-foreground"
          >
            {product.status === "품절" ? "품절" : "예약 마감"}
          </button>
        )}
      </div>
    </div>
  );
}
