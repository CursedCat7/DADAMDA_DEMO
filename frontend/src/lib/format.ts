export function formatPrice(value: number): string {
  return `${value.toLocaleString("ko-KR")}원`;
}

export function formatPickupTime(value: string): string {
  return new Date(value).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
