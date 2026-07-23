export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-4">
      {/* StatusBar 骨架：4 个卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card flex items-center gap-3 p-4">
            <div className="skeleton h-10 w-10 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-5 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 摘要区骨架 */}
      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="skeleton h-4 w-4 rounded" />
          <div className="skeleton h-4 w-28 rounded" />
        </div>
        <div className="mb-4 flex flex-col gap-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-5/6 rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* 新闻列表骨架 */}
      <div className="flex flex-col gap-3">
        <div className="skeleton h-4 w-32 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="mb-2 flex gap-2">
              <div className="skeleton h-5 w-12 rounded" />
              <div className="skeleton h-5 w-12 rounded" />
            </div>
            <div className="skeleton mb-2 h-4 w-3/4 rounded" />
            <div className="skeleton mb-1 h-3 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
