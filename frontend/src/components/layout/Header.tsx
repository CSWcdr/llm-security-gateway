import { useState } from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../../hooks/useAuth";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  function handleLogout() {
    logout();

    setProfileOpen(false);

    toast.success("Signed out successfully");

    navigate("/login", {
      replace: true,
    });
  }

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "D";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <Menu size={19} />
        </button>

        {/* Search */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
          />

          <input
            placeholder="Search projects, requests..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-9 pr-4 text-sm text-slate-300 outline-none placeholder:text-slate-600 focus:border-blue-500/50"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Environment */}
          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-xs text-slate-400">
              Production
            </span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white"
          >
            <Bell size={17} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (current) => !current
                )
              }
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-xs font-medium text-slate-200">
                  {user?.name ??
                    "Developer"}
                </p>

                <p className="text-[10px] text-slate-600">
                  {user?.role ??
                    "Administrator"}
                </p>
              </div>

              <ChevronDown
                size={14}
                className="hidden text-slate-600 sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                <div className="border-b border-slate-800 p-4">
                  <p className="text-sm font-medium text-white">
                    {user?.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-600">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(
                        "/settings"
                      );
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    <User size={15} />

                    Account Settings
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={15} />

                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}