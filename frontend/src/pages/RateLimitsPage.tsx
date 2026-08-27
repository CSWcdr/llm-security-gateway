import {
    useEffect,
    useState,
  } from "react";
  
  import {
    Gauge,
    Loader2,
    Save,
  } from "lucide-react";
  
  import {
    toast,
  } from "sonner";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import {
    useRateLimits,
  } from "../hooks/useRateLimits";
  
  
  type DraftRateLimit = {
    enabled: boolean;
  
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  
    burstLimit: number;
  };
  
  
  const EMPTY_DRAFT:
    DraftRateLimit = {
      enabled: true,
  
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
  
      burstLimit: 20,
    };
  
  
  export default function RateLimitsPage() {
    const {
      projects,
    } =
      useProjects();
  
    const {
      getRateLimit,
      updateRateLimit,
      loading,
    } =
      useRateLimits();
  
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] =
      useState("");
  
  
    const [
      draft,
      setDraft,
    ] =
      useState<
        DraftRateLimit
      >(EMPTY_DRAFT);
  
  
    const [
      saving,
      setSaving,
    ] =
      useState(false);
  
  
    useEffect(() => {
      if (
        !selectedProjectId &&
        projects.length > 0
      ) {
        setSelectedProjectId(
          projects[0].id
        );
      }
  
      if (
        selectedProjectId &&
        !projects.some(
          (project) =>
            project.id ===
            selectedProjectId
        )
      ) {
        setSelectedProjectId(
          projects[0]?.id ?? ""
        );
      }
    }, [
      projects,
      selectedProjectId,
    ]);
  
  
    const config =
      selectedProjectId
        ? getRateLimit(
            selectedProjectId
          )
        : undefined;
  
  
    useEffect(() => {
      if (!config) {
        return;
      }
  
      setDraft({
        enabled:
          config.enabled,
  
        requestsPerMinute:
          config.requestsPerMinute,
  
        requestsPerHour:
          config.requestsPerHour,
  
        requestsPerDay:
          config.requestsPerDay,
  
        burstLimit:
          config.burstLimit,
      });
    }, [config]);
  
  
    async function handleSave() {
      if (!selectedProjectId) {
        return;
      }
  
      if (
        draft.requestsPerMinute <= 0 ||
        draft.requestsPerHour <= 0 ||
        draft.requestsPerDay <= 0 ||
        draft.burstLimit <= 0
      ) {
        toast.error(
          "Rate limits must be greater than zero."
        );
  
        return;
      }
  
      try {
        setSaving(true);
  
        await updateRateLimit(
          selectedProjectId,
          {
            enabled:
              draft.enabled,
  
            requestsPerMinute:
              Math.floor(
                draft.requestsPerMinute
              ),
  
            requestsPerHour:
              Math.floor(
                draft.requestsPerHour
              ),
  
            requestsPerDay:
              Math.floor(
                draft.requestsPerDay
              ),
  
            burstLimit:
              Math.floor(
                draft.burstLimit
              ),
          }
        );
  
        toast.success(
          "Rate limits updated"
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update rate limits."
        );
      } finally {
        setSaving(false);
      }
    }
  
  
    return (
      <div className="space-y-6">
  
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
  
          <div>
  
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Rate Limits
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Control how frequently applications can call your LLM gateway.
            </p>
  
          </div>
  
  
          <div className="min-w-60">
  
            <label className="text-xs font-medium text-slate-500">
              Project
            </label>
  
            <select
              value={
                selectedProjectId
              }
              onChange={(event) =>
                setSelectedProjectId(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
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
                    {project.name}
                  </option>
                )
              )}
  
            </select>
  
          </div>
  
        </div>
  
  
        <div className="flex gap-3 rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4">
  
          <Gauge
            size={20}
            className="mt-0.5 shrink-0 text-violet-400"
          />
  
          <div>
  
            <p className="text-sm font-medium text-violet-300">
              Redis-backed rate limiting
            </p>
  
            <p className="mt-1 text-xs leading-5 text-violet-200/50">
              Requests are enforced using burst, minute, hourly, and daily limits before the LLM provider is called.
            </p>
  
          </div>
  
        </div>
  
  
        {loading && !config ? (
  
          <div className="flex items-center justify-center py-20">
  
            <Loader2
              size={24}
              className="animate-spin text-blue-400"
            />
  
            <span className="ml-3 text-sm text-slate-500">
              Loading rate limits...
            </span>
  
          </div>
  
        ) : !selectedProjectId ? (
  
          <EmptyState />
  
        ) : (
  
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
  
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-5">
  
              <div>
  
                <h2 className="text-sm font-semibold text-white">
                  Rate Limiting
                </h2>
  
                <p className="mt-1 text-xs text-slate-500">
                  Enable or disable request limits for this project.
                </p>
  
              </div>
  
  
              <button
                type="button"
                onClick={() =>
                  setDraft(
                    (current) => ({
                      ...current,
  
                      enabled:
                        !current.enabled,
                    })
                  )
                }
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  draft.enabled
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {draft.enabled
                  ? "Enabled"
                  : "Disabled"}
              </button>
  
            </div>
  
  
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
  
              <RateField
                label="Requests per minute"
                value={
                  draft.requestsPerMinute
                }
                onChange={(value) =>
                  setDraft(
                    (current) => ({
                      ...current,
  
                      requestsPerMinute:
                        value,
                    })
                  )
                }
              />
  
  
              <RateField
                label="Requests per hour"
                value={
                  draft.requestsPerHour
                }
                onChange={(value) =>
                  setDraft(
                    (current) => ({
                      ...current,
  
                      requestsPerHour:
                        value,
                    })
                  )
                }
              />
  
  
              <RateField
                label="Requests per day"
                value={
                  draft.requestsPerDay
                }
                onChange={(value) =>
                  setDraft(
                    (current) => ({
                      ...current,
  
                      requestsPerDay:
                        value,
                    })
                  )
                }
              />
  
  
              <RateField
                label="Burst limit"
                value={
                  draft.burstLimit
                }
                onChange={(value) =>
                  setDraft(
                    (current) => ({
                      ...current,
  
                      burstLimit:
                        value,
                    })
                  )
                }
              />
  
            </div>
  
  
            <div className="mt-6 flex justify-end">
  
              <button
                type="button"
                disabled={
                  saving
                }
                onClick={
                  handleSave
                }
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
  
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save
                    size={16}
                  />
                )}
  
                {saving
                  ? "Saving..."
                  : "Save Changes"}
  
              </button>
  
            </div>
  
          </div>
  
        )}
  
      </div>
    );
  }
  
  
  function RateField({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
  
    onChange: (
      value: number
    ) => void;
  }) {
    return (
      <div>
  
        <label className="text-xs font-medium text-slate-400">
          {label}
        </label>
  
        <input
          type="number"
          min={1}
          value={
            value
          }
          disabled={false}
          onChange={(event) =>
            onChange(
              Number(
                event.target.value
              )
            )
          }
          className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
        />
  
      </div>
    );
  }
  
  
  function EmptyState() {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
  
        <p className="text-sm text-slate-400">
          No project available.
        </p>
  
        <p className="mt-2 text-xs text-slate-600">
          Create a project first to configure rate limits.
        </p>
  
      </div>
    );
  }