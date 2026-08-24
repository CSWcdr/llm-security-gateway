import {
    ShieldCheck,
  } from "lucide-react";
  
  import {
    Outlet,
  } from "react-router-dom";
  
  export default function AuthLayout() {
    return (
      <div className="grid min-h-screen bg-slate-950 lg:grid-cols-2">
        {/* Left branding */}
        <div className="relative hidden overflow-hidden border-r border-slate-800 bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
  
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%)]" />
  
          <div className="relative">
            <div className="flex items-center gap-3">
  
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck
                  size={21}
                />
              </div>
  
              <div>
                <p className="font-semibold text-white">
                  LLM Gateway
                </p>
  
                <p className="text-xs text-slate-500">
                  Security Platform
                </p>
              </div>
  
            </div>
          </div>
  
          <div className="relative max-w-lg">
  
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
              Secure AI Infrastructure
            </p>
  
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white">
              Control every request before it reaches your LLM.
            </h1>
  
            <p className="mt-5 text-sm leading-7 text-slate-500">
              Authentication, rate limiting, prompt protection,
              sensitive-data detection, request logging and
              cost control in one gateway.
            </p>
  
            <div className="mt-8 grid grid-cols-2 gap-3">
  
              <Feature>
                Prompt Security
              </Feature>
  
              <Feature>
                API Key Management
              </Feature>
  
              <Feature>
                Rate Limiting
              </Feature>
  
              <Feature>
                Usage Analytics
              </Feature>
  
            </div>
  
          </div>
  
          <p className="relative text-xs text-slate-700">
            LLM Security Gateway
          </p>
  
        </div>
  
        {/* Right auth form */}
        <div className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
  
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
  
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <ShieldCheck
                  size={19}
                />
              </div>
  
              <div>
                <p className="font-semibold text-white">
                  LLM Gateway
                </p>
  
                <p className="text-[11px] text-slate-600">
                  Security Platform
                </p>
              </div>
  
            </div>
  
            <Outlet />
  
          </div>
  
        </div>
      </div>
    );
  }
  
  function Feature({
    children,
  }: {
    children:
      React.ReactNode;
  }) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-xs text-slate-400">
        {children}
      </div>
    );
  }