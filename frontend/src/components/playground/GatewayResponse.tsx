import {
  Activity,
  Clock3,
  Coins,
  Cpu,
  Hash,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

            <div className="text-sm leading-7 text-slate-300">

              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                ]}
                components={{
                  h1: ({
                    children,
                  }) => (
                    <h1 className="mb-4 mt-6 text-2xl font-semibold text-white first:mt-0">
                      {children}
                    </h1>
                  ),

                  h2: ({
                    children,
                  }) => (
                    <h2 className="mb-3 mt-6 text-xl font-semibold text-white first:mt-0">
                      {children}
                    </h2>
                  ),

                  h3: ({
                    children,
                  }) => (
                    <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-100">
                      {children}
                    </h3>
                  ),

                  p: ({
                    children,
                  }) => (
                    <p className="my-3 leading-7 text-slate-300">
                      {children}
                    </p>
                  ),

                  strong: ({
                    children,
                  }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),

                  ul: ({
                    children,
                  }) => (
                    <ul className="my-3 list-disc space-y-1 pl-6 text-slate-300">
                      {children}
                    </ul>
                  ),

                  ol: ({
                    children,
                  }) => (
                    <ol className="my-3 list-decimal space-y-1 pl-6 text-slate-300">
                      {children}
                    </ol>
                  ),

                  li: ({
                    children,
                  }) => (
                    <li className="leading-7">
                      {children}
                    </li>
                  ),

                  blockquote: ({
                    children,
                  }) => (
                    <blockquote className="my-4 border-l-4 border-slate-700 pl-4 italic text-slate-400">
                      {children}
                    </blockquote>
                  ),

                  code: ({
                    children,
                    className,
                  }) => {
                    const isBlock =
                      Boolean(
                        className
                      );

                    if (
                      isBlock
                    ) {
                      return (
                        <code className="block overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-300">
                          {children}
                        </code>
                      );
                    }

                    return (
                      <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-slate-200">
                        {children}
                      </code>
                    );
                  },

                  pre: ({
                    children,
                  }) => (
                    <pre className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                      {children}
                    </pre>
                  ),

                  table: ({
                    children,
                  }) => (
                    <div className="my-5 overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full border-collapse text-left text-xs">
                        {children}
                      </table>
                    </div>
                  ),

                  thead: ({
                    children,
                  }) => (
                    <thead className="bg-slate-950 text-slate-200">
                      {children}
                    </thead>
                  ),

                  tbody: ({
                    children,
                  }) => (
                    <tbody className="divide-y divide-slate-800">
                      {children}
                    </tbody>
                  ),

                  tr: ({
                    children,
                  }) => (
                    <tr className="border-b border-slate-800 last:border-b-0">
                      {children}
                    </tr>
                  ),

                  th: ({
                    children,
                  }) => (
                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-200">
                      {children}
                    </th>
                  ),

                  td: ({
                    children,
                  }) => (
                    <td className="px-4 py-3 align-top leading-6 text-slate-400">
                      {children}
                    </td>
                  ),

                  a: ({
                    children,
                    href,
                  }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 underline decoration-blue-400/30 underline-offset-2 transition hover:text-blue-300"
                    >
                      {children}
                    </a>
                  ),

                  hr: () => (
                    <hr className="my-6 border-slate-800" />
                  ),
                }}
              >
                {result.response}
              </ReactMarkdown>

            </div>

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
          value={`${
            result.inputTokens +
            result.outputTokens
          }`}
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