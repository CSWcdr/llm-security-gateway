import {
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    ShieldOff,
  } from "lucide-react";
  
  import type {
    ProjectSecurityPolicy,
  } from "../../types";
  
  type PolicySummaryProps = {
    policy: ProjectSecurityPolicy;
  };
  
  export default function PolicySummary({
    policy,
  }: PolicySummaryProps) {
    const enabledRules =
      policy.rules.filter(
        (rule) => rule.enabled
      ).length;
  
    const blockingRules =
      policy.rules.filter(
        (rule) =>
          rule.enabled &&
          rule.action === "Block"
      ).length;
  
    const warningRules =
      policy.rules.filter(
        (rule) =>
          rule.enabled &&
          rule.action === "Warn"
      ).length;
  
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={CheckCircle2}
          label="Enabled Rules"
          value={`${enabledRules}/${policy.rules.length}`}
          iconStyle="bg-emerald-500/10 text-emerald-400"
        />
  
        <SummaryCard
          icon={ShieldOff}
          label="Blocking Rules"
          value={blockingRules.toString()}
          iconStyle="bg-red-500/10 text-red-400"
        />
  
        <SummaryCard
          icon={
            warningRules > 0
              ? AlertTriangle
              : ShieldCheck
          }
          label="Warning Rules"
          value={warningRules.toString()}
          iconStyle="bg-amber-500/10 text-amber-400"
        />
      </div>
    );
  }
  
  type IconComponent =
    typeof ShieldCheck;
  
  function SummaryCard({
    icon: Icon,
    label,
    value,
    iconStyle,
  }: {
    icon: IconComponent;
    label: string;
    value: string;
    iconStyle: string;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">
              {label}
            </p>
  
            <p className="mt-2 text-xl font-semibold text-white">
              {value}
            </p>
          </div>
  
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyle}`}
          >
            <Icon size={16} />
          </div>
        </div>
      </div>
    );
  }