import {
    useState,
  } from "react";
  
  import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
  } from "lucide-react";
  
  import {
    Link,
    useLocation,
    useNavigate,
  } from "react-router-dom";
  
  import {
    toast,
  } from "sonner";
  
  import {
    useAuth,
  } from "../hooks/useAuth";
  
  export default function LoginPage() {
    const navigate =
      useNavigate();
  
    const location =
      useLocation();
  
    const { login } =
      useAuth();
  
    const [email, setEmail] =
      useState(
        "developer@example.com"
      );
  
    const [
      password,
      setPassword,
    ] =
      useState("password");
  
    const [
      showPassword,
      setShowPassword,
    ] = useState(false);
  
    const [
      submitting,
      setSubmitting,
    ] = useState(false);
  
    async function handleSubmit(
      event:
        React.FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();
  
      try {
        setSubmitting(true);
  
        await login({
          email,
          password,
        });
  
        toast.success(
          "Welcome back"
        );
  
        const destination =
          (
            location.state as
              | {
                  from?: string;
                }
              | null
          )?.from ?? "/";
  
        navigate(
          destination,
          {
            replace: true,
          }
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Login failed."
        );
      } finally {
        setSubmitting(false);
      }
    }
  
    return (
      <div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
  
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your LLM Security Gateway.
          </p>
        </div>
  
        <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
  
          <p className="text-xs leading-5 text-blue-200/60">
            Frontend demo mode: use any valid email and a password
            containing at least 6 characters.
          </p>
  
        </div>
  
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >
          <AuthField
            label="Email address"
          >
            <div className="relative">
  
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
  
              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="you@company.com"
                className="auth-input pl-10"
              />
  
            </div>
          </AuthField>
  
          <AuthField
            label="Password"
          >
            <div className="relative">
  
              <LockKeyhole
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
  
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={
                  password
                }
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                className="auth-input px-10"
              />
  
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff
                    size={16}
                  />
                ) : (
                  <Eye
                    size={16}
                  />
                )}
              </button>
  
            </div>
          </AuthField>
  
          <div className="flex items-center justify-between">
  
            <label className="flex items-center gap-2 text-xs text-slate-500">
  
              <input
                type="checkbox"
                className="rounded border-slate-700 bg-slate-900"
              />
  
              Remember me
  
            </label>
  
            <button
              type="button"
              onClick={() =>
                toast.info(
                  "Password reset will be implemented with the backend."
                )
              }
              className="text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </button>
  
          </div>
  
          <button
            type="submit"
            disabled={
              submitting
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
  
            {submitting ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
  
                Signing in
              </>
            ) : (
              "Sign in"
            )}
  
          </button>
  
        </form>
  
        <p className="mt-7 text-center text-sm text-slate-600">
  
          Don't have an account?{" "}
  
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Create account
          </Link>
  
        </p>
      </div>
    );
  }
  
  function AuthField({
    label,
    children,
  }: {
    label: string;
    children:
      React.ReactNode;
  }) {
    return (
      <div>
  
        <label className="text-xs font-medium text-slate-400">
          {label}
        </label>
  
        <div className="mt-2">
          {children}
        </div>
  
      </div>
    );
  }