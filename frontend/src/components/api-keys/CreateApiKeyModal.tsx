import {
    useState,
    type FormEvent,
  } from "react";
  
  import {
    KeyRound,
    X,
  } from "lucide-react";
  
  import { useProjects } from "../../hooks/useProjects";
  
  import type {
    ApiKeyEnvironment,
  } from "../../types";
  
  type CreateApiKeyInput = {
    name: string;
  
    projectId: string;
    projectName: string;
  
    environment: ApiKeyEnvironment;
  };
  
  type CreateApiKeyModalProps = {
    open: boolean;
  
    onClose: () => void;
  
    onCreate: (
      input: CreateApiKeyInput
    ) => void;
  };
  
  export default function CreateApiKeyModal({
    open,
    onClose,
    onCreate,
  }: CreateApiKeyModalProps) {
    const { projects } =
      useProjects();
  
    const [name, setName] =
      useState("");
  
    const [
      selectedProjectId,
      setSelectedProjectId,
    ] = useState("");
  
    const [
      environment,
      setEnvironment,
    ] =
      useState<ApiKeyEnvironment>(
        "Development"
      );
  
    if (!open) {
      return null;
    }
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();
  
      const project =
        projects.find(
          (project) =>
            project.id ===
            selectedProjectId
        );
  
      if (
        !name.trim() ||
        !project
      ) {
        return;
      }
  
      onCreate({
        name: name.trim(),
  
        projectId: project.id,
  
        projectName:
          project.name,
  
        environment,
      });
  
      setName("");
      setSelectedProjectId("");
      setEnvironment(
        "Development"
      );
  
      onClose();
    }
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
  
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0b111d] shadow-2xl">
  
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
  
            <div className="flex items-center gap-3">
  
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <KeyRound
                  size={18}
                />
              </div>
  
              <div>
                <h2 className="font-semibold text-white">
                  Create API Key
                </h2>
  
                <p className="mt-1 text-xs text-slate-500">
                  Generate a credential for a gateway project.
                </p>
              </div>
  
            </div>
  
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
  
          </div>
  
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5 p-5"
          >
  
            {/* Key Name */}
            <div>
  
              <label className="text-xs font-medium text-slate-300">
                Key name
              </label>
  
              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Production Backend"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/50"
              />
  
              <p className="mt-2 text-[11px] text-slate-600">
                Give the key a name describing where it will be used.
              </p>
  
            </div>
  
            {/* Project */}
            <div>
  
              <label className="text-xs font-medium text-slate-300">
                Project
              </label>
  
              <select
                value={
                  selectedProjectId
                }
                onChange={(event) =>
                  setSelectedProjectId(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
              >
                <option value="">
                  Select project
                </option>
  
                {projects.map(
                  (project) => (
                    <option
                      key={
                        project.id
                      }
                      value={
                        project.id
                      }
                    >
                      {project.name}
                    </option>
                  )
                )}
  
              </select>
  
            </div>
  
            {/* Environment */}
            <div>
  
              <label className="text-xs font-medium text-slate-300">
                Environment
              </label>
  
              <div className="mt-2 grid grid-cols-2 gap-3">
  
                <button
                  type="button"
                  onClick={() =>
                    setEnvironment(
                      "Development"
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    environment ===
                    "Development"
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Development
                </button>
  
                <button
                  type="button"
                  onClick={() =>
                    setEnvironment(
                      "Production"
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    environment ===
                    "Production"
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Production
                </button>
  
              </div>
  
            </div>
  
            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
  
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
  
              <button
                type="submit"
                disabled={
                  !name.trim() ||
                  !selectedProjectId
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate Key
              </button>
  
            </div>
  
          </form>
  
        </div>
  
      </div>
    );
  }