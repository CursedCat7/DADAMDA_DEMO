import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProductListItem } from "@/lib/api/product";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="flex gap-3 p-3">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.title} className="size-full object-cover" />
          ) : (
            <ShoppingBasket size={26} className="text-primary" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <span className="truncate text-sm font-semibold text-foreground">{product.title}</span>
          <div className="flex items-center gap-1.5">
            <Badge variant="accent">{product.discount_percent}%</Badge>
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.discount_price)}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.original_price)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            남은 수량 {product.remain_quantity}개
          </span>
        </div>
      </Card>
    </Link>
  );
}
