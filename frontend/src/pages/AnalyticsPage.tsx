import {
    Activity,
    Clock3,
    DollarSign,
    ShieldAlert,
  } from "lucide-react";
  
  import AnalyticsMetricCard from "../components/analytics/AnalyticsMetricCard";
  import ModelUsageChart from "../components/analytics/ModelUsageChart";
  import RequestTrendChart from "../components/analytics/RequestTrendChart";
  import StatusDistributionChart from "../components/analytics/StatusDistributionChart";
  import TopProjectsTable from "../components/analytics/TopProjectTable";
  
  export default function AnalyticsPage() {
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
  
          <div>
  
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Analytics
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Understand gateway traffic, performance, security and AI spending.
            </p>
  
          </div>
  
          <select className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400 outline-none">
  
            <option>
              Last 7 days
            </option>
  
            <option>
              Last 30 days
            </option>
  
            <option>
              Last 90 days
            </option>
  
          </select>
  
        </div>
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <AnalyticsMetricCard
            title="Total Requests"
            value="12,481"
            description="vs previous period"
            icon={Activity}
            trend={{
              value: "18.4%",
              positive: true,
            }}
            iconStyle="bg-blue-500/10 text-blue-400"
          />
  
          <AnalyticsMetricCard
            title="Block Rate"
            value="3.5%"
            description="malicious traffic"
            icon={ShieldAlert}
            trend={{
              value: "0.8%",
              positive: false,
            }}
            iconStyle="bg-red-500/10 text-red-400"
          />
  
          <AnalyticsMetricCard
            title="Avg. Latency"
            value="824 ms"
            description="gateway + provider"
            icon={Clock3}
            trend={{
              value: "6.2%",
              positive: true,
            }}
            iconStyle="bg-violet-500/10 text-violet-400"
          />
  
          <AnalyticsMetricCard
            title="Total Cost"
            value="$24.68"
            description="estimated LLM spend"
            icon={DollarSign}
            trend={{
              value: "12.1%",
              positive: true,
            }}
            iconStyle="bg-emerald-500/10 text-emerald-400"
          />
  
        </div>
  
        {/* Main analytics */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
  
          <RequestTrendChart />
  
          <StatusDistributionChart />
  
        </div>
  
        {/* Model Usage */}
        <ModelUsageChart />
  
        {/* Projects */}
        <TopProjectsTable />
  
      </div>
    );
  }