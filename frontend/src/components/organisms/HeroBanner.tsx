"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MarketListItem } from "@/lib/api/market";

export function HeroBanner({ market }: { market: MarketListItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-[0_10px_28px_-10px_rgba(107,191,89,0.55)]"
    >
      <div className="flex items-center gap-1 text-xs font-medium opacity-90">
        <Sparkles size={14} />
        오늘의 마감할인
      </div>
      <p className="mt-2 text-xl font-extrabold leading-snug">
        {market.name}에서
        <br />
        최대 {market.avg_discount_percent}% 할인 중
      </p>
      <p className="mt-1 text-sm opacity-90">지금 예약하고 퇴근길에 픽업하세요</p>
      <Button
        variant="secondary"
        size="sm"
        className="mt-4 border-transparent bg-card text-primary"
        render={<Link href={`/markets/${market.id}`}>보러가기</Link>}
      />
    </motion.div>
  );
}
