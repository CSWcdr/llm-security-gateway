import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  import {
    Activity,
    Ban,
    Loader2,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    useNavigate,
  } from "react-router-dom";
  
  import RequestStatusBadge from "../components/logs/RequestStatusBadge";
  
  import {
    getRequestLogs,
  } from "../services/logs.service";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import type {
    GatewayRequestLog,
    RequestStatus,
  } from "../types";
  
  
  type StatusFilter =
    | "All"
    | RequestStatus;
  
  
  export default function RequestLogsPage() {
    const navigate =
      useNavigate();
  
    const {
      projects,
    } =
      useProjects();
  
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] =
      useState("");
  
  
    const [
      logs,
      setLogs,
    ] =
      useState<
        GatewayRequestLog[]
      >([]);
  
  
    const [
      loading,
      setLoading,
    ] =
      useState(false);
  
  
    const [
      error,
      setError,
    ] =
      useState("");
  
  
    const [
      refreshKey,
      setRefreshKey,
    ] =
      useState(0);
  
  
    const [
      search,
      setSearch,
    ] =
      useState("");
  
  
    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<StatusFilter>(
        "All"
      );
  
  
    useEffect(() => {
      if (
        !selectedProjectId &&
        projects.length > 0
      ) {
        setSelectedProjectId(
          projects[0].id
        );
  
        return;
      }
  
      if (
        selectedProjectId &&
        projects.length > 0 &&
        !projects.some(
          (project) =>
            project.id ===
            selectedProjectId
        )
      ) {
        setSelectedProjectId(
          projects[0].id
        );
      }
    }, [
      projects,
      selectedProjectId,
    ]);
  
  
    useEffect(() => {
      if (!selectedProjectId) {
        setLogs([]);
        return;
      }
  
      let active = true;
  
  
      async function loadLogs() {
        try {
          setLoading(true);
  
          setError("");
  
          const result =
            await getRequestLogs(
              selectedProjectId
            );
  
          if (!active) {
            return;
          }
  
          setLogs(result);
        } catch (error) {
          if (!active) {
            return;
          }
  
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load request logs."
          );
  
          setLogs([]);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
  
  
      void loadLogs();
  
  
      return () => {
        active = false;
      };
    }, [
      selectedProjectId,
      refreshKey,
    ]);
  
  
    const filteredRequests =
      useMemo(() => {
        const query =
          search
            .trim()
            .toLowerCase();
  
        return logs.filter(
          (request) => {
            const matchesSearch =
              !query ||
              request.id
                .toLowerCase()
                .includes(query) ||
              request.projectName
                .toLowerCase()
                .includes(query) ||
              request.apiKeyName
                .toLowerCase()
                .includes(query) ||
              request.model
                .toLowerCase()
                .includes(query) ||
              request.promptPreview
                .toLowerCase()
                .includes(query);
  
            const matchesStatus =
              statusFilter ===
                "All" ||
              request.status ===
                statusFilter;
  
            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );
      }, [
        logs,
        search,
        statusFilter,
      ]);
  
  
    const allowed =
      logs.filter(
        (request) =>
          request.status ===
          "Allowed"
      ).length;
  
  
    const blocked =
      logs.filter(
        (request) =>
          request.status ===
          "Blocked"
      ).length;
  
  
    const warnings =
      logs.filter(
        (request) =>
          request.status ===
          "Warning"
      ).length;
  
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
  
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Request Logs
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Inspect real requests processed by the LLM Security Gateway.
            </p>
          </div>
  
  
          <div className="flex flex-col gap-2 sm:flex-row">
  
            {/* Project Selector */}
            <select
              value={
                selectedProjectId
              }
              onChange={(event) =>
                setSelectedProjectId(
                  event.target.value
                )
              }
              className="min-w-55 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
            >
              {projects.length ===
              0 ? (
                <option value="">
                  No projects
                </option>
              ) : (
                projects.map(
                  (project) => (
                    <option
                      key={
                        project.id
                      }
                      value={
                        project.id
                      }
                    >
                      {
                        project.name
                      }
                    </option>
                  )
                )
              )}
            </select>
  
  
            {/* Refresh */}
            <button
              type="button"
              disabled={
                loading ||
                !selectedProjectId
              }
              onClick={() =>
                setRefreshKey(
                  (value) =>
                    value + 1
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
  
              Refresh
            </button>
  
          </div>
        </div>
  
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <LogMetric
            label="Total Requests"
            value={
              logs.length.toString()
            }
            icon={Activity}
            iconStyle="bg-blue-500/10 text-blue-400"
          />
  
  
          <LogMetric
            label="Allowed"
            value={
              allowed.toString()
            }
            icon={ShieldCheck}
            iconStyle="bg-emerald-500/10 text-emerald-400"
          />
  
  
          <LogMetric
            label="Blocked"
            value={
              blocked.toString()
            }
            icon={Ban}
            iconStyle="bg-red-500/10 text-red-400"
          />
  
  
          <LogMetric
            label="Errors"
            value={
              warnings.toString()
            }
            icon={ShieldAlert}
            iconStyle="bg-amber-500/10 text-amber-400"
          />
  
        </div>
  
  
        {/* Search + Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:flex-row">
  
          <div className="relative flex-1">
  
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
  
            <input
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search request ID, API key, model or prompt..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
            />
  
          </div>
  
  
          <div className="flex flex-wrap gap-2">
  
            {(
              [
                "All",
                "Allowed",
                "Blocked",
                "Warning",
              ] as StatusFilter[]
            ).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      status
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    statusFilter ===
                    status
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {status ===
                  "Warning"
                    ? "Errors"
                    : status}
                </button>
              )
            )}
  
          </div>
  
        </div>
  
  
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
  
  
        {/* Logs Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="border-b border-slate-800 p-5">
  
            <h2 className="text-sm font-semibold text-white">
              Gateway Requests
            </h2>
  
            <p className="mt-1 text-xs text-slate-500">
              Click any request to inspect its complete security and execution details.
            </p>
  
          </div>
  
  
          {loading ? (
            <div className="flex items-center justify-center py-24">
  
              <Loader2
                size={24}
                className="animate-spin text-blue-400"
              />
  
              <span className="ml-3 text-sm text-slate-500">
                Loading request logs...
              </span>
  
            </div>
          ) : !selectedProjectId ? (
            <div className="py-20 text-center">
  
              <p className="text-sm text-slate-400">
                No project selected.
              </p>
  
              <p className="mt-2 text-xs text-slate-600">
                Create a project first.
              </p>
  
            </div>
          ) : filteredRequests.length ===
            0 ? (
            <div className="py-20 text-center">
  
              <Activity
                size={24}
                className="mx-auto text-slate-700"
              />
  
              <p className="mt-4 text-sm text-slate-400">
                No requests found.
              </p>
  
              <p className="mt-2 text-xs text-slate-600">
                Send a request from the AI Playground and refresh this page.
              </p>
  
            </div>
          ) : (
            <div className="overflow-x-auto">
  
              <table className="w-full text-left">
  
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-600">
  
                    <th className="px-5 py-3 font-medium">
                      Request
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      API Key
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Model
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Status
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Latency
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Tokens
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Cost
                    </th>
  
                    <th className="px-5 py-3 font-medium">
                      Time
                    </th>
  
                  </tr>
                </thead>
  
  
                <tbody>
  
                  {filteredRequests.map(
                    (request) => (
                      <tr
                        key={
                          request.id
                        }
                        onClick={() =>
                          navigate(
                            `/logs/${request.id}`
                          )
                        }
                        className="cursor-pointer border-b border-slate-800/70 text-sm transition last:border-none hover:bg-slate-800/30"
                      >
  
                        <td className="px-5 py-4">
  
                          <p className="max-w-50 truncate font-mono text-xs text-blue-400">
                            {
                              request.id
                            }
                          </p>
  
                          <p className="mt-1 max-w-60 truncate text-[11px] text-slate-600">
                            {
                              request.promptPreview
                            }
                          </p>
  
                        </td>
  
  
                        <td className="px-5 py-4">
  
                          <p className="text-sm text-slate-300">
                            {
                              request.apiKeyName
                            }
                          </p>
  
                          <p className="mt-1 text-[11px] text-slate-600">
                            {
                              request.projectName
                            }
                          </p>
  
                        </td>
  
  
                        <td className="px-5 py-4 text-xs text-slate-400">
                          {
                            request.model
                          }
                        </td>
  
  
                        <td className="px-5 py-4">
  
                          <RequestStatusBadge
                            status={
                              request.status
                            }
                          />
  
                        </td>
  
  
                        <td className="px-5 py-4 text-slate-400">
                          {
                            request.latencyMs
                          }{" "}
                          ms
                        </td>
  
  
                        <td className="px-5 py-4 text-slate-400">
                          {request.inputTokens +
                            request.outputTokens}
                        </td>
  
  
                        <td className="px-5 py-4 text-slate-400">
                          $
                          {request.estimatedCost.toFixed(
                            6
                          )}
                        </td>
  
  
                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
  
                          {new Date(
                            request.createdAt
                          ).toLocaleString(
                            [],
                            {
                              month:
                                "short",
                              day:
                                "2-digit",
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
  
                        </td>
  
                      </tr>
                    )
                  )}
  
                </tbody>
  
              </table>
  
            </div>
          )}
  
        </div>
  
      </div>
    );
  }
  
  
  type IconComponent =
    typeof Activity;
  
  
  function LogMetric({
    label,
    value,
    icon: Icon,
    iconStyle,
  }: {
    label: string;
    value: string;
    icon: IconComponent;
    iconStyle: string;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
  
        <div className="flex items-start justify-between">
  
          <div>
  
            <p className="text-xs text-slate-500">
              {label}
            </p>
  
            <p className="mt-2 text-xl font-semibold text-white">
              {value}
            </p>
  
          </div>
  
  
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle}`}
          >
            <Icon
              size={17}
            />
          </div>
  
        </div>
  
      </div>
    );
  }