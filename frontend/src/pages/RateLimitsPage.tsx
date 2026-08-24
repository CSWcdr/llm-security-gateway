import {
    useState,
  } from "react";
  
  import {
    Activity,
    Gauge,
    Info,
    Save,
    ShieldCheck,
    Zap,
  } from "lucide-react";
  
  import {
    toast,
  } from "sonner";
  
  import LimitInput from "../components/rate-limits/LimitInput";
  import RateLimitUsage from "../components/rate-limits/RateLimitUsage";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import {
    useRateLimits,
  } from "../hooks/useRateLimits";
  
  export default function RateLimitsPage() {
    const {
      projects,
    } =
      useProjects();
  
    const {
      getPolicyByProjectId,
      toggleRateLimit,
      updateLimit,
    } =
      useRateLimits();
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] =
      useState(
        projects[0]?.id ??
          ""
      );
  
    /*
     * Derived value instead of using
     * useEffect + setState.
     */
    const effectiveProjectId =
      projects.some(
        (project) =>
          project.id ===
          selectedProjectId
      )
        ? selectedProjectId
        : projects[0]?.id ??
          "";
  
    const policy =
      getPolicyByProjectId(
        effectiveProjectId
      );
  
    function handleSave() {
      toast.success(
        "Rate limit policy saved",
        {
          description:
            "Updated limits will apply to future gateway requests.",
        }
      );
    }
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Gauge
                size={20}
                className="text-blue-400"
              />
  
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Rate Limits
              </h1>
            </div>
  
            <p className="mt-2 text-sm text-slate-500">
              Protect gateway resources by
              controlling how frequently
              applications can send requests.
            </p>
          </div>
  
          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={
              !policy
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save
              size={16}
            />
  
            Save Limits
          </button>
        </div>
  
        {/* Information */}
        <div className="flex gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-blue-400"
          />
  
          <div>
            <p className="text-sm font-medium text-blue-300">
              Project-level rate limiting
            </p>
  
            <p className="mt-1 text-xs leading-5 text-blue-200/50">
              Requests exceeding a configured
              quota will be rejected before
              reaching the LLM provider, helping
              control abuse, infrastructure load
              and AI spending.
            </p>
          </div>
        </div>
  
        {/* Project Selector */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Project
              </p>
  
              <p className="mt-1 text-xs text-slate-600">
                Configure request quotas for a
                specific application.
              </p>
            </div>
  
            <select
              value={
                effectiveProjectId
              }
              onChange={(
                event
              ) =>
                setSelectedProjectId(
                  event.target.value
                )
              }
              className="min-w-56 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-blue-500/50"
            >
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
                    {
                      project.name
                    }
                  </option>
                )
              )}
            </select>
          </div>
        </div>
  
        {!policy ? (
          <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
            <Gauge
              size={28}
              className="mx-auto text-slate-700"
            />
  
            <p className="mt-4 text-sm text-slate-400">
              No rate limit policy configured.
            </p>
          </div>
        ) : (
          <>
            {/* Enable / disable */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex items-center justify-between gap-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <ShieldCheck
                      size={18}
                    />
                  </div>
  
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Rate Limiting
                    </p>
  
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Reject requests after this
                      project's configured quota
                      has been exceeded.
                    </p>
                  </div>
                </div>
  
                <button
                  type="button"
                  onClick={() =>
                    toggleRateLimit(
                      policy.projectId
                    )
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    policy.enabled
                      ? "bg-blue-600"
                      : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      policy.enabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
  
            {/* Current usage */}
            <div>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-white">
                  Current Usage
                </h2>
  
                <p className="mt-1 text-xs text-slate-600">
                  Usage counters for the selected
                  project.
                </p>
              </div>
  
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <RateLimitUsage
                    label="This Minute"
                    current={
                      policy.currentMinuteUsage
                    }
                    limit={
                      policy.requestsPerMinute
                    }
                  />
                </div>
  
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <RateLimitUsage
                    label="This Hour"
                    current={
                      policy.currentHourUsage
                    }
                    limit={
                      policy.requestsPerHour
                    }
                  />
                </div>
  
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
                  <RateLimitUsage
                    label="Today"
                    current={
                      policy.currentDayUsage
                    }
                    limit={
                      policy.requestsPerDay
                    }
                  />
                </div>
              </div>
            </div>
  
            {/* Configuration */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
              <div className="border-b border-slate-800 p-5">
                <div className="flex items-center gap-2">
                  <Activity
                    size={17}
                    className="text-blue-400"
                  />
  
                  <h2 className="text-sm font-semibold text-white">
                    Request Quotas
                  </h2>
                </div>
  
                <p className="mt-1 text-xs text-slate-500">
                  Define how much traffic this
                  project may send through the
                  gateway.
                </p>
              </div>
  
              <div className="grid gap-4 p-5 md:grid-cols-2">
                <LimitInput
                  label="Requests per minute"
                  description="Maximum requests allowed during a one-minute window."
                  value={
                    policy.requestsPerMinute
                  }
                  disabled={
                    !policy.enabled
                  }
                  onChange={(
                    value
                  ) =>
                    updateLimit(
                      policy.projectId,
                      "requestsPerMinute",
                      value
                    )
                  }
                />
  
                <LimitInput
                  label="Requests per hour"
                  description="Maximum requests allowed during a one-hour window."
                  value={
                    policy.requestsPerHour
                  }
                  disabled={
                    !policy.enabled
                  }
                  onChange={(
                    value
                  ) =>
                    updateLimit(
                      policy.projectId,
                      "requestsPerHour",
                      value
                    )
                  }
                />
  
                <LimitInput
                  label="Requests per day"
                  description="Maximum number of gateway requests allowed each day."
                  value={
                    policy.requestsPerDay
                  }
                  disabled={
                    !policy.enabled
                  }
                  onChange={(
                    value
                  ) =>
                    updateLimit(
                      policy.projectId,
                      "requestsPerDay",
                      value
                    )
                  }
                />
  
                <LimitInput
                  label="Burst limit"
                  description="Maximum short spike of requests accepted before throttling."
                  value={
                    policy.burstLimit
                  }
                  disabled={
                    !policy.enabled
                  }
                  onChange={(
                    value
                  ) =>
                    updateLimit(
                      policy.projectId,
                      "burstLimit",
                      value
                    )
                  }
                />
              </div>
            </div>
  
            {/* HTTP 429 explanation */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Zap
                    size={18}
                  />
                </div>
  
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    What happens when the limit is
                    exceeded?
                  </p>
  
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    The gateway rejects the request
                    with an HTTP
                    <span className="mx-1 font-mono text-amber-400">
                      429 Too Many Requests
                    </span>
                    response. The request will not
                    reach the LLM provider, so
                    unnecessary model cost is
                    avoided.
                  </p>
                </div>
              </div>
            </div>
  
            <p className="text-xs text-slate-600">
              Last updated{" "}
              {
                policy.updatedAt
              }
            </p>
          </>
        )}
      </div>
    );
  }