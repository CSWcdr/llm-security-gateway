import {
    Activity,
    DollarSign,
    KeyRound,
    ShieldAlert,
  } from "lucide-react";
  
  import MetricCard from "../components/dashboard/MetricCard";
  import RecentRequests from "../components/dashboard/RecentRequests";
  import RequestsChart from "../components/dashboard/RequestsChart";
  import SecurityAlerts from "../components/dashboard/SecurityAlerts";
  
  export default function OverviewPage() {
    return (
      <div className="space-y-6">
  
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
  
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Overview
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Monitor gateway traffic, security and LLM usage.
            </p>
          </div>
  
          <div className="flex items-center gap-2">
  
            <span className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-400">
  
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
  
              Gateway healthy
  
            </span>
  
          </div>
  
        </div>
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <MetricCard
            title="Total Requests"
            value="12,481"
            description="vs previous period"
            icon={Activity}
            trend={{
              value: "12.5%",
              positive: true,
            }}
            iconClassName="bg-blue-500/10 text-blue-400"
          />
  
          <MetricCard
            title="Blocked Requests"
            value="238"
            description="1.9% of traffic"
            icon={ShieldAlert}
            trend={{
              value: "4.2%",
              positive: false,
            }}
            iconClassName="bg-red-500/10 text-red-400"
          />
  
          <MetricCard
            title="Active API Keys"
            value="14"
            description="across 6 projects"
            icon={KeyRound}
            trend={{
              value: "2 new",
              positive: true,
            }}
            iconClassName="bg-violet-500/10 text-violet-400"
          />
  
          <MetricCard
            title="Estimated Cost"
            value="$24.68"
            description="this month"
            icon={DollarSign}
            trend={{
              value: "8.4%",
              positive: true,
            }}
            iconClassName="bg-emerald-500/10 text-emerald-400"
          />
  
        </div>
  
        {/* Chart + security */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
  
          <RequestsChart />
  
          <SecurityAlerts />
  
        </div>
  
        {/* Recent requests */}
        <RecentRequests />
  
      </div>
    );
  }