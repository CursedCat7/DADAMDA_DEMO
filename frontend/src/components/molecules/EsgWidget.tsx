"use client";

import { useQuery } from "@tanstack/react-query";
import { getEsgSummary } from "@/lib/api/esg";

export function EsgWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["esg-summary"],
    queryFn: getEsgSummary,
  });

  return (
    <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
      <div>
        <p className="text-xs opacity-90">오늘의 ESG</p>
        <p className="text-lg font-semibold">
          {isLoading && "불러오는 중..."}
          {isError && "정보 없음"}
          {data && `${data.saved_food_kg}kg 폐기 감소`}
        </p>
      </div>
      {data && <span className="text-xs opacity-90">CO₂ {data.saved_co2}kg</span>}
    </div>
  );
}
