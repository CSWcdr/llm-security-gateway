import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  import axios from "axios";
  
  import type {
    AuthUser,
  } from "../types";
  
  import {
    api,
    TOKEN_STORAGE_KEY,
  } from "../lib/api";
  
  
  type LoginInput = {
    email: string;
    password: string;
  };
  
  
  type RegisterInput = {
    name: string;
    email: string;
    password: string;
  };
  
  
  type AuthContextType = {
    user: AuthUser | null;
  
    isAuthenticated: boolean;
  
    loading: boolean;
  
    login: (
      input: LoginInput
    ) => Promise<void>;
  
    register: (
      input: RegisterInput
    ) => Promise<void>;
  
    logout: () => void;
  };
  
  
  type BackendUser = {
    id: string;
    name: string;
    email: string;
  
    role:
      | "ADMIN"
      | "DEVELOPER";
  
    createdAt: string;
    updatedAt: string;
  };
  
  
  type AuthResponse = {
    success: boolean;
  
    message: string;
  
    data: {
      user: BackendUser;
      token: string;
    };
  };
  
  
  type CurrentUserResponse = {
    success: boolean;
  
    message: string;
  
    data: {
      user: BackendUser;
    };
  };
  
  
  type ErrorResponse = {
    success?: boolean;
    message?: string;
  };
  
  
  export const AuthContext =
    createContext<
      AuthContextType | undefined
    >(undefined);
  
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  
  export function AuthProvider({
    children,
  }: AuthProviderProps) {
    const [
      user,
      setUser,
    ] =
      useState<AuthUser | null>(
        null
      );
  
    const [
      loading,
      setLoading,
    ] =
      useState(true);
  
  
    /*
     * When the frontend reloads:
     *
     * localStorage JWT
     *       ↓
     * GET /api/auth/me
     *       ↓
     * backend verifies token
     *       ↓
     * restore logged-in user
     */
    useEffect(() => {
      let cancelled =
        false;
  
      async function restoreSession() {
        const token =
          localStorage.getItem(
            TOKEN_STORAGE_KEY
          );
  
        /*
         * Remove old mock-auth data
         * from the previous frontend.
         */
        localStorage.removeItem(
          "llm_gateway_user"
        );
  
        if (!token) {
          if (!cancelled) {
            setLoading(false);
          }
  
          return;
        }
  
        try {
          const response =
            await api.get<CurrentUserResponse>(
              "/auth/me"
            );
  
          if (!cancelled) {
            setUser(
              mapBackendUser(
                response.data.data.user
              )
            );
          }
        } catch {
          localStorage.removeItem(
            TOKEN_STORAGE_KEY
          );
  
          if (!cancelled) {
            setUser(null);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }
  
      restoreSession();
  
      return () => {
        cancelled = true;
      };
    }, []);
  
  
    async function login({
      email,
      password,
    }: LoginInput) {
      try {
        const response =
          await api.post<AuthResponse>(
            "/auth/login",
            {
              email:
                email
                  .trim()
                  .toLowerCase(),
  
              password,
            }
          );
  
        const {
          user:
            backendUser,
          token,
        } =
          response.data.data;
  
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          token
        );
  
        setUser(
          mapBackendUser(
            backendUser
          )
        );
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Login failed."
          )
        );
      }
    }
  
  
    async function register({
      name,
      email,
      password,
    }: RegisterInput) {
      try {
        const response =
          await api.post<AuthResponse>(
            "/auth/register",
            {
              name:
                name.trim(),
  
              email:
                email
                  .trim()
                  .toLowerCase(),
  
              password,
            }
          );
  
        const {
          user:
            backendUser,
          token,
        } =
          response.data.data;
  
        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          token
        );
  
        setUser(
          mapBackendUser(
            backendUser
          )
        );
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Registration failed."
          )
        );
      }
    }
  
  
    function logout() {
      localStorage.removeItem(
        TOKEN_STORAGE_KEY
      );
  
      localStorage.removeItem(
        "llm_gateway_user"
      );
  
      setUser(null);
    }
  
  
    return (
      <AuthContext.Provider
        value={{
          user,
  
          isAuthenticated:
            Boolean(user),
  
          loading,
  
          login,
  
          register,
  
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  
  function mapBackendUser(
    backendUser: BackendUser
  ): AuthUser {
    return {
      id:
        backendUser.id,
  
      name:
        backendUser.name,
  
      email:
        backendUser.email,
  
      role:
        backendUser.role ===
        "ADMIN"
          ? "Administrator"
          : "Developer",
    };
  }
  
  
  function getApiErrorMessage(
    error: unknown,
    fallback: string
  ) {
    if (
      axios.isAxiosError<
        ErrorResponse
      >(error)
    ) {
      return (
        error.response?.data
          ?.message ??
        fallback
      );
    }
  
    if (
      error instanceof Error
    ) {
      return error.message;
    }
  
    return fallback;
  }