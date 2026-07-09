import { Apple, Beef, CakeSlice, Fish, Soup, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const QUICK_MENU_ITEMS = [
  { label: "반찬", icon: UtensilsCrossed },
  { label: "정육", icon: Beef },
  { label: "과일", icon: Apple },
  { label: "생선", icon: Fish },
  { label: "떡", icon: CakeSlice },
  { label: "분식", icon: Soup },
] as const;

export function QuickMenu() {
  return (
    <div className="grid grid-cols-6 gap-2">
      {QUICK_MENU_ITEMS.map(({ label, icon: Icon }) => (
        <Link
          key={label}
          href="/markets"
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-card py-3 text-[11px] font-medium text-foreground shadow-[0_4px_14px_-8px_rgba(43,38,32,0.15)]"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
            <Icon size={17} />
          </span>
          {label}
        </Link>
      ))}
    </div>
  );
}
