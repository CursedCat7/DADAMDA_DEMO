import Link from "next/link";

const QUICK_MENU_ITEMS = ["반찬", "정육", "과일", "생선", "떡", "분식"];

export function QuickMenu() {
  return (
    <div className="grid grid-cols-6 gap-2">
      {QUICK_MENU_ITEMS.map((label) => (
        <Link
          key={label}
          href="/markets"
          className="flex flex-col items-center gap-1 rounded-xl bg-card py-3 text-xs text-foreground shadow-sm"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
