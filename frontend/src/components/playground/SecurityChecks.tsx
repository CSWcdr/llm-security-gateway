import {
    AlertTriangle,
    CheckCircle2,
    ShieldX,
  } from "lucide-react";
  
  import type {
    GatewaySecurityCheck,
  } from "../../types";
  
  type SecurityChecksProps = {
    checks: GatewaySecurityCheck[];
  };
  
  export default function SecurityChecks({
    checks,
  }: SecurityChecksProps) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
        <div className="border-b border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-white">
            Security Pipeline
          </h2>
  
          <p className="mt-1 text-xs text-slate-500">
            Checks performed before the request reaches the LLM.
          </p>
        </div>
  
        <div className="divide-y divide-slate-800">
  
          {checks.map((check) => {
            const config =
              getStatusConfig(
                check.status
              );
  
            const Icon =
              config.icon;
  
            return (
              <div
                key={check.id}
                className="flex gap-3 p-4"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}
                >
                  <Icon size={17} />
                </div>
  
                <div>
                  <div className="flex items-center gap-2">
  
                    <p className="text-sm font-medium text-slate-200">
                      {check.name}
                    </p>
  
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.badgeClass}`}
                    >
                      {config.label}
                    </span>
  
                  </div>
  
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {check.description}
                  </p>
                </div>
              </div>
            );
          })}
  
        </div>
      </div>
    );
  }
  
  function getStatusConfig(
    status:
      | "passed"
      | "blocked"
      | "warning"
  ) {
    if (status === "blocked") {
      return {
        icon: ShieldX,
  
        iconClass:
          "bg-red-500/10 text-red-400",
  
        badgeClass:
          "bg-red-500/10 text-red-400",
  
        label: "Blocked",
      };
    }
  
    if (status === "warning") {
      return {
        icon: AlertTriangle,
  
        iconClass:
          "bg-amber-500/10 text-amber-400",
  
        badgeClass:
          "bg-amber-500/10 text-amber-400",
  
        label: "Warning",
      };
    }
  
    return {
      icon: CheckCircle2,
  
      iconClass:
        "bg-emerald-500/10 text-emerald-400",
  
      badgeClass:
        "bg-emerald-500/10 text-emerald-400",
  
      label: "Passed",
    };
  }