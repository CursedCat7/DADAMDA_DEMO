export function EsgWidget() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-secondary-foreground">
      <div>
        <p className="text-xs opacity-90">오늘의 ESG</p>
        <p className="text-lg font-semibold">18kg 폐기 감소</p>
      </div>
      <span className="text-xs opacity-90">Mock 데이터</span>
    </div>
  );
}
