import {
    Activity,
    ArrowLeft,
    Clock3,
    Coins,
    Cpu,
    Globe2,
    Hash,
    KeyRound,
    ShieldAlert,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    Link,
    useParams,
  } from "react-router-dom";
  
  import RequestStatusBadge from "../components/logs/RequestStatusBadge";
  
  import {
    mockRequestLogs,
  } from "../data/mockData";
  
  export default function RequestDetailsPage() {
    const { requestId } =
      useParams<{
        requestId: string;
      }>();
  
    const request =
      mockRequestLogs.find(
        (request) =>
          request.id ===
          requestId
      );
  
    if (!request) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
  
          <h1 className="text-xl font-semibold text-white">
            Request not found
          </h1>
  
          <p className="mt-2 text-sm text-slate-500">
            The request ID may be invalid.
          </p>
  
          <Link
            to="/logs"
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to Logs
          </Link>
  
        </div>
      );
    }
  
    const totalTokens =
      request.inputTokens +
      request.outputTokens;
  
    return (
      <div className="space-y-6">
  
        {/* Back */}
        <Link
          to="/logs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
  
          Request Logs
        </Link>
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
  
          <div>
  
            <div className="flex flex-wrap items-center gap-3">
  
              <h1 className="font-mono text-xl font-semibold text-white">
                {request.id}
              </h1>
  
              <RequestStatusBadge
                status={
                  request.status
                }
              />
  
            </div>
  
            <p className="mt-2 text-sm text-slate-500">
              Gateway request execution details and security analysis.
            </p>
  
          </div>
  
          <p className="text-xs text-slate-600">
            {new Date(
              request.createdAt
            ).toLocaleString()}
          </p>
  
        </div>
  
        {/* Metadata */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  
          <MetadataCard
            icon={Activity}
            label="Project"
            value={
              request.projectName
            }
          />
  
          <MetadataCard
            icon={Cpu}
            label="Model"
            value={
              request.model
            }
          />
  
          <MetadataCard
            icon={Clock3}
            label="Latency"
            value={`${request.latencyMs} ms`}
          />
  
          <MetadataCard
            icon={Coins}
            label="Estimated Cost"
            value={`$${request.estimatedCost.toFixed(
              4
            )}`}
          />
  
        </div>
  
        {/* Request / Response */}
        <div className="grid gap-6 xl:grid-cols-2">
  
          {/* Request */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
            <div className="border-b border-slate-800 p-5">
  
              <h2 className="text-sm font-semibold text-white">
                Request
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Prompt received by the gateway.
              </p>
  
            </div>
  
            <div className="p-5">
  
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
  
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                  {
                    request.promptPreview
                  }
                </pre>
  
              </div>
  
            </div>
  
          </div>
  
          {/* Response */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
            <div className="border-b border-slate-800 p-5">
  
              <h2 className="text-sm font-semibold text-white">
                Response
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Output returned after security processing.
              </p>
  
            </div>
  
            <div className="p-5">
  
              {request.responsePreview ? (
  
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
  
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                    {
                      request.responsePreview
                    }
                  </pre>
  
                </div>
  
              ) : (
  
                <div className="flex min-h-32.5 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5">
  
                  <div className="max-w-xs text-center">
  
                    <ShieldAlert
                      size={22}
                      className="mx-auto text-red-400"
                    />
  
                    <p className="mt-3 text-sm font-medium text-red-400">
                      Request blocked
                    </p>
  
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      The gateway stopped this request before it reached the LLM provider.
                    </p>
  
                  </div>
  
                </div>
  
              )}
  
            </div>
  
          </div>
  
        </div>
  
        {/* Security */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="border-b border-slate-800 p-5">
  
            <div className="flex items-center gap-2">
  
              <ShieldCheck
                size={17}
                className="text-blue-400"
              />
  
              <h2 className="text-sm font-semibold text-white">
                Security Analysis
              </h2>
  
            </div>
  
            <p className="mt-1 text-xs text-slate-500">
              Security findings generated during gateway processing.
            </p>
  
          </div>
  
          {request.securityFindings.length >
          0 ? (
  
            <div className="divide-y divide-slate-800">
  
              {request.securityFindings.map(
                (finding) => (
                  <div
                    key={
                      finding.id
                    }
                    className="flex gap-4 p-5"
                  >
  
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        finding.severity ===
                        "High"
                          ? "bg-red-500/10 text-red-400"
                          : finding.severity ===
                            "Medium"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      <ShieldAlert
                        size={18}
                      />
                    </div>
  
                    <div>
  
                      <div className="flex items-center gap-2">
  
                        <p className="text-sm font-medium text-slate-200">
                          {
                            finding.type
                          }
                        </p>
  
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            finding.severity ===
                            "High"
                              ? "bg-red-500/10 text-red-400"
                              : finding.severity ===
                                "Medium"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {
                            finding.severity
                          }
                        </span>
  
                      </div>
  
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {
                          finding.message
                        }
                      </p>
  
                    </div>
  
                  </div>
                )
              )}
  
            </div>
  
          ) : (
  
            <div className="flex items-center gap-3 p-5">
  
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
  
                <ShieldCheck
                  size={18}
                />
  
              </div>
  
              <div>
  
                <p className="text-sm font-medium text-emerald-400">
                  No security threats detected
                </p>
  
                <p className="mt-1 text-xs text-slate-600">
                  The request passed all configured security checks.
                </p>
  
              </div>
  
            </div>
  
          )}
  
        </div>
  
        {/* Technical Metadata */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="border-b border-slate-800 p-5">
  
            <h2 className="text-sm font-semibold text-white">
              Technical Metadata
            </h2>
  
          </div>
  
          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
  
            <TechnicalItem
              icon={KeyRound}
              label="API Key"
              value={
                request.apiKeyName
              }
            />
  
            <TechnicalItem
              icon={Globe2}
              label="IP Address"
              value={
                request.ipAddress
              }
            />
  
            <TechnicalItem
              icon={Hash}
              label="Input Tokens"
              value={
                request.inputTokens.toString()
              }
            />
  
            <TechnicalItem
              icon={Hash}
              label="Output Tokens"
              value={
                request.outputTokens.toString()
              }
            />
  
          </div>
  
          <div className="border-t border-slate-800 px-5 py-4">
  
            <p className="text-xs text-slate-600">
              Total tokens:{" "}
              <span className="font-medium text-slate-400">
                {totalTokens}
              </span>
            </p>
  
          </div>
  
        </div>
  
      </div>
    );
  }
  
  type IconComponent =
    typeof Activity;
  
  function MetadataCard({
    icon: Icon,
    label,
    value,
  }: {
    icon: IconComponent;
    label: string;
    value: string;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
  
        <div className="flex items-center gap-2 text-xs text-slate-500">
  
          <Icon size={14} />
  
          {label}
  
        </div>
  
        <p className="mt-2 truncate text-sm font-medium text-slate-200">
          {value}
        </p>
  
      </div>
    );
  }
  
  function TechnicalItem({
    icon: Icon,
    label,
    value,
  }: {
    icon: IconComponent;
    label: string;
    value: string;
  }) {
    return (
      <div>
  
        <div className="flex items-center gap-2 text-xs text-slate-600">
  
          <Icon size={13} />
  
          {label}
  
        </div>
  
        <p className="mt-2 break-all font-mono text-xs text-slate-300">
          {value}
        </p>
  
      </div>
    );
  }