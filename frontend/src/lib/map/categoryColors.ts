// Category marker colors: brief asks for 반찬=Green/정육=Red/생선=Blue/
// 과일=Orange/분식=Yellow/기타=Gray, softened to sit alongside the warm
// ivory background and green/red-accent brand palette instead of using
// saturated primary-color-wheel hues.
export const CATEGORY_COLORS: Record<string, string> = {
  반찬: "#6BBF59", // brand primary green
  생선: "#5B9BD1",
  정육: "#F25C54", // brand accent red
  과일: "#F2994A",
  떡: "#B892C9",
  분식: "#F2C94C",
  채소: "#4FA88A",
  기타: "#9B9488",
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["기타"];
}
