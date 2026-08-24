import {
    ArrowRight,
    Ban,
    KeyRound,
    MoreHorizontal,
    Server,
  } from "lucide-react";
  
  import { useNavigate } from "react-router-dom";
  
  import type { Project } from "../../types";
  
  type ProjectCardProps = {
    project: Project;
  };
  
  export default function ProjectCard({
    project,
  }: ProjectCardProps) {
    const navigate = useNavigate();
  
    const blockedPercentage =
      project.requests === 0
        ? 0
        : (
            (project.blockedRequests / project.requests) *
            100
          ).toFixed(1);
  
    return (
      <div className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/60">
  
        {/* Top */}
        <div className="flex items-start justify-between gap-4">
  
          <div className="flex gap-3">
  
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Server size={20} />
            </div>
  
            <div>
              <div className="flex flex-wrap items-center gap-2">
  
                <h2 className="font-semibold text-white">
                  {project.name}
                </h2>
  
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    project.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {project.status}
                </span>
  
              </div>
  
              <p className="mt-1 text-xs text-slate-500">
                {project.environment}
              </p>
            </div>
  
          </div>
  
          <button className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white">
            <MoreHorizontal size={18} />
          </button>
  
        </div>
  
        {/* Description */}
        <p className="mt-5 min-h-10 text-sm leading-6 text-slate-400">
          {project.description}
        </p>
  
        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-3">
  
          <div>
            <p className="text-xs text-slate-500">
              Requests
            </p>
  
            <p className="mt-1 text-sm font-medium text-slate-200">
              {project.requests.toLocaleString()}
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Ban size={12} />
              Blocked
            </div>
  
            <p className="mt-1 text-sm font-medium text-slate-200">
              {project.blockedRequests}
              <span className="ml-1 text-xs font-normal text-slate-600">
                ({blockedPercentage}%)
              </span>
            </p>
          </div>
  
          <div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <KeyRound size={12} />
              API Keys
            </div>
  
            <p className="mt-1 text-sm font-medium text-slate-200">
              {project.apiKeys}
            </p>
          </div>
  
        </div>
  
        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
  
          <p className="text-[11px] text-slate-600">
            Created {project.createdAt}
          </p>
  
          <button
            onClick={() =>
              navigate(`/projects/${project.id}`)
            }
            className="flex items-center gap-1.5 text-xs font-medium text-blue-400 transition hover:text-blue-300"
          >
            Open project
            <ArrowRight size={14} />
          </button>
  
        </div>
  
      </div>
    );
  }