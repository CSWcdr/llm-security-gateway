import {
    Ban,
    KeyRound,
    MoreHorizontal,
  } from "lucide-react";
  
  import type {
    ApiKey,
  } from "../../types";
  
  type ApiKeyRowProps = {
    apiKey: ApiKey;
  
    onRevoke: (
      apiKeyId: string
    ) => void;
  };
  
  export default function ApiKeyRow({
    apiKey,
    onRevoke,
  }: ApiKeyRowProps) {
    return (
      <tr className="border-b border-slate-800/70 text-sm last:border-none hover:bg-slate-800/20">
  
        {/* Name */}
        <td className="px-5 py-4">
  
          <div className="flex items-center gap-3">
  
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <KeyRound
                size={16}
              />
            </div>
  
            <div>
  
              <p className="font-medium text-slate-200">
                {apiKey.name}
              </p>
  
              <p className="mt-1 font-mono text-[11px] text-slate-600">
                {apiKey.prefix}
                _••••••••••
                {apiKey.lastFour}
              </p>
  
            </div>
  
          </div>
  
        </td>
  
        {/* Project */}
        <td className="px-5 py-4">
  
          <p className="text-slate-300">
            {apiKey.projectName}
          </p>
  
          <p className="mt-1 text-xs text-slate-600">
            {apiKey.environment}
          </p>
  
        </td>
  
        {/* Status */}
        <td className="px-5 py-4">
  
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
              apiKey.status ===
              "Active"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {apiKey.status}
          </span>
  
        </td>
  
        {/* Requests */}
        <td className="px-5 py-4 text-slate-400">
          {apiKey.requestCount.toLocaleString()}
        </td>
  
        {/* Last Used */}
        <td className="px-5 py-4 text-xs text-slate-500">
          {apiKey.lastUsedAt ??
            "Never"}
        </td>
  
        {/* Created */}
        <td className="px-5 py-4 text-xs text-slate-500">
          {apiKey.createdAt}
        </td>
  
        {/* Actions */}
        <td className="px-5 py-4">
  
          {apiKey.status ===
          "Active" ? (
            <button
              onClick={() =>
                onRevoke(
                  apiKey.id
                )
              }
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
            >
              <Ban size={14} />
              Revoke
            </button>
          ) : (
            <button className="rounded-lg p-2 text-slate-700">
              <MoreHorizontal
                size={17}
              />
            </button>
          )}
  
        </td>
  
      </tr>
    );
  }