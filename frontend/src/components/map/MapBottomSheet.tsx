"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MapSelection } from "@/lib/map/types";

export function MapBottomSheet({
  selection,
  onClose,
}: {
  selection: MapSelection | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {selection && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 bg-foreground/20"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] rounded-t-[24px] bg-card p-5 pb-8 shadow-[0_-8px_28px_-8px_rgba(43,38,32,0.25)]"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground"
            >
              <X size={18} />
            </button>

            {selection.type === "market" ? (
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-extrabold text-foreground">
                  {selection.market.name}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="primary">
                    오늘 할인 {selection.market.discountCount}개
                  </Badge>
                  <Badge variant="neutral">참여 점포 {selection.market.storeCount}개</Badge>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  render={<Link href={`/markets/${selection.market.id}`}>입장하기</Link>}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-foreground">
                    {selection.store.name}
                  </h2>
                  <Badge variant="secondary">{selection.store.category}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="primary">
                    오늘 할인 {selection.store.discountCount}개
                  </Badge>
                  {selection.store.topProduct && (
                    <Badge variant="accent">
                      {selection.store.topProduct.title} {selection.store.topProduct.discountPercent}%
                    </Badge>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  render={<Link href={`/stores/${selection.store.id}`}>점포 보기</Link>}
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
