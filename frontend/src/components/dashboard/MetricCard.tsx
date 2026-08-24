import type { LucideIcon } from "lucide-react";

import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;

  trend?: {
    value: string;
    positive: boolean;
  };

  iconClassName?: string;
};

export default function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconClassName = "bg-blue-500/10 text-blue-400",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-700">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={19} />
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2">

        {trend && (
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
        )}

        <span className="text-xs text-slate-500">
          {description}
        </span>

      </div>

    </div>
  );
}