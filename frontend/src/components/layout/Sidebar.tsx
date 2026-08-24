import {
    Activity,
    BarChart3,
    FolderKanban,
    Gauge,
    KeyRound,
    LayoutDashboard,
    ScrollText,
    Settings,
    ShieldCheck,
    Sparkles,
  } from "lucide-react";
  import { NavLink } from "react-router-dom";
  
  const navigation = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Playground", path: "/playground", icon: Sparkles },
    { name: "API Keys", path: "/api-keys", icon: KeyRound },
    { name: "Request Logs", path: "/logs", icon: ScrollText },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Security Rules", path: "/security", icon: ShieldCheck },
    { name: "Rate Limits", path: "/rate-limits", icon: Gauge },
    { name: "Settings", path: "/settings", icon: Settings },
  ];
  
  export default function Sidebar() {
    return (
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-[#090e19] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Activity size={20} />
          </div>
  
          <div>
            <p className="text-sm font-semibold text-white">
              LLM Gateway
            </p>
  
            <p className="text-xs text-slate-500">
              Security Platform
            </p>
          </div>
        </div>
  
        {/* Navigation */}
        <nav className="space-y-1 p-3">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={18} />
  
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
  
        {/* Status */}
        <div className="absolute bottom-4 left-3 right-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
  
            <span className="text-xs font-medium text-slate-300">
              Gateway operational
            </span>
          </div>
  
          <p className="mt-2 text-xs text-slate-500">
            All systems normal
          </p>
        </div>
      </aside>
    );
  }