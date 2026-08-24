import {
    useState,
  } from "react";
  
  import {
    Info,
    Save,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    toast,
  } from "sonner";
  
  import PolicySummary from "../components/security/PolicySummary";
  import SecurityRuleCard from "../components/security/SecurityRuleCard";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import {
    useSecurityPolicies,
  } from "../hooks/useSecurityPolicies";
  
  export default function SecurityRulesPage() {
    const {
      projects,
    } =
      useProjects();
  
    const {
      getPolicyByProjectId,
      toggleRule,
      updateRuleAction,
    } =
      useSecurityPolicies();
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] =
      useState(
        projects[0]?.id ??
          ""
      );
  
    /*
     * If the selected project still
     * exists, use it.
     *
     * Otherwise fall back to the first
     * available project.
     *
     * This avoids using useEffect +
     * setState just to synchronize state.
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
        "Security policy saved",
        {
          description:
            "Changes will apply to future gateway requests.",
        }
      );
    }
  
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={20}
                className="text-blue-400"
              />
  
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Security Rules
              </h1>
            </div>
  
            <p className="mt-2 text-sm text-slate-500">
              Configure how the gateway handles
              security threats and sensitive data.
            </p>
          </div>
  
          <button
            type="button"
            onClick={
              handleSave
            }
            disabled={!policy}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save
              size={16}
            />
  
            Save Policy
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
              Project-specific security policies
            </p>
  
            <p className="mt-1 text-xs leading-5 text-blue-200/50">
              Each project can define its own
              security behavior. A rule can block,
              warn, mask or allow detected content
              depending on the application's
              requirements.
            </p>
          </div>
        </div>
  
        {/* Project selector */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Project Policy
              </p>
  
              <p className="mt-1 text-xs text-slate-600">
                Select the application whose
                security configuration you want
                to manage.
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
          /* Empty policy */
          <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
            <ShieldCheck
              size={28}
              className="mx-auto text-slate-700"
            />
  
            <p className="mt-4 text-sm text-slate-400">
              No security policy configured.
            </p>
  
            <p className="mt-2 text-xs text-slate-600">
              This project will receive a default
              policy when backend persistence is
              implemented.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <PolicySummary
              policy={
                policy
              }
            />
  
            {/* Protection rules title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Protection Rules
                </h2>
  
                <p className="mt-1 text-xs text-slate-600">
                  Last updated{" "}
                  {
                    policy.updatedAt
                  }
                </p>
              </div>
            </div>
  
            {/* Rules */}
            <div className="grid gap-4 xl:grid-cols-2">
              {policy.rules.map(
                (rule) => (
                  <SecurityRuleCard
                    key={
                      rule.id
                    }
                    rule={
                      rule
                    }
                    onToggle={() =>
                      toggleRule(
                        policy.projectId,
                        rule.id
                      )
                    }
                    onActionChange={(
                      action
                    ) =>
                      updateRuleAction(
                        policy.projectId,
                        rule.id,
                        action
                      )
                    }
                  />
                )
              )}
            </div>
  
            {/* Action descriptions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5">
              <h2 className="text-sm font-semibold text-white">
                Policy Actions
              </h2>
  
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <ActionInfo
                  action="Block"
                  description="Stop the request before it reaches the LLM."
                  style="text-red-400"
                />
  
                <ActionInfo
                  action="Warn"
                  description="Allow the request but record a security warning."
                  style="text-amber-400"
                />
  
                <ActionInfo
                  action="Mask"
                  description="Redact sensitive values before forwarding."
                  style="text-violet-400"
                />
  
                <ActionInfo
                  action="Allow"
                  description="Record detection but continue without modification."
                  style="text-emerald-400"
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  function ActionInfo({
    action,
    description,
    style,
  }: {
    action: string;
    description: string;
    style: string;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
        <p
          className={`text-sm font-medium ${style}`}
        >
          {action}
        </p>
  
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {description}
        </p>
      </div>
    );
  }