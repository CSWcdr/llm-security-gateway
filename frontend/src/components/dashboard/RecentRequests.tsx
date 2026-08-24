import { ArrowUpRight } from "lucide-react";

import { recentRequests } from "../../data/mockData";

export default function RecentRequests() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">

      <div className="flex items-center justify-between border-b border-slate-800 p-5">

        <div>
          <h2 className="text-base font-semibold text-white">
            Recent Requests
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest requests processed by the gateway
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-medium text-blue-400 transition hover:text-blue-300">
          View all
          <ArrowUpRight size={14} />
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">

              <th className="px-5 py-3 font-medium">
                Request
              </th>

              <th className="px-5 py-3 font-medium">
                Project
              </th>

              <th className="px-5 py-3 font-medium">
                Model
              </th>

              <th className="px-5 py-3 font-medium">
                Status
              </th>

              <th className="px-5 py-3 font-medium">
                Latency
              </th>

              <th className="px-5 py-3 font-medium">
                Time
              </th>

            </tr>
          </thead>

          <tbody>

            {recentRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-slate-800/70 text-sm last:border-none hover:bg-slate-800/30"
              >

                <td className="px-5 py-4 font-mono text-xs text-slate-400">
                  {request.id}
                </td>

                <td className="px-5 py-4 text-slate-200">
                  {request.project}
                </td>

                <td className="px-5 py-4 text-slate-400">
                  {request.model}
                </td>

                <td className="px-5 py-4">

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      request.status === "Allowed"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {request.status}
                  </span>

                </td>

                <td className="px-5 py-4 text-slate-400">
                  {request.latency}
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {request.time}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}