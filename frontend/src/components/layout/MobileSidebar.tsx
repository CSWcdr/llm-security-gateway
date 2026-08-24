import { useEffect } from "react";

import {
  Activity,
  BarChart3,
  FolderKanban,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  {
    name: "Overview",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Playground",
    path: "/playground",
    icon: Sparkles,
  },
  {
    name: "API Keys",
    path: "/api-keys",
    icon: KeyRound,
  },
  {
    name: "Request Logs",
    path: "/logs",
    icon: Activity,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Security Rules",
    path: "/security",
    icon: ShieldCheck,
  },
  {
    name: "Rate Limits",
    path: "/rate-limits",
    icon: Gauge,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function MobileSidebar({
  open,
  onClose,
}: MobileSidebarProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-70 flex-col border-r border-slate-800 bg-slate-950 shadow-2xl">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck
                size={19}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                LLM Gateway
              </p>

              <p className="text-[10px] text-slate-600">
                Security Platform
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path === "/"
                  }
                  onClick={onClose}
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-500 hover:bg-slate-900 hover:text-slate-200"
                    }`
                  }
                >
                  <Icon
                    size={17}
                  />

                  {item.name}
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <p className="text-xs font-medium text-emerald-400">
                Gateway operational
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}