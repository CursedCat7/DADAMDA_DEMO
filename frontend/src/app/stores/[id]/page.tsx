"use client";

import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/organisms/ProductCard";
import { getStoreProducts } from "@/lib/api/product";
import { getStore } from "@/lib/api/store";

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const storeId = Number(params.id);

  const storeQuery = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => getStore(storeId),
  });
  const productsQuery = useQuery({
    queryKey: ["store-products", storeId],
    queryFn: () => getStoreProducts(storeId),
  });

  if (storeQuery.isLoading) {
    return <p className="px-4 py-4 text-sm text-muted-foreground">불러오는 중...</p>;
  }
  if (storeQuery.isError || !storeQuery.data) {
    return (
      <p className="px-4 py-4 text-sm text-destructive">상점 정보를 불러오지 못했습니다.</p>
    );
  }

  const store = storeQuery.data;
  // Only 판매중 items are reservable; 품절/예약마감/종료 products still
  // exist via GET /stores/{id}/products (for a future merchant view) but
  // don't belong on this consumer-facing "지금 예약 가능한 상품" list.
  const onSaleProducts = (productsQuery.data ?? []).filter(
    (product) => product.status === "판매중",
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-40 items-center justify-center overflow-hidden bg-secondary text-secondary-foreground/60">
        {store.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.thumbnail}
            alt={store.name}
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon size={32} />
        )}
      </div>

      <div className="flex flex-col gap-2 px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-foreground">{store.name}</h1>
          <Badge variant="secondary">{store.category}</Badge>
        </div>
        {store.description && (
          <p className="text-sm text-muted-foreground">{store.description}</p>
        )}
        <Badge variant="primary" className="w-fit">
          오늘 할인 {store.discount_count}개
        </Badge>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <h2 className="text-base font-bold text-foreground">대표상품</h2>
        {productsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        )}
        {onSaleProducts.length === 0 && !productsQuery.isLoading && (
          <p className="text-sm text-muted-foreground">
            지금 예약 가능한 상품이 없습니다.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {onSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
