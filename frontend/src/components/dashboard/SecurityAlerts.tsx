import {
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
  } from "lucide-react";
  
  import { securityAlerts } from "../../data/mockData";
  
  function severityStyle(severity: string) {
    if (severity === "High") {
      return {
        icon: ShieldAlert,
        iconStyle: "bg-red-500/10 text-red-400",
        badgeStyle: "bg-red-500/10 text-red-400",
      };
    }
  
    if (severity === "Medium") {
      return {
        icon: AlertTriangle,
        iconStyle: "bg-amber-500/10 text-amber-400",
        badgeStyle: "bg-amber-500/10 text-amber-400",
      };
    }
  
    return {
      icon: ShieldCheck,
      iconStyle: "bg-blue-500/10 text-blue-400",
      badgeStyle: "bg-blue-500/10 text-blue-400",
    };
  }
  
  export default function SecurityAlerts() {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40">
  
        <div className="border-b border-slate-800 p-5">
  
          <h2 className="text-base font-semibold text-white">
            Security Alerts
          </h2>
  
          <p className="mt-1 text-xs text-slate-500">
            Recent security events detected by the gateway
          </p>
  
        </div>
  
        <div className="divide-y divide-slate-800">
  
          {securityAlerts.map((alert) => {
            const style = severityStyle(alert.severity);
  
            const Icon = style.icon;
  
            return (
              <div
                key={alert.id}
                className="p-5 transition hover:bg-slate-800/20"
              >
  
                <div className="flex gap-3">
  
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconStyle}`}
                  >
                    <Icon size={17} />
                  </div>
  
                  <div className="min-w-0 flex-1">
  
                    <div className="flex items-start justify-between gap-2">
  
                      <p className="text-sm font-medium text-slate-200">
                        {alert.title}
                      </p>
  
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-medium ${style.badgeStyle}`}
                      >
                        {alert.severity}
                      </span>
  
                    </div>
  
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {alert.description}
                    </p>
  
                    <p className="mt-2 text-[11px] text-slate-600">
                      {alert.time}
                    </p>
  
                  </div>
  
                </div>
  
              </div>
            );
          })}
  
        </div>
  
      </div>
    );
  }