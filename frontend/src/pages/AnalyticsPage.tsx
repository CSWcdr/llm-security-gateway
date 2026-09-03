import {
  Activity,
  Clock3,
  DollarSign,
  ShieldAlert,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import AnalyticsMetricCard from "../components/analytics/AnalyticsMetricCard";
import ModelUsageChart from "../components/analytics/ModelUsageChart";
import RequestTrendChart from "../components/analytics/RequestTrendChart";
import StatusDistributionChart from "../components/analytics/StatusDistributionChart";

import {
  useProjects,
} from "../hooks/useProjects";

import {
  getAnalyticsDetails,
  getAnalyticsSummary,
  type AnalyticsDetails,
  type AnalyticsSummary,
} from "../services/analytics.service";


export default function AnalyticsPage() {
  const {
    projects,
    loading: projectsLoading,
  } =
    useProjects();


  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState("");


  const [
    days,
    setDays,
  ] =
    useState(7);


  const [
    summary,
    setSummary,
  ] =
    useState<AnalyticsSummary | null>(
      null
    );


  const [
    details,
    setDetails,
  ] =
    useState<AnalyticsDetails | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );


  /*
   * Automatically choose the first
   * available project.
   */
  useEffect(() => {
    if (
      !selectedProjectId &&
      projects.length > 0
    ) {
      setSelectedProjectId(
        projects[0].id
      );
    }
  }, [
    projects,
    selectedProjectId,
  ]);


  /*
   * Load real analytics whenever
   * project or period changes.
   */
  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }


    let cancelled =
      false;


    async function loadAnalytics() {
      try {
        setLoading(true);

        setError(null);


        const [
          summaryData,
          detailsData,
        ] =
          await Promise.all([
            getAnalyticsSummary(
              selectedProjectId
            ),

            getAnalyticsDetails(
              selectedProjectId,
              days
            ),
          ]);


        if (cancelled) {
          return;
        }


        setSummary(
          summaryData
        );

        setDetails(
          detailsData
        );
      } catch (error) {
        console.error(
          error
        );


        if (!cancelled) {
          setError(
            "Failed to load analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadAnalytics();


    return () => {
      cancelled = true;
    };
  }, [
    selectedProjectId,
    days,
  ]);


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


        <div className="flex flex-wrap gap-3">

          {/* Project selector */}
          <select
            value={
              selectedProjectId
            }

            onChange={(event) =>
              setSelectedProjectId(
                event.target.value
              )
            }

            disabled={
              projectsLoading ||
              projects.length === 0
            }

            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400 outline-none"
          >

            {projects.length ===
              0 && (
              <option value="">
                No projects
              </option>
            )}


            {projects.map(
              (project) => (
                <option
                  key={
                    project.id
                  }
                  value={
                    project.id
                  }
                >
                  {project.name}
                </option>
              )
            )}

          </select>


          {/* Date range */}
          <select
            value={days}

            onChange={(event) =>
              setDays(
                Number(
                  event.target.value
                )
              )
            }

            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-400 outline-none"
          >

            <option value={7}>
              Last 7 days
            </option>

            <option value={30}>
              Last 30 days
            </option>

            <option value={90}>
              Last 90 days
            </option>

          </select>

        </div>

      </div>


      {loading && (
        <p className="text-sm text-slate-500">
          Loading analytics...
        </p>
      )}


      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

          <p className="text-sm text-red-400">
            {error}
          </p>

        </div>
      )}


      {!projectsLoading &&
        projects.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-5">

            <p className="text-sm text-slate-500">
              Create a project to start viewing analytics.
            </p>

          </div>
        )}


      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <AnalyticsMetricCard
          title="Total Requests"

          value={
            summary
              ? summary.totalRequests.toLocaleString()
              : "0"
          }

          description="gateway requests"

          icon={Activity}

          trend={{
            value: "—",
            positive: true,
          }}

          iconStyle="bg-blue-500/10 text-blue-400"
        />


        <AnalyticsMetricCard
          title="Block Rate"

          value={
            summary
              ? `${summary.blockRate}%`
              : "0%"
          }

          description="blocked traffic"

          icon={ShieldAlert}

          trend={{
            value: "—",
            positive: true,
          }}

          iconStyle="bg-red-500/10 text-red-400"
        />


        <AnalyticsMetricCard
          title="Avg. Latency"

          value={
            summary
              ? `${summary.averageLatencyMs.toLocaleString()} ms`
              : "0 ms"
          }

          description="gateway + provider"

          icon={Clock3}

          trend={{
            value: "—",
            positive: true,
          }}

          iconStyle="bg-violet-500/10 text-violet-400"
        />


        <AnalyticsMetricCard
          title="Total Cost"

          value={
            summary
              ? `$${summary.totalEstimatedCostUsd.toFixed(
                  4
                )}`
              : "$0.0000"
          }

          description="estimated LLM spend"

          icon={DollarSign}

          trend={{
            value: "—",
            positive: true,
          }}

          iconStyle="bg-emerald-500/10 text-emerald-400"
        />

      </div>


      {/* Request + Decision charts */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">

        <RequestTrendChart
          data={
            details?.dailyTrend ??
            []
          }
        />


        <StatusDistributionChart
          data={
            details
              ?.decisionBreakdown ??
            {
              allowed: 0,
              blocked: 0,
              error: 0,
            }
          }
        />

      </div>


      {/* Model usage */}
      <ModelUsageChart
        data={
          details?.modelUsage ??
          []
        }
      />

    </div>
  );
}