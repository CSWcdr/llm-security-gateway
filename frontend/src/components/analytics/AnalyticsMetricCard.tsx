import {
    ArrowDownRight,
    ArrowUpRight,
    type LucideIcon,
  } from "lucide-react";
  
  type AnalyticsMetricCardProps = {
    title: string;
    value: string;
    description: string;
  
    icon: LucideIcon;
  
    trend: {
      value: string;
      positive: boolean;
    };
  
    iconStyle: string;
  };
  
  export default function AnalyticsMetricCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    iconStyle,
  }: AnalyticsMetricCardProps) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
  
        <div className="flex items-start justify-between">
  
          <div>
            <p className="text-xs text-slate-500">
              {title}
            </p>
  
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {value}
            </p>
          </div>
  
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
          >
            <Icon size={18} />
          </div>
  
        </div>
  
        <div className="mt-4 flex items-center gap-2">
  
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              trend.positive
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {trend.positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}
  
            {trend.value}
          </span>
  
          <span className="text-xs text-slate-600">
            {description}
          </span>
  
        </div>
  
      </div>
    );
  }