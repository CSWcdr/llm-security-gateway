import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type {
  AnalyticsDetails,
} from "../../services/analytics.service";


type StatusDistributionChartProps = {
  data: AnalyticsDetails["decisionBreakdown"];
};


const COLORS = [
  "#10b981",
  "#ef4444",
  "#f59e0b",
];


export default function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const chartData = [
    {
      name: "Allowed",
      value: data.allowed,
    },

    {
      name: "Blocked",
      value: data.blocked,
    },

    {
      name: "Errors",
      value: data.error,
    },
  ];


  const total =
    chartData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );


  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

      <div>

        <h2 className="text-sm font-semibold text-white">
          Gateway Decisions
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Distribution of security outcomes.
        </p>

      </div>


      <div className="relative mt-3 h-57.5">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={68}
              outerRadius={90}
              paddingAngle={3}
            >

              {chartData.map(
                (item, index) => (
                  <Cell
                    key={item.name}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>


            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#0f172a",

                border:
                  "1px solid #1e293b",

                borderRadius:
                  "10px",
              }}
            />

          </PieChart>
        </ResponsiveContainer>


        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

          <div className="text-center">

            <p className="text-2xl font-semibold text-white">
              {total.toLocaleString()}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Requests
            </p>

          </div>

        </div>

      </div>


      <div className="space-y-3">

        {chartData.map(
          (item, index) => {
            const percentage =
              total > 0
                ? (
                    (item.value /
                      total) *
                    100
                  ).toFixed(1)
                : "0.0";


            return (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >

                <div className="flex items-center gap-2">

                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        COLORS[index],
                    }}
                  />

                  <span className="text-xs text-slate-500">
                    {item.name}
                  </span>

                </div>


                <div className="text-right">

                  <span className="text-xs font-medium text-slate-300">
                    {item.value.toLocaleString()}
                  </span>

                  <span className="ml-2 text-[10px] text-slate-600">
                    {percentage}%
                  </span>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}