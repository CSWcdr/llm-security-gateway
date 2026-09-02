import {
    useEffect,
    useState,
  } from "react";
  
  import {
    Activity,
    ArrowLeft,
    Clock3,
    Coins,
    Cpu,
    Hash,
    KeyRound,
    Loader2,
    ShieldAlert,
    ShieldCheck,
  } from "lucide-react";
  
  import {
    Link,
    useParams,
  } from "react-router-dom";
  
  import RequestStatusBadge from "../components/logs/RequestStatusBadge";
  
  import {
    getRequestLogById,
  } from "../services/logs.service";
  
  import type {
    GatewayRequestLog,
  } from "../types";
  
  
  export default function RequestDetailsPage() {
    const {
      requestId,
    } =
      useParams<{
        requestId: string;
      }>();
  
  
    const [
      request,
      setRequest,
    ] =
      useState<
        GatewayRequestLog | null
      >(null);
  
  
    const [
      loading,
      setLoading,
    ] =
      useState(true);
  
  
    const [
      error,
      setError,
    ] =
      useState("");
  
  
    useEffect(() => {
      if (!requestId) {
        setLoading(false);
  
        setError(
          "Invalid request ID."
        );
  
        return;
      }
  
      let active = true;
  
  
      async function loadRequest() {
        try {
          setLoading(true);
  
          setError("");
  
          const result =
            await getRequestLogById(
              requestId!
            );
  
          if (active) {
            setRequest(result);
          }
        } catch (error) {
          if (!active) {
            return;
          }
  
          setRequest(null);
  
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load request."
          );
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
  
  
      void loadRequest();
  
  
      return () => {
        active = false;
      };
    }, [
      requestId,
    ]);
  
  
    if (loading) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
  
          <Loader2
            size={26}
            className="animate-spin text-blue-400"
          />
  
          <span className="ml-3 text-sm text-slate-500">
            Loading request details...
          </span>
  
        </div>
      );
    }
  
  
    if (
      error ||
      !request
    ) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
  
          <ShieldAlert
            size={30}
            className="text-red-400"
          />
  
          <h1 className="mt-4 text-xl font-semibold text-white">
            Request not found
          </h1>
  
          <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
            {error ||
              "The request ID may be invalid."}
          </p>
  
          <Link
            to="/logs"
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            Back to Logs
          </Link>
  
        </div>
      );
    }
  
  
    const totalTokens =
      request.inputTokens +
      request.outputTokens;
  
  
    const blocked =
      request.status ===
      "Blocked";
  
  
    return (
      <div className="space-y-6">
  
        {/* Back */}
        <Link
          to="/logs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft
            size={16}
          />
  
          Request Logs
        </Link>
  
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
  
          <div>
  
            <div className="flex flex-wrap items-center gap-3">
  
              <h1 className="break-all font-mono text-xl font-semibold text-white">
                {request.id}
              </h1>
  
              <RequestStatusBadge
                status={
                  request.status
                }
              />
  
            </div>
  
  
            <p className="mt-2 text-sm text-slate-500">
              Real gateway execution details and security analysis.
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
              6
            )}`}
          />
  
        </div>
  
  
        {/* Request + Response */}
        <div className="grid gap-6 xl:grid-cols-2">
  
          {/* Request */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
            <div className="border-b border-slate-800 p-5">
  
              <h2 className="text-sm font-semibold text-white">
                Processed Request
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Safe prompt stored after security processing and masking.
              </p>
  
            </div>
  
  
            <div className="p-5">
  
              <div className="min-h-40 rounded-xl border border-slate-800 bg-slate-950 p-4">
  
                <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-slate-300">
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
                Response Preview
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Safe output preview retained by the gateway.
              </p>
  
            </div>
  
  
            <div className="p-5">
  
              {request.responsePreview ? (
  
                <div className="min-h-40 rounded-xl border border-slate-800 bg-slate-950 p-4">
  
                  <pre className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-7 text-slate-300">
                    {
                      request.responsePreview
                    }
                  </pre>
  
                </div>
  
              ) : (
  
                <div
                  className={`flex min-h-40 items-center justify-center rounded-xl border ${
                    blocked
                      ? "border-red-500/10 bg-red-500/5"
                      : "border-slate-800 bg-slate-950"
                  }`}
                >
  
                  <div className="max-w-xs text-center">
  
                    <ShieldAlert
                      size={22}
                      className={`mx-auto ${
                        blocked
                          ? "text-red-400"
                          : "text-slate-600"
                      }`}
                    />
  
                    <p
                      className={`mt-3 text-sm font-medium ${
                        blocked
                          ? "text-red-400"
                          : "text-slate-400"
                      }`}
                    >
                      {blocked
                        ? "Request blocked"
                        : "No response preview"}
                    </p>
  
                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {blocked
                        ? request.model ===
                          "Not called"
                          ? "Security stopped this request before the LLM provider was called."
                          : "The gateway blocked the response during security processing."
                        : "No response preview was stored for this request."}
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
              Findings generated during real input and output security processing.
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
  
                      <div className="flex flex-wrap items-center gap-2">
  
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
                  The request passed the configured security checks.
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
  
  
            <TechnicalItem
              icon={Hash}
              label="Total Tokens"
              value={
                totalTokens.toString()
              }
            />
  
          </div>
  
  
          <div className="border-t border-slate-800 px-5 py-4">
  
            <p className="break-all text-xs text-slate-600">
              Project ID:{" "}
              <span className="font-mono text-slate-400">
                {
                  request.projectId
                }
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
  
          <Icon
            size={14}
          />
  
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
  
          <Icon
            size={13}
          />
  
          {label}
  
        </div>
  
  
        <p className="mt-2 break-all font-mono text-xs text-slate-300">
          {value}
        </p>
  
      </div>
    );
  }