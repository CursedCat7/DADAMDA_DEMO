import { getCategoryColor } from "@/lib/map/categoryColors";
import type { MapStore } from "@/lib/map/types";

// Same rationale as MarketMarker.tsx: Kakao CustomOverlay content must be
// a raw DOM element, so this is a factory function, not a JSX component.
export function createStoreMarkerElement(store: MapStore): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", `${store.name} 마커`);
  el.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 9999px;
    background: ${getCategoryColor(store.category)};
    border: 2px solid var(--card);
    box-shadow: 0 3px 8px -2px rgba(43,38,32,0.35);
    cursor: pointer;
    transition: transform 0.18s ease;
    transform: scale(1);
  `;
  return el;
}

export function setStoreMarkerSelected(el: HTMLElement, selected: boolean): void {
  el.style.transform = selected ? "scale(1.35)" : "scale(1)";
}
