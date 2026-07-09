"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, ImageIcon, Package } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex h-64 items-center justify-center overflow-hidden bg-secondary text-secondary-foreground/60">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.title}
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon size={40} />
        )}
      </div>

      <div className="flex flex-col gap-3 px-4">
        <h1 className="text-xl font-extrabold text-foreground">{product.title}</h1>
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="accent" className="text-sm">
            {product.discount_percent}%
          </Badge>
          <span className="text-2xl font-extrabold text-foreground">
            {formatPrice(product.discount_price)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral">
            <Package size={12} />
            남은 수량 {product.remain_quantity}개
          </Badge>
          <Badge variant="neutral">
            <Clock size={12} />
            픽업 {formatPickupTime(product.pickup_start)} - {formatPickupTime(product.pickup_end)}
          </Badge>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[70px] mx-auto max-w-[430px] bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-6 pb-3">
        {isReservable ? (
          <Button
            variant="primary"
            size="lg"
            render={<Link href={`/products/${product.id}/reserve`}>예약하기</Link>}
          />
        ) : (
          <Button variant="primary" size="lg" disabled className="bg-muted text-muted-foreground">
            {product.status === "품절" ? "품절" : "예약 마감"}
          </Button>
        )}
      </div>
    </div>
  );
}
