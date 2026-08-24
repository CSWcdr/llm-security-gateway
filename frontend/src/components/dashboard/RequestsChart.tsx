import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  import { requestChartData } from "../../data/mockData";
  
  export default function RequestsChart() {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
  
        <div className="mb-6 flex items-start justify-between">
  
          <div>
            <h2 className="text-base font-semibold text-white">
              Gateway Traffic
            </h2>
  
            <p className="mt-1 text-xs text-slate-500">
              Requests processed during the last 24 hours
            </p>
          </div>
  
          <select className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400 outline-none">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
  
        </div>
  
        <div className="h-75 w-full">
  
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={requestChartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
  
              <defs>
  
                <linearGradient
                  id="requestGradient"
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
  
              </defs>
  
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
  
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
  
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
              />
  
              <Tooltip
                cursor={{
                  stroke: "#334155",
                }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "10px",
                  color: "#f8fafc",
                }}
                labelStyle={{
                  color: "#94a3b8",
                }}
              />
  
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#requestGradient)"
              />
  
            </AreaChart>
          </ResponsiveContainer>
  
        </div>
  
        <div className="mt-4 flex items-center gap-6 border-t border-slate-800 pt-4">
  
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
  
            <span className="text-xs text-slate-400">
              Requests
            </span>
          </div>
  
          <div className="text-xs text-slate-500">
            Peak: 830 requests/hour
          </div>
  
        </div>
  
      </div>
    );
  }