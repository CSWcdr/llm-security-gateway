import type {
    RequestStatus,
  } from "../../types";
  
  type RequestStatusBadgeProps = {
    status: RequestStatus;
  };
  
  export default function RequestStatusBadge({
    status,
  }: RequestStatusBadgeProps) {
    const styles = {
      Allowed:
        "bg-emerald-500/10 text-emerald-400",
  
      Blocked:
        "bg-red-500/10 text-red-400",
  
      Warning:
        "bg-amber-500/10 text-amber-400",
    };
  
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  }