"use client";

import { Heart, Home, MapPinned, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/markets", label: "Market", icon: MapPinned },
  { href: "/favorites", label: "Favorite", icon: Heart },
  { href: "/reservations", label: "Reservation", icon: Package },
  { href: "/my", label: "My", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-border bg-background">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
