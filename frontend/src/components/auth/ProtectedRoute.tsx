import {
    Loader2,
  } from "lucide-react";
  
  import {
    Navigate,
    Outlet,
    useLocation,
  } from "react-router-dom";
  
  import {
    useAuth,
  } from "../../hooks/useAuth";
  
  export default function ProtectedRoute() {
    const {
      isAuthenticated,
      loading,
    } = useAuth();
  
    const location =
      useLocation();
  
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center">
            <Loader2
              size={28}
              className="mx-auto animate-spin text-blue-400"
            />
  
            <p className="mt-4 text-sm text-slate-500">
              Loading gateway...
            </p>
          </div>
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return (
        <Navigate
          to="/login"
          replace
          state={{
            from:
              location.pathname,
          }}
        />
      );
    }
  
    return <Outlet />;
  }