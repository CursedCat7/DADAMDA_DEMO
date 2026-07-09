import type { MapMarket } from "@/lib/map/types";

// Kakao's CustomOverlay takes a raw DOM element as its `content`, not a
// React tree - the map canvas isn't something React renders into. This is
// a marker *factory*, not a JSX component, even though it lives next to
// the other map "components" for discoverability.
export function createMarketMarkerElement(market: MapMarket): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.setAttribute("aria-label", `${market.name} 마커`);
  el.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 9999px;
    background: var(--primary);
    color: var(--primary-foreground);
    border: 3px solid var(--card);
    box-shadow: 0 8px 20px -6px rgba(107,191,89,0.6);
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.18s ease;
    transform: scale(1);
  `;
  // Lucide "Store" icon path data, inlined as raw SVG - CustomOverlay
  // content is a plain DOM element, so this can't be a <Store /> React
  // component the way the rest of the app uses Lucide icons.
  el.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" />
      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" />
      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" />
    </svg>
  `;
  return el;
}

export function setMarketMarkerSelected(el: HTMLElement, selected: boolean): void {
  el.style.transform = selected ? "scale(1.18)" : "scale(1)";
}
