import {
    Activity,
    ArrowLeft,
    Ban,
    Clock3,
    DollarSign,
    KeyRound,
    Settings2,
    ShieldCheck,
    TerminalSquare,
  } from "lucide-react";
  
  import {
    Link,
    useParams,
  } from "react-router-dom";
  
  import { useProjects } from "../hooks/useProjects";
  
  export default function ProjectDetailsPage() {
    const { projectId } =
      useParams<{ projectId: string }>();
  
    const { getProjectById } =
      useProjects();
  
    const project = projectId
      ? getProjectById(projectId)
      : undefined;
  
    if (!project) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
  
          <h1 className="text-xl font-semibold text-white">
            Project not found
          </h1>
  
          <p className="mt-2 text-sm text-slate-500">
            The project may have been removed or the URL is invalid.
          </p>
  
          <Link
            to="/projects"
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Back to Projects
          </Link>
  
        </div>
      );
    }
  
    const blockedPercentage =
      project.requests === 0
        ? 0
        : (
            (project.blockedRequests /
              project.requests) *
            100
          ).toFixed(1);
  
    return (
      <div className="space-y-6">
  
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
  
          Projects
        </Link>
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
  
          <div>
  
            <div className="flex flex-wrap items-center gap-3">
  
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                {project.name}
              </h1>
  
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  project.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {project.status}
              </span>
  
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                {project.environment}
              </span>
  
            </div>
  
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {project.description}
            </p>
  
            <p className="mt-3 font-mono text-xs text-slate-600">
              {project.id}
            </p>
  
          </div>
  
          <div className="flex flex-wrap gap-2">
  
            <Link
              to="/playground"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              <TerminalSquare size={16} />
  
              Test Gateway
            </Link>
  
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500">
              <Settings2 size={16} />
  
              Configure
            </button>
  
          </div>
  
        </div>
  
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <Metric
            title="Requests"
            value={project.requests.toLocaleString()}
            description="Total gateway requests"
            icon={Activity}
            iconStyle="bg-blue-500/10 text-blue-400"
          />
  
          <Metric
            title="Blocked"
            value={project.blockedRequests.toString()}
            description={`${blockedPercentage}% of requests`}
            icon={Ban}
            iconStyle="bg-red-500/10 text-red-400"
          />
  
          <Metric
            title="API Keys"
            value={project.apiKeys.toString()}
            description="Active credentials"
            icon={KeyRound}
            iconStyle="bg-violet-500/10 text-violet-400"
          />
  
          <Metric
            title="Estimated Cost"
            value="$8.42"
            description="Current billing period"
            icon={DollarSign}
            iconStyle="bg-emerald-500/10 text-emerald-400"
          />
  
        </div>
  
        {/* Main area */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
  
          {/* Request activity */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
            <div className="border-b border-slate-800 p-5">
              <h2 className="font-semibold text-white">
                Gateway Activity
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Current operational status for this project.
              </p>
            </div>
  
            <div className="grid gap-4 p-5 md:grid-cols-2">
  
              <StatusItem
                label="Gateway"
                value="Operational"
                icon={ShieldCheck}
                status="success"
              />
  
              <StatusItem
                label="Average Latency"
                value="842 ms"
                icon={Clock3}
              />
  
              <StatusItem
                label="Prompt Security"
                value="Enabled"
                icon={ShieldCheck}
                status="success"
              />
  
              <StatusItem
                label="Rate Limiting"
                value="1,000 req/hour"
                icon={Activity}
              />
  
            </div>
  
          </div>
  
          {/* Security */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
            <div className="border-b border-slate-800 p-5">
  
              <h2 className="font-semibold text-white">
                Security
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Active protection controls.
              </p>
  
            </div>
  
            <div className="space-y-4 p-5">
  
              <SecurityControl
                name="Prompt Injection"
                enabled
              />
  
              <SecurityControl
                name="PII Detection"
                enabled
              />
  
              <SecurityControl
                name="Secret Detection"
                enabled
              />
  
              <SecurityControl
                name="Output Scanning"
                enabled
              />
  
            </div>
  
            <div className="border-t border-slate-800 p-5">
  
              <Link
                to="/security"
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                Manage security policies →
              </Link>
  
            </div>
  
          </div>
  
        </div>
  
        {/* Resources */}
        <div>
  
          <h2 className="mb-4 text-base font-semibold text-white">
            Project Resources
          </h2>
  
          <div className="grid gap-4 md:grid-cols-3">
  
            <ResourceCard
              icon={KeyRound}
              title="API Keys"
              description="Create and revoke credentials used by applications."
              link="/api-keys"
            />
  
            <ResourceCard
              icon={ShieldCheck}
              title="Security Rules"
              description="Configure prompt and response protection policies."
              link="/security"
            />
  
            <ResourceCard
              icon={Activity}
              title="Request Logs"
              description="Inspect requests processed by the gateway."
              link="/logs"
            />
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  /* ------------------------
     Local helper components
  ------------------------- */
  
  type IconComponent =
    typeof Activity;
  
  function Metric({
    title,
    value,
    description,
    icon: Icon,
    iconStyle,
  }: {
    title: string;
    value: string;
    description: string;
    icon: IconComponent;
    iconStyle: string;
  }) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
  
        <div className="flex items-start justify-between">
  
          <div>
            <p className="text-xs text-slate-500">
              {title}
            </p>
  
            <p className="mt-2 text-2xl font-semibold text-white">
              {value}
            </p>
  
            <p className="mt-2 text-xs text-slate-600">
              {description}
            </p>
          </div>
  
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}
          >
            <Icon size={18} />
          </div>
  
        </div>
  
      </div>
    );
  }
  
  function StatusItem({
    label,
    value,
    icon: Icon,
    status,
  }: {
    label: string;
    value: string;
    icon: IconComponent;
    status?: "success";
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
  
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Icon size={14} />
  
          {label}
        </div>
  
        <p
          className={`mt-2 text-sm font-medium ${
            status === "success"
              ? "text-emerald-400"
              : "text-slate-200"
          }`}
        >
          {value}
        </p>
  
      </div>
    );
  }
  
  function SecurityControl({
    name,
    enabled,
  }: {
    name: string;
    enabled: boolean;
  }) {
    return (
      <div className="flex items-center justify-between">
  
        <span className="text-sm text-slate-400">
          {name}
        </span>
  
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
            enabled
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          {enabled
            ? "Enabled"
            : "Disabled"}
        </span>
  
      </div>
    );
  }
  
  function ResourceCard({
    icon: Icon,
    title,
    description,
    link,
  }: {
    icon: IconComponent;
    title: string;
    description: string;
    link: string;
  }) {
    return (
      <Link
        to={link}
        className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:-translate-y-0.5 hover:border-slate-700"
      >
  
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <Icon size={18} />
        </div>
  
        <h3 className="mt-4 text-sm font-semibold text-white">
          {title}
        </h3>
  
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
  
        <p className="mt-4 text-xs font-medium text-blue-400">
          Open →
        </p>
  
      </Link>
    );
  }