import {
    Eye,
    Fingerprint,
    KeyRound,
    ShieldAlert,
    type LucideIcon,
  } from "lucide-react";
  
  import type {
    SecurityRule,
    SecurityRuleAction,
  } from "../../types";
  
  type SecurityRuleCardProps = {
    rule: SecurityRule;
  
    onToggle: () => void;
  
    onActionChange: (
      action: SecurityRuleAction
    ) => void;
  };
  
  const ruleIcons: Record<
    SecurityRule["type"],
    LucideIcon
  > = {
    prompt_injection:
      ShieldAlert,
  
    pii_detection:
      Fingerprint,
  
    secret_detection:
      KeyRound,
  
    output_scanning:
      Eye,
  };
  
  const actions: SecurityRuleAction[] = [
    "Block",
    "Warn",
    "Mask",
    "Allow",
  ];
  
  export default function SecurityRuleCard({
    rule,
    onToggle,
    onActionChange,
  }: SecurityRuleCardProps) {
    const Icon =
      ruleIcons[rule.type];
  
    return (
      <div
        className={`rounded-2xl border p-5 transition ${
          rule.enabled
            ? "border-slate-800 bg-slate-900/40"
            : "border-slate-800/60 bg-slate-900/20 opacity-70"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Icon size={18} />
            </div>
  
            <div>
              <h2 className="text-sm font-semibold text-white">
                {rule.name}
              </h2>
  
              <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
                {rule.description}
              </p>
            </div>
          </div>
  
          <button
            type="button"
            onClick={onToggle}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              rule.enabled
                ? "bg-blue-600"
                : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                rule.enabled
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>
  
        <div className="mt-5 border-t border-slate-800 pt-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Action when detected
              </p>
  
              <p className="mt-1 text-[11px] text-slate-600">
                Determines what the gateway does when this rule is triggered.
              </p>
            </div>
  
            <select
              value={rule.action}
              disabled={!rule.enabled}
              onChange={(event) =>
                onActionChange(
                  event.target
                    .value as SecurityRuleAction
                )
              }
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-300 outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {actions.map(
                (action) => (
                  <option
                    key={action}
                    value={action}
                  >
                    {action}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
    );
  }