export function Ping() {
  return (
    <span className="relative flex w-3 h-3">
      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-amber-400" />
      <span className="relative inline-flex w-3 h-3 rounded-full bg-amber-500" />
    </span>
  );
}
