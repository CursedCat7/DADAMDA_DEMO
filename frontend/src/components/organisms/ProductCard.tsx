import Link from "next/link";
import type { ProductListItem } from "@/lib/api/product";

function formatPrice(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <span className="text-base font-semibold">{product.title}</span>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground line-through">
          {formatPrice(product.original_price)}
        </span>
        <span className="font-semibold text-primary">
          {formatPrice(product.discount_price)}
        </span>
        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          {product.discount_percent}%
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        남은 수량 {product.remain_quantity}개
      </span>
    </Link>
  );
}
