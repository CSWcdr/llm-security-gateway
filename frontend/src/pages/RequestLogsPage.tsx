import {
    useMemo,
    useState,
  } from "react";
  
  import {
    Activity,
    Ban,
    Search,
    ShieldAlert,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    useNavigate,
  } from "react-router-dom";
  
  import RequestStatusBadge from "../components/logs/RequestStatusBadge";
  
  import {
    mockRequestLogs,
  } from "../data/mockData";
  
  import type {
    RequestStatus,
  } from "../types";
  
  type StatusFilter =
    | "All"
    | RequestStatus;
  
  export default function RequestLogsPage() {
    const navigate =
      useNavigate();
  
    const [search, setSearch] =
      useState("");
  
    const [
      statusFilter,
      setStatusFilter,
    ] =
      useState<StatusFilter>(
        "All"
      );
  
    const filteredRequests =
      useMemo(() => {
        const query =
          search.toLowerCase();
  
        return mockRequestLogs.filter(
          (request) => {
            const matchesSearch =
              request.id
                .toLowerCase()
                .includes(query) ||
              request.projectName
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
        search,
        statusFilter,
      ]);
  
    const allowed =
      mockRequestLogs.filter(
        (request) =>
          request.status ===
          "Allowed"
      ).length;
  
    const blocked =
      mockRequestLogs.filter(
        (request) =>
          request.status ===
          "Blocked"
      ).length;
  
    const warnings =
      mockRequestLogs.filter(
        (request) =>
          request.status ===
          "Warning"
      ).length;
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div>
  
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Request Logs
          </h1>
  
          <p className="mt-1 text-sm text-slate-500">
            Inspect every request processed by the LLM Security Gateway.
          </p>
  
        </div>
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <LogMetric
            label="Total Requests"
            value={
              mockRequestLogs.length.toString()
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
            label="Warnings"
            value={
              warnings.toString()
            }
            icon={ShieldAlert}
            iconStyle="bg-amber-500/10 text-amber-400"
          />
  
        </div>
  
        {/* Search */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:flex-row">
  
          <div className="relative flex-1">
  
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
  
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search request ID, project, model or prompt..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
            />
  
          </div>
  
          <div className="flex gap-2">
  
            {(
              [
                "All",
                "Allowed",
                "Blocked",
                "Warning",
              ] as StatusFilter[]
            ).map((status) => (
  
              <button
                key={status}
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
                {status}
              </button>
  
            ))}
  
          </div>
  
        </div>
  
        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="border-b border-slate-800 p-5">
  
            <h2 className="text-sm font-semibold text-white">
              Gateway Requests
            </h2>
  
            <p className="mt-1 text-xs text-slate-500">
              Click a request to inspect its complete processing lifecycle.
            </p>
  
          </div>
  
          <div className="overflow-x-auto">
  
            <table className="w-full text-left">
  
              <thead>
  
                <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-600">
  
                  <th className="px-5 py-3 font-medium">
                    Request ID
                  </th>
  
                  <th className="px-5 py-3 font-medium">
                    Project
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
  
                      <td className="px-5 py-4 font-mono text-xs text-blue-400">
                        {request.id}
                      </td>
  
                      <td className="px-5 py-4">
  
                        <p className="text-slate-200">
                          {
                            request.projectName
                          }
                        </p>
  
                        <p className="mt-1 text-[11px] text-slate-600">
                          {
                            request.apiKeyName
                          }
                        </p>
  
                      </td>
  
                      <td className="px-5 py-4 text-slate-400">
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
                          4
                        )}
                      </td>
  
                      <td className="px-5 py-4 text-xs text-slate-500">
  
                        {new Date(
                          request.createdAt
                        ).toLocaleTimeString(
                          [],
                          {
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
  
          {filteredRequests.length ===
            0 && (
            <div className="py-20 text-center">
  
              <p className="text-sm text-slate-400">
                No requests found.
              </p>
  
              <p className="mt-2 text-xs text-slate-600">
                Try changing your search or filters.
              </p>
  
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
            <Icon size={17} />
          </div>
  
        </div>
  
      </div>
    );
  }