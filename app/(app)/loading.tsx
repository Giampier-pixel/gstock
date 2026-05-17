export default function Loading() {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      <div className="flex items-end justify-between mb-0">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-card/60 rounded-md" />
          <div className="h-3 w-32 bg-card/40 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-[200px] bg-card/40 rounded-lg" />
          <div className="h-9 w-24 bg-card/40 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="h-[130px] bg-card/50 rounded-xl border border-white/40" />
        <div className="h-[130px] bg-card/50 rounded-xl border border-white/40" />
        <div className="h-[130px] bg-card/50 rounded-xl border border-white/40" />
      </div>

      <div className="bg-card/40 rounded-xl border border-white/40 flex-1 min-h-[400px]" />
    </div>
  );
}
