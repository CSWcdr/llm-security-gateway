import {
    useState,
    type FormEvent,
  } from "react";
  
  import { X } from "lucide-react";
  
  type NewProjectInput = {
    name: string;
    description: string;
    environment: "Production" | "Development";
  };
  
  type CreateProjectModalProps = {
    open: boolean;
    onClose: () => void;
    onCreate: (project: NewProjectInput) => void;
  };
  
  export default function CreateProjectModal({
    open,
    onClose,
    onCreate,
  }: CreateProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] =
      useState("");
  
    const [environment, setEnvironment] =
      useState<"Production" | "Development">(
        "Development"
      );
  
    if (!open) {
      return null;
    }
  
    function handleSubmit(
      event: FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();
  
      if (!name.trim()) {
        return;
      }
  
      onCreate({
        name: name.trim(),
        description: description.trim(),
        environment,
      });
  
      setName("");
      setDescription("");
      setEnvironment("Development");
  
      onClose();
    }
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
  
        <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0b111d] shadow-2xl">
  
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
  
            <div>
              <h2 className="font-semibold text-white">
                Create Project
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Register an application with your gateway.
              </p>
            </div>
  
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>
  
          </div>
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5"
          >
  
            {/* Name */}
            <div>
  
              <label className="text-xs font-medium text-slate-300">
                Project name
              </label>
  
              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Customer Support Bot"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
              />
  
            </div>
  
            {/* Description */}
            <div>
  
              <label className="text-xs font-medium text-slate-300">
                Description
              </label>
  
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                placeholder="What does this application use the gateway for?"
                className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
              />
  
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
                    setEnvironment("Development")
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    environment === "Development"
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Development
                </button>
  
                <button
                  type="button"
                  onClick={() =>
                    setEnvironment("Production")
                  }
                  className={`rounded-xl border px-4 py-3 text-sm transition ${
                    environment === "Production"
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  Production
                </button>
  
              </div>
  
            </div>
  
            {/* Buttons */}
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
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Create Project
              </button>
  
            </div>
  
          </form>
  
        </div>
  
      </div>
    );
  }