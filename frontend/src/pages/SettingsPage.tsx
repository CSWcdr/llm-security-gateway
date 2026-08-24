import {
    useState,
  } from "react";
  
  import {
    AlertTriangle,
    Building2,
    Database,
    DollarSign,
    Save,
    Server,
    Settings2,
    Trash2,
  } from "lucide-react";
  
  import { toast } from "sonner";
  
  type Environment =
    | "Production"
    | "Development";
  
  type LogRetention =
    | "7"
    | "30"
    | "90";
  
  export default function SettingsPage() {
    const [
      workspaceName,
      setWorkspaceName,
    ] = useState(
      "LLM Security Gateway"
    );
  
    const [
      environment,
      setEnvironment,
    ] =
      useState<Environment>(
        "Production"
      );
  
    const [
      defaultModel,
      setDefaultModel,
    ] = useState(
      "Gemini 2.5 Flash"
    );
  
    const [
      requestTimeout,
      setRequestTimeout,
    ] = useState(30);
  
    const [
      loggingEnabled,
      setLoggingEnabled,
    ] = useState(true);
  
    const [
      storePrompts,
      setStorePrompts,
    ] = useState(true);
  
    const [
      storeResponses,
      setStoreResponses,
    ] = useState(true);
  
    const [
      logRetention,
      setLogRetention,
    ] =
      useState<LogRetention>(
        "30"
      );
  
    const [
      costProtectionEnabled,
      setCostProtectionEnabled,
    ] = useState(true);
  
    const [
      monthlyBudget,
      setMonthlyBudget,
    ] = useState(100);
  
    const [
      blockWhenBudgetExceeded,
      setBlockWhenBudgetExceeded,
    ] = useState(false);
  
    function handleSave() {
      toast.success(
        "Gateway settings saved",
        {
          description:
            "Your configuration has been updated.",
        }
      );
    }
  
    function handleDeleteLogs() {
      const confirmed =
        window.confirm(
          "Delete all gateway request logs? This action cannot be undone."
        );
  
      if (!confirmed) {
        return;
      }
  
      toast.success(
        "Request logs deleted",
        {
          description:
            "This is currently a frontend simulation.",
        }
      );
    }
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
  
          <div>
  
            <div className="flex items-center gap-2">
  
              <Settings2
                size={20}
                className="text-blue-400"
              />
  
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Settings
              </h1>
  
            </div>
  
            <p className="mt-2 text-sm text-slate-500">
              Configure gateway defaults, logging, cost controls
              and workspace preferences.
            </p>
  
          </div>
  
          <button
            type="button"
            onClick={
              handleSave
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Save size={16} />
  
            Save Changes
          </button>
  
        </div>
  
        {/* Workspace */}
        <SettingsSection
          icon={Building2}
          title="Workspace"
          description="Basic configuration for this gateway workspace."
        >
  
          <div className="grid gap-5 md:grid-cols-2">
  
            <SettingField
              label="Workspace Name"
              description="Displayed throughout the dashboard."
            >
              <input
                value={
                  workspaceName
                }
                onChange={(
                  event
                ) =>
                  setWorkspaceName(
                    event.target
                      .value
                  )
                }
                className="settings-input"
              />
            </SettingField>
  
            <SettingField
              label="Environment"
              description="Default operating environment."
            >
              <select
                value={
                  environment
                }
                onChange={(
                  event
                ) =>
                  setEnvironment(
                    event.target
                      .value as Environment
                  )
                }
                className="settings-input"
              >
                <option>
                  Production
                </option>
  
                <option>
                  Development
                </option>
              </select>
            </SettingField>
  
          </div>
  
        </SettingsSection>
  
        {/* Gateway */}
        <SettingsSection
          icon={Server}
          title="Gateway Defaults"
          description="Default behavior for requests processed through the gateway."
        >
  
          <div className="grid gap-5 md:grid-cols-2">
  
            <SettingField
              label="Default Model"
              description="Used when a request does not specify a model."
            >
  
              <select
                value={
                  defaultModel
                }
                onChange={(
                  event
                ) =>
                  setDefaultModel(
                    event.target
                      .value
                  )
                }
                className="settings-input"
              >
                <option>
                  Gemini 2.5 Flash
                </option>
  
                <option>
                  Gemini 2.5 Pro
                </option>
  
                <option>
                  GPT-4o
                </option>
  
                <option>
                  Claude Sonnet
                </option>
              </select>
  
            </SettingField>
  
            <SettingField
              label="Request Timeout"
              description="Maximum time allowed for an upstream LLM request."
            >
  
              <div className="relative">
  
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={
                    requestTimeout
                  }
                  onChange={(
                    event
                  ) =>
                    setRequestTimeout(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="settings-input pr-20"
                />
  
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                  seconds
                </span>
  
              </div>
  
            </SettingField>
  
          </div>
  
        </SettingsSection>
  
        {/* Logging */}
        <SettingsSection
          icon={Database}
          title="Request Logging"
          description="Control what gateway request information is retained."
        >
  
          <div className="space-y-4">
  
            <ToggleSetting
              title="Enable request logging"
              description="Store structured metadata for gateway requests."
              enabled={
                loggingEnabled
              }
              onChange={() =>
                setLoggingEnabled(
                  (current) =>
                    !current
                )
              }
            />
  
            <ToggleSetting
              title="Store prompt content"
              description="Retain user prompts inside request logs."
              enabled={
                storePrompts
              }
              disabled={
                !loggingEnabled
              }
              onChange={() =>
                setStorePrompts(
                  (current) =>
                    !current
                )
              }
            />
  
            <ToggleSetting
              title="Store response content"
              description="Retain LLM output inside request logs."
              enabled={
                storeResponses
              }
              disabled={
                !loggingEnabled
              }
              onChange={() =>
                setStoreResponses(
                  (current) =>
                    !current
                )
              }
            />
  
            <div className="border-t border-slate-800 pt-5">
  
              <SettingField
                label="Log Retention"
                description="Automatically delete request logs older than this period."
              >
  
                <select
                  value={
                    logRetention
                  }
                  disabled={
                    !loggingEnabled
                  }
                  onChange={(
                    event
                  ) =>
                    setLogRetention(
                      event.target
                        .value as LogRetention
                    )
                  }
                  className="settings-input max-w-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <option value="7">
                    7 days
                  </option>
  
                  <option value="30">
                    30 days
                  </option>
  
                  <option value="90">
                    90 days
                  </option>
                </select>
  
              </SettingField>
  
            </div>
  
          </div>
  
        </SettingsSection>
  
        {/* Cost */}
        <SettingsSection
          icon={DollarSign}
          title="Cost Protection"
          description="Prevent unexpected LLM spending."
        >
  
          <div className="space-y-5">
  
            <ToggleSetting
              title="Enable cost protection"
              description="Track spending against a configured monthly budget."
              enabled={
                costProtectionEnabled
              }
              onChange={() =>
                setCostProtectionEnabled(
                  (current) =>
                    !current
                )
              }
            />
  
            <div className="grid gap-5 border-t border-slate-800 pt-5 md:grid-cols-2">
  
              <SettingField
                label="Monthly Budget"
                description="Workspace-wide estimated AI spending limit."
              >
  
                <div className="relative">
  
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    $
                  </span>
  
                  <input
                    type="number"
                    min={1}
                    value={
                      monthlyBudget
                    }
                    disabled={
                      !costProtectionEnabled
                    }
                    onChange={(
                      event
                    ) =>
                      setMonthlyBudget(
                        Number(
                          event.target
                            .value
                        )
                      )
                    }
                    className="settings-input pl-8 disabled:cursor-not-allowed disabled:opacity-40"
                  />
  
                </div>
  
              </SettingField>
  
              <div className="flex items-end">
  
                <ToggleSetting
                  title="Block requests at budget limit"
                  description="Reject new LLM requests after the monthly limit is reached."
                  enabled={
                    blockWhenBudgetExceeded
                  }
                  disabled={
                    !costProtectionEnabled
                  }
                  onChange={() =>
                    setBlockWhenBudgetExceeded(
                      (current) =>
                        !current
                    )
                  }
                />
  
              </div>
  
            </div>
  
          </div>
  
        </SettingsSection>
  
        {/* Cost explanation */}
        <div className="flex gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/5 p-4">
  
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0 text-amber-400"
          />
  
          <div>
  
            <p className="text-sm font-medium text-amber-300">
              Cost limits are calculated by the gateway
            </p>
  
            <p className="mt-1 text-xs leading-5 text-amber-200/50">
              The production backend will calculate cost from model,
              input tokens and output tokens before updating usage
              records.
            </p>
  
          </div>
  
        </div>
  
        {/* Danger zone */}
        <div className="rounded-2xl border border-red-500/15 bg-red-500/3">
  
          <div className="border-b border-red-500/10 p-5">
  
            <div className="flex items-center gap-2">
  
              <Trash2
                size={17}
                className="text-red-400"
              />
  
              <h2 className="text-sm font-semibold text-red-300">
                Danger Zone
              </h2>
  
            </div>
  
            <p className="mt-1 text-xs text-slate-600">
              Destructive workspace actions.
            </p>
  
          </div>
  
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
  
            <div>
  
              <p className="text-sm font-medium text-slate-300">
                Delete request logs
              </p>
  
              <p className="mt-1 text-xs text-slate-600">
                Permanently remove stored gateway request history.
              </p>
  
            </div>
  
            <button
              type="button"
              onClick={
                handleDeleteLogs
              }
              className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Delete Logs
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  type IconType =
    typeof Settings2;
  
  function SettingsSection({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: IconType;
    title: string;
    description: string;
    children:
      React.ReactNode;
  }) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
        <div className="border-b border-slate-800 p-5">
  
          <div className="flex items-center gap-2">
  
            <Icon
              size={17}
              className="text-blue-400"
            />
  
            <h2 className="text-sm font-semibold text-white">
              {title}
            </h2>
  
          </div>
  
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
  
        </div>
  
        <div className="p-5">
          {children}
        </div>
  
      </section>
    );
  }
  
  function SettingField({
    label,
    description,
    children,
  }: {
    label: string;
    description: string;
    children:
      React.ReactNode;
  }) {
    return (
      <div>
  
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
  
        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>
  
        <div className="mt-3">
          {children}
        </div>
  
      </div>
    );
  }
  
  function ToggleSetting({
    title,
    description,
    enabled,
    disabled = false,
    onChange,
  }: {
    title: string;
    description: string;
    enabled: boolean;
    disabled?: boolean;
    onChange: () => void;
  }) {
    return (
      <div
        className={`flex w-full items-center justify-between gap-5 rounded-xl border border-slate-800 bg-slate-950/30 p-4 ${
          disabled
            ? "opacity-40"
            : ""
        }`}
      >
  
        <div>
  
          <p className="text-sm font-medium text-slate-300">
            {title}
          </p>
  
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
  
        </div>
  
        <button
          type="button"
          disabled={
            disabled
          }
          onClick={
            onChange
          }
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${
            enabled
              ? "bg-blue-600"
              : "bg-slate-700"
          } disabled:cursor-not-allowed`}
        >
  
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
              enabled
                ? "left-6"
                : "left-1"
            }`}
          />
  
        </button>
  
      </div>
    );
  }