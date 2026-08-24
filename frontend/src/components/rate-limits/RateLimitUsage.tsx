type RateLimitUsageProps = {
    label: string;
    current: number;
    limit: number;
  };
  
  export default function RateLimitUsage({
    label,
    current,
    limit,
  }: RateLimitUsageProps) {
    const percentage =
      limit > 0
        ? Math.min(
            (current / limit) * 100,
            100
          )
        : 0;
  
    const usageStyle =
      percentage >= 90
        ? "bg-red-500"
        : percentage >= 70
        ? "bg-amber-500"
        : "bg-blue-500";
  
    return (
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {label}
          </p>
  
          <p className="text-xs text-slate-400">
            {current.toLocaleString()}
            {" / "}
            {limit.toLocaleString()}
          </p>
        </div>
  
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${usageStyle}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
  
        <p className="mt-2 text-[10px] text-slate-600">
          {percentage.toFixed(1)}% used
        </p>
      </div>
    );
  }