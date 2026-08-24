import {
    analyticsProjects,
  } from "../../data/mockData";
  
  export default function TopProjectsTable() {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
  
        <div className="border-b border-slate-800 p-5">
  
          <h2 className="text-sm font-semibold text-white">
            Project Usage
          </h2>
  
          <p className="mt-1 text-xs text-slate-500">
            Gateway activity grouped by project.
          </p>
  
        </div>
  
        <div className="overflow-x-auto">
  
          <table className="w-full text-left">
  
            <thead>
  
              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-600">
  
                <th className="px-5 py-3 font-medium">
                  Project
                </th>
  
                <th className="px-5 py-3 font-medium">
                  Requests
                </th>
  
                <th className="px-5 py-3 font-medium">
                  Blocked
                </th>
  
                <th className="px-5 py-3 font-medium">
                  Block Rate
                </th>
  
                <th className="px-5 py-3 font-medium">
                  Cost
                </th>
  
              </tr>
  
            </thead>
  
            <tbody>
  
              {analyticsProjects.map(
                (project) => {
                  const blockRate =
                    (
                      (project.blocked /
                        project.requests) *
                      100
                    ).toFixed(1);
  
                  return (
                    <tr
                      key={
                        project.name
                      }
                      className="border-b border-slate-800/70 text-sm last:border-none hover:bg-slate-800/20"
                    >
  
                      <td className="px-5 py-4 font-medium text-slate-200">
                        {
                          project.name
                        }
                      </td>
  
                      <td className="px-5 py-4 text-slate-400">
                        {project.requests.toLocaleString()}
                      </td>
  
                      <td className="px-5 py-4 text-red-400">
                        {
                          project.blocked
                        }
                      </td>
  
                      <td className="px-5 py-4 text-slate-400">
                        {blockRate}%
                      </td>
  
                      <td className="px-5 py-4 text-slate-400">
                        $
                        {project.cost.toFixed(
                          2
                        )}
                      </td>
  
                    </tr>
                  );
                }
              )}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  }