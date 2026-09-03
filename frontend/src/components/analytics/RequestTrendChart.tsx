import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AnalyticsDetails,
} from "../../services/analytics.service";


type RequestTrendChartProps = {
  data: AnalyticsDetails["dailyTrend"];
};


export default function RequestTrendChart({
  data,
}: RequestTrendChartProps) {
  const chartData =
    data.map((item) => ({
      ...item,

      date:
        new Date(
          `${item.date}T00:00:00`
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),
    }));


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

      <div className="mb-6">

        <h2 className="text-sm font-semibold text-white">
          Request Volume
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Gateway request activity during the selected period.
        </p>

      </div>


      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={chartData}
          >

            <defs>

              <linearGradient
                id="analyticsRequests"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3b82f6"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#3b82f6"
                  stopOpacity={0}
                />
              </linearGradient>


              <linearGradient
                id="analyticsBlocked"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#ef4444"
                  stopOpacity={0.22}
                />

                <stop
                  offset="95%"
                  stopColor="#ef4444"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>


            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
              vertical={false}
            />


            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 11,
              }}
            />


            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 11,
              }}
            />


            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#0f172a",

                border:
                  "1px solid #1e293b",

                borderRadius:
                  "10px",
              }}

              labelStyle={{
                color: "#94a3b8",
              }}
            />


            <Area
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#analyticsRequests)"
            />


            <Area
              type="monotone"
              dataKey="blocked"
              name="Blocked"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#analyticsBlocked)"
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>


      <div className="mt-4 flex gap-5 border-t border-slate-800 pt-4">

        <Legend
          colorClass="bg-blue-500"
          label="Requests"
        />

        <Legend
          colorClass="bg-red-500"
          label="Blocked"
        />

      </div>

    </div>
  );
}


function Legend({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2 w-2 rounded-full ${colorClass}`}
      />

      <span className="text-xs text-slate-500">
        {label}
      </span>

    </div>
  );
}