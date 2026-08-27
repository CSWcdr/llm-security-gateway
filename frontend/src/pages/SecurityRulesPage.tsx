import {
    useEffect,
    useState,
  } from "react";
  
  import {
    Loader2,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    toast,
  } from "sonner";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import {
    useSecurityPolicies,
  } from "../hooks/useSecurityPolicies";
  
  import type {
    SecurityAction,
  } from "../context/SecurityPoliciesContext";
  
  
  const ACTIONS:
    SecurityAction[] = [
      "BLOCK",
      "WARN",
      "MASK",
      "ALLOW",
    ];
  
  
  export default function SecurityRulesPage() {
    const {
      projects,
    } = useProjects();
  
    const {
      getSecurityPolicy,
      updateSecurityPolicy,
      loading,
    } =
      useSecurityPolicies();
  
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] = useState("");
  
  
    const [
      savingRule,
      setSavingRule,
    ] = useState<
      string | null
    >(null);
  
  
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
  
  
    const policy =
      selectedProjectId
        ? getSecurityPolicy(
            selectedProjectId
          )
        : undefined;
  
  
    async function saveChange(
      ruleName: string,
      update: Record<
        string,
        boolean | SecurityAction
      >
    ) {
      if (!selectedProjectId) {
        return;
      }
  
      try {
        setSavingRule(
          ruleName
        );
  
        await updateSecurityPolicy(
          selectedProjectId,
          update
        );
  
        toast.success(
          "Security policy updated"
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update security policy."
        );
      } finally {
        setSavingRule(null);
      }
    }
  
  
    return (
      <div className="space-y-6">
  
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
  
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Security Rules
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Configure how the gateway handles risky prompts and model output.
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
  
  
        <div className="flex gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4">
  
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-blue-400"
          />
  
          <div>
            <p className="text-sm font-medium text-blue-300">
              Project-specific protection
            </p>
  
            <p className="mt-1 text-xs leading-5 text-blue-200/50">
              Each project can independently block, warn, mask, or allow detected security findings.
            </p>
          </div>
  
        </div>
  
  
        {loading && !policy ? (
  
          <div className="flex items-center justify-center py-20">
  
            <Loader2
              size={24}
              className="animate-spin text-blue-400"
            />
  
            <span className="ml-3 text-sm text-slate-500">
              Loading security policy...
            </span>
  
          </div>
  
        ) : !selectedProjectId ? (
  
          <EmptyState />
  
        ) : !policy ? (
  
          <EmptyState />
  
        ) : (
  
          <div className="grid gap-4">
  
            <RuleCard
              title="Prompt Injection Protection"
              description="Detect attempts to override or manipulate system instructions."
              enabled={
                policy.promptInjectionEnabled
              }
              action={
                policy.promptInjectionAction
              }
              saving={
                savingRule ===
                "prompt-injection"
              }
              onEnabledChange={(
                enabled
              ) =>
                saveChange(
                  "prompt-injection",
                  {
                    promptInjectionEnabled:
                      enabled,
                  }
                )
              }
              onActionChange={(
                action
              ) =>
                saveChange(
                  "prompt-injection",
                  {
                    promptInjectionAction:
                      action,
                  }
                )
              }
            />
  
  
            <RuleCard
              title="PII Detection"
              description="Detect personal information such as email addresses and phone numbers."
              enabled={
                policy.piiDetectionEnabled
              }
              action={
                policy.piiDetectionAction
              }
              saving={
                savingRule ===
                "pii"
              }
              onEnabledChange={(
                enabled
              ) =>
                saveChange(
                  "pii",
                  {
                    piiDetectionEnabled:
                      enabled,
                  }
                )
              }
              onActionChange={(
                action
              ) =>
                saveChange(
                  "pii",
                  {
                    piiDetectionAction:
                      action,
                  }
                )
              }
            />
  
  
            <RuleCard
              title="Secret Detection"
              description="Detect API keys, passwords, tokens, and other sensitive credentials."
              enabled={
                policy.secretDetectionEnabled
              }
              action={
                policy.secretDetectionAction
              }
              saving={
                savingRule ===
                "secret"
              }
              onEnabledChange={(
                enabled
              ) =>
                saveChange(
                  "secret",
                  {
                    secretDetectionEnabled:
                      enabled,
                  }
                )
              }
              onActionChange={(
                action
              ) =>
                saveChange(
                  "secret",
                  {
                    secretDetectionAction:
                      action,
                  }
                )
              }
            />
  
  
            <RuleCard
              title="Output Scanning"
              description="Inspect model responses before they are returned to the client."
              enabled={
                policy.outputScanningEnabled
              }
              action={
                policy.outputScanningAction
              }
              saving={
                savingRule ===
                "output"
              }
              onEnabledChange={(
                enabled
              ) =>
                saveChange(
                  "output",
                  {
                    outputScanningEnabled:
                      enabled,
                  }
                )
              }
              onActionChange={(
                action
              ) =>
                saveChange(
                  "output",
                  {
                    outputScanningAction:
                      action,
                  }
                )
              }
            />
  
          </div>
  
        )}
  
      </div>
    );
  }
  
  
  function RuleCard({
    title,
    description,
    enabled,
    action,
    saving,
    onEnabledChange,
    onActionChange,
  }: {
    title: string;
    description: string;
  
    enabled: boolean;
    action: SecurityAction;
    saving: boolean;
  
    onEnabledChange: (
      enabled: boolean
    ) => void;
  
    onActionChange: (
      action: SecurityAction
    ) => void;
  }) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
  
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
  
          <div className="max-w-xl">
  
            <div className="flex items-center gap-3">
  
              <h2 className="text-sm font-semibold text-white">
                {title}
              </h2>
  
              {saving && (
                <Loader2
                  size={14}
                  className="animate-spin text-blue-400"
                />
              )}
  
            </div>
  
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {description}
            </p>
  
          </div>
  
  
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
  
            <button
              type="button"
              onClick={() =>
                onEnabledChange(
                  !enabled
                )
              }
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                enabled
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {enabled
                ? "Enabled"
                : "Disabled"}
            </button>
  
  
            <select
              value={action}
              disabled={
                !enabled ||
                saving
              }
              onChange={(event) =>
                onActionChange(
                  event.target
                    .value as SecurityAction
                )
              }
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ACTIONS.map(
                (securityAction) => (
                  <option
                    key={
                      securityAction
                    }
                    value={
                      securityAction
                    }
                  >
                    {securityAction}
                  </option>
                )
              )}
            </select>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  
  function EmptyState() {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
  
        <p className="text-sm text-slate-400">
          No project selected.
        </p>
  
        <p className="mt-2 text-xs text-slate-600">
          Create a project first to configure security rules.
        </p>
  
      </div>
    );
  }