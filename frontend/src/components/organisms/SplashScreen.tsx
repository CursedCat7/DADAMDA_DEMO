"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SPLASH_DURATION_MS = 1000;

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Renders immediately underneath the splash so the app is already
          mounted (data fetching in flight) by the time the overlay fades,
          rather than only starting to load after the splash disappears. */}
      {children}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
          >
            <motion.img
              src="/DADAMDA_LOGO.svg"
              alt="DaDamDa"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-28 w-auto"
            />
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                DADAMDA
              </span>
              <span className="text-sm text-muted-foreground">
                시장의 끝에서 만나는 알뜰한 장보기
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
