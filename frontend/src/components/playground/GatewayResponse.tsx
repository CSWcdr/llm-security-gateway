import {
    Activity,
    Clock3,
    Coins,
    Cpu,
    Hash,
  } from "lucide-react";
  
  import type {
    GatewayRequestResult,
  } from "../../types";
  
  type GatewayResponseProps = {
    result: GatewayRequestResult;
  };
  
  export default function GatewayResponse({
    result,
  }: GatewayResponseProps) {
    return (
      <div className="space-y-4">
  
        {/* Status */}
        <div
          className={`rounded-2xl border p-5 ${
            result.status ===
            "allowed"
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-red-500/20 bg-red-500/5"
          }`}
        >
          <div className="flex items-center justify-between">
  
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Gateway Decision
              </p>
  
              <p
                className={`mt-2 text-lg font-semibold ${
                  result.status ===
                  "allowed"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {result.status ===
                "allowed"
                  ? "Request Allowed"
                  : "Request Blocked"}
              </p>
            </div>
  
            <Activity
              size={24}
              className={
                result.status ===
                "allowed"
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            />
  
          </div>
        </div>
  
        {/* Response */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
          <div className="border-b border-slate-800 p-5">
  
            <h2 className="text-sm font-semibold text-white">
              LLM Response
            </h2>
  
            <p className="mt-1 text-xs text-slate-500">
              Response returned after gateway processing.
            </p>
  
          </div>
  
          <div className="min-h-45 p-5">
  
            {result.response ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-slate-300">
                {result.response}
              </pre>
            ) : (
              <div className="flex min-h-35 items-center justify-center">
  
                <div className="text-center">
  
                  <p className="text-sm font-medium text-red-400">
                    No request sent to the LLM
                  </p>
  
                  <p className="mt-2 text-xs text-slate-600">
                    The security gateway blocked the request before model execution.
                  </p>
  
                </div>
  
              </div>
            )}
  
          </div>
  
        </div>
  
        {/* Metadata */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
  
          <MetadataCard
            icon={Clock3}
            label="Latency"
            value={`${result.latencyMs} ms`}
          />
  
          <MetadataCard
            icon={Cpu}
            label="Model"
            value={result.model}
          />
  
          <MetadataCard
            icon={Hash}
            label="Tokens"
            value={`${result.inputTokens + result.outputTokens}`}
          />
  
          <MetadataCard
            icon={Coins}
            label="Est. Cost"
            value={`$${result.estimatedCost.toFixed(
              4
            )}`}
          />
  
        </div>
  
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
  
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            Request ID
          </p>
  
          <code className="mt-2 block break-all font-mono text-xs text-slate-400">
            {result.requestId}
          </code>
  
        </div>
  
      </div>
    );
  }
  
  type IconComponent =
    typeof Clock3;
  
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
          <Icon size={13} />
          {label}
        </div>
  
        <p className="mt-2 truncate text-sm font-medium text-slate-200">
          {value}
        </p>
  
      </div>
    );
  }