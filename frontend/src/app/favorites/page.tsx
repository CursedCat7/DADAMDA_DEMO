import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Heart size={28} />
      </span>
      <h1 className="text-lg font-bold text-foreground">서비스 준비 중입니다</h1>
      <p className="text-sm text-muted-foreground">
        좋아요 기능은 곧 만나보실 수 있어요.
      </p>
    </div>
  );
}
