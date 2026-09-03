import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AnalyticsDetails,
} from "../../services/analytics.service";


type ModelUsageChartProps = {
  data: AnalyticsDetails["modelUsage"];
};


export default function ModelUsageChart({
  data,
}: ModelUsageChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

      <div>

        <h2 className="text-sm font-semibold text-white">
          Model Usage
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Requests grouped by LLM provider/model.
        </p>

      </div>


      {data.length === 0 ? (

        <div className="flex h-67.5 items-center justify-center">

          <p className="text-sm text-slate-500">
            No model usage recorded yet.
          </p>

        </div>

      ) : (

        <div className="mt-6 h-67.5">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
            >

              <CartesianGrid
                stroke="#1e293b"
                strokeDasharray="3 3"
                vertical={false}
              />


              <XAxis
                dataKey="model"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />


              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
              />


              <Tooltip
                cursor={{
                  fill:
                    "rgba(30,41,59,0.25)",
                }}

                contentStyle={{
                  backgroundColor:
                    "#0f172a",

                  border:
                    "1px solid #1e293b",

                  borderRadius:
                    "10px",
                }}
              />


              <Bar
                dataKey="requests"
                name="Requests"
                fill="#8b5cf6"
                radius={[
                  6,
                  6,
                  0,
                  0,
                ]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
}