"use client";

import { Heart, Home, MapPinned, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/markets", label: "시장", icon: MapPinned },
  { href: "/favorites", label: "좋아요", icon: Heart },
  { href: "/reservations", label: "예약", icon: Package },
  { href: "/my", label: "마이", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-10 flex border-t border-border/70 bg-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
          >
            <span
              className={`flex size-9 items-center justify-center rounded-full transition-colors ${isActive ? "bg-secondary text-primary" : "text-muted-foreground"
                }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            </span>
            <span className={isActive ? "text-primary" : "text-muted-foreground"}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
