import {
    useState,
  } from "react";
  
  import {
    Check,
    Copy,
    KeyRound,
    ShieldAlert,
    X,
  } from "lucide-react";
  
  import { toast } from "sonner";
  
  type ApiKeySecretModalProps = {
    open: boolean;
  
    secret: string;
  
    onClose: () => void;
  };
  
  export default function ApiKeySecretModal({
    open,
    secret,
    onClose,
  }: ApiKeySecretModalProps) {
    const [copied, setCopied] =
      useState(false);
  
    if (!open) {
      return null;
    }
  
    async function copySecret() {
      await navigator.clipboard.writeText(
        secret
      );
  
      setCopied(true);
  
      toast.success(
        "API key copied"
      );
  
      setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
  
        <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0b111d] shadow-2xl">
  
          <div className="border-b border-slate-800 p-6">
  
            <div className="flex items-start justify-between">
  
              <div className="flex gap-3">
  
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <KeyRound
                    size={20}
                  />
                </div>
  
                <div>
                  <h2 className="font-semibold text-white">
                    API Key Created
                  </h2>
  
                  <p className="mt-1 text-sm text-slate-500">
                    Your gateway credential is ready.
                  </p>
                </div>
  
              </div>
  
              <button
                onClick={
                  onClose
                }
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
  
            </div>
  
          </div>
  
          <div className="space-y-5 p-6">
  
            {/* Warning */}
            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
  
              <ShieldAlert
                size={18}
                className="mt-0.5 shrink-0 text-amber-400"
              />
  
              <div>
  
                <p className="text-sm font-medium text-amber-300">
                  Save this key now
                </p>
  
                <p className="mt-1 text-xs leading-5 text-amber-200/60">
                  For security reasons, the full API key will not be shown again after you close this window.
                </p>
  
              </div>
  
            </div>
  
            {/* Key */}
            <div>
  
              <label className="text-xs font-medium text-slate-400">
                API Key
              </label>
  
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
  
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-emerald-400">
                  {secret}
                </code>
  
                <button
                  onClick={
                    copySecret
                  }
                  className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-800"
                >
  
                  {copied ? (
                    <>
                      <Check
                        size={14}
                        className="text-emerald-400"
                      />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={14}
                      />
                      Copy
                    </>
                  )}
  
                </button>
  
              </div>
  
            </div>
  
            <div className="rounded-xl bg-slate-900/50 p-4">
  
              <p className="text-xs font-medium text-slate-300">
                Example request
              </p>
  
              <pre className="mt-3 overflow-x-auto text-[11px] leading-5 text-slate-500">
  {`curl -X POST /gateway/chat \\
    -H "Authorization: Bearer ${secret.slice(
      0,
      18
    )}..." \\
    -H "Content-Type: application/json"`}
              </pre>
  
            </div>
  
          </div>
  
          <div className="flex justify-end border-t border-slate-800 p-5">
  
            <button
              onClick={
                onClose
              }
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              I've Saved My Key
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }