import {
    useState,
  } from "react";
  
  import {
    Eye,
    EyeOff,
    Loader2,
    LockKeyhole,
    Mail,
    User,
  } from "lucide-react";
  
  import {
    Link,
    useNavigate,
  } from "react-router-dom";
  
  import {
    toast,
  } from "sonner";
  
  import {
    useAuth,
  } from "../hooks/useAuth";
  
  
  export default function RegisterPage() {
    const navigate =
      useNavigate();
  
    const { register } =
      useAuth();
  
  
    const [
      name,
      setName,
    ] =
      useState("");
  
  
    const [
      email,
      setEmail,
    ] =
      useState("");
  
  
    const [
      password,
      setPassword,
    ] =
      useState("");
  
  
    const [
      showPassword,
      setShowPassword,
    ] =
      useState(false);
  
  
    const [
      submitting,
      setSubmitting,
    ] =
      useState(false);
  
  
    async function handleSubmit(
      event:
        React.FormEvent<HTMLFormElement>
    ) {
      event.preventDefault();
  
      try {
        setSubmitting(true);
  
        await register({
          name,
          email,
          password,
        });
  
        toast.success(
          "Account created successfully"
        );
  
        navigate(
          "/",
          {
            replace: true,
          }
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Registration failed."
        );
      } finally {
        setSubmitting(false);
      }
    }
  
  
    return (
      <div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
  
          <p className="mt-2 text-sm text-slate-500">
            Start managing secure LLM projects and gateway requests.
          </p>
        </div>
  
  
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 space-y-5"
        >
          <AuthField
            label="Full name"
          >
            <div className="relative">
  
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />
  
              <input
                type="text"
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Your name"
                autoComplete="name"
                className="auth-input pl-10"
              />
  
            </div>
          </AuthField>
  
  
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
                autoComplete="email"
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
                minLength={8}
                value={
                  password
                }
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
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
  
  
          <p className="text-xs leading-5 text-slate-600">
            Password must contain at least 8 characters.
          </p>
  
  
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
  
                Creating account
              </>
            ) : (
              "Create account"
            )}
  
          </button>
  
        </form>
  
  
        <p className="mt-7 text-center text-sm text-slate-600">
  
          Already have an account?{" "}
  
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign in
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