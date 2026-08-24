import {
    useMemo,
    useState,
  } from "react";
  
  import {
    Plus,
    Search,
  } from "lucide-react";
  
  import { toast } from "sonner";
  
  import CreateProjectModal from "../components/projects/CreateProjectModal";
  import ProjectCard from "../components/projects/ProjectCard";
  
  import type {
    ProjectStatus,
  } from "../types";
  
  import { useProjects } from "../hooks/useProjects";
  
  type FilterStatus =
    | "All"
    | ProjectStatus;
  
  export default function ProjectsPage() {
    const {
      projects,
      createProject,
    } = useProjects();
  
    const [search, setSearch] =
      useState("");
  
    const [statusFilter, setStatusFilter] =
      useState<FilterStatus>("All");
  
    const [modalOpen, setModalOpen] =
      useState(false);
  
    const filteredProjects = useMemo(() => {
      return projects.filter((project) => {
        const matchesSearch =
          project.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(search.toLowerCase());
  
        const matchesStatus =
          statusFilter === "All" ||
          project.status === statusFilter;
  
        return matchesSearch && matchesStatus;
      });
    }, [
      projects,
      search,
      statusFilter,
    ]);
  
    function handleCreateProject(project: {
      name: string;
      description: string;
      environment:
        | "Production"
        | "Development";
    }) {
      const newProject =
        createProject(project);
  
      toast.success("Project created", {
        description: `${newProject.name} is ready for configuration.`,
      });
    }
  
    return (
      <div className="space-y-6">
  
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
  
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Projects
            </h1>
  
            <p className="mt-1 text-sm text-slate-500">
              Manage applications connected to your LLM Security Gateway.
            </p>
          </div>
  
          <button
            onClick={() =>
              setModalOpen(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Plus size={17} />
            New Project
          </button>
  
        </div>
  
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
  
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500">
              Total Projects
            </p>
  
            <p className="mt-2 text-xl font-semibold text-white">
              {projects.length}
            </p>
          </div>
  
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500">
              Active
            </p>
  
            <p className="mt-2 text-xl font-semibold text-emerald-400">
              {
                projects.filter(
                  (project) =>
                    project.status ===
                    "Active"
                ).length
              }
            </p>
          </div>
  
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-500">
              Total Requests
            </p>
  
            <p className="mt-2 text-xl font-semibold text-white">
              {projects
                .reduce(
                  (total, project) =>
                    total +
                    project.requests,
                  0
                )
                .toLocaleString()}
            </p>
          </div>
  
        </div>
  
        {/* Search + Filters */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/30 p-4 sm:flex-row sm:items-center">
  
          <div className="relative flex-1">
  
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
  
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
            />
  
          </div>
  
          <div className="flex gap-2">
  
            {(
              [
                "All",
                "Active",
                "Paused",
              ] as FilterStatus[]
            ).map((status) => (
  
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(status)
                }
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  statusFilter === status
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                {status}
              </button>
  
            ))}
  
          </div>
  
        </div>
  
        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
  
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  
            {filteredProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              )
            )}
  
          </div>
  
        ) : (
  
          <div className="rounded-2xl border border-dashed border-slate-800 py-20 text-center">
  
            <h3 className="text-sm font-medium text-slate-300">
              No projects found
            </h3>
  
            <p className="mt-2 text-xs text-slate-600">
              Try changing your search or filter.
            </p>
  
          </div>
  
        )}
  
        {/* Create Project Modal */}
        <CreateProjectModal
          open={modalOpen}
          onClose={() =>
            setModalOpen(false)
          }
          onCreate={
            handleCreateProject
          }
        />
  
      </div>
    );
  }