"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, Leaf, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getEsgSummary } from "@/lib/api/esg";
import { formatPrice } from "@/lib/format";

const STATS = [
  { key: "saved_food_kg" as const, label: "폐기 감소", icon: Leaf, unit: "kg" },
  { key: "saved_co2" as const, label: "탄소 절감", icon: Wind, unit: "kg" },
  { key: "saved_money" as const, label: "추가 매출", icon: Coins, unit: "원" },
];

export function EsgWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["esg-summary"],
    queryFn: getEsgSummary,
  });

  return (
    <Card className="bg-secondary/60 p-4">
      <p className="mb-3 text-xs font-semibold text-secondary-foreground">
        오늘의 ESG 성과
      </p>
      {isLoading && <p className="text-sm text-muted-foreground">불러오는 중...</p>}
      {isError && <p className="text-sm text-muted-foreground">정보를 불러오지 못했습니다.</p>}
      {data && (
        <div className="grid grid-cols-3 gap-2">
          {STATS.map(({ key, label, icon: Icon, unit }) => (
            <div key={key} className="flex flex-col items-center gap-1 text-center">
              <span className="flex size-9 items-center justify-center rounded-full bg-card text-primary">
                <Icon size={16} />
              </span>
              <span className="text-sm font-bold text-foreground">
                {unit === "원" ? formatPrice(data[key]) : `${data[key]}${unit}`}
              </span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
