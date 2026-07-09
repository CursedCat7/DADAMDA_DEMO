import { LocateFixed } from "lucide-react";

export function MapControls({ onLocate }: { onLocate: () => void }) {
  return (
    <button
      type="button"
      onClick={onLocate}
      aria-label="현재 위치로 이동"
      className="absolute bottom-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-card text-primary shadow-[0_8px_20px_-6px_rgba(43,38,32,0.35)]"
    >
      <LocateFixed size={22} />
    </button>
  );
}
