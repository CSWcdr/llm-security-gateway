import {
    createContext,
    useState,
    type ReactNode,
  } from "react";
  
  import type {
    AuthUser,
  } from "../types";
  
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
  
  export const AuthContext =
    createContext<
      AuthContextType | undefined
    >(undefined);
  
  const STORAGE_KEY =
    "llm_gateway_user";
  
  type AuthProviderProps = {
    children: ReactNode;
  };
  
  export function AuthProvider({
    children,
  }: AuthProviderProps) {
    /*
     * Lazy initialization:
     *
     * Instead of:
     *
     * render
     * ↓
     * useEffect
     * ↓
     * localStorage
     * ↓
     * setUser
     * ↓
     * second render
     *
     * we read localStorage while React
     * creates the initial state.
     */
    const [
      user,
      setUser,
    ] =
      useState<AuthUser | null>(
        () => {
          const storedUser =
            localStorage.getItem(
              STORAGE_KEY
            );
  
          if (!storedUser) {
            return null;
          }
  
          try {
            return JSON.parse(
              storedUser
            ) as AuthUser;
          } catch {
            localStorage.removeItem(
              STORAGE_KEY
            );
  
            return null;
          }
        }
      );
  
    /*
     * Authentication loading will become
     * useful once the backend validates
     * sessions asynchronously.
     *
     * For our frontend simulation the
     * localStorage check is synchronous.
     */
    const loading = false;
  
    async function login({
      email,
      password,
    }: LoginInput) {
      /*
       * Simulates network delay.
       *
       * Later:
       * POST /api/auth/login
       */
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            700
          )
      );
  
      if (!email.trim()) {
        throw new Error(
          "Email is required."
        );
      }
  
      if (
        password.length < 6
      ) {
        throw new Error(
          "Password must contain at least 6 characters."
        );
      }
  
      /*
       * FRONTEND AUTH SIMULATION
       *
       * No real password validation is
       * happening yet.
       */
      const authenticatedUser: AuthUser =
        {
          id:
            crypto.randomUUID(),
  
          name:
            getNameFromEmail(
              email
            ),
  
          email:
            email
              .trim()
              .toLowerCase(),
  
          role:
            "Administrator",
        };
  
      setUser(
        authenticatedUser
      );
  
      localStorage.setItem(
        STORAGE_KEY,
  
        JSON.stringify(
          authenticatedUser
        )
      );
    }
  
    async function register({
      name,
      email,
      password,
    }: RegisterInput) {
      /*
       * Simulated API delay.
       *
       * Later:
       * POST /api/auth/register
       */
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            800
          )
      );
  
      if (!name.trim()) {
        throw new Error(
          "Name is required."
        );
      }
  
      if (!email.trim()) {
        throw new Error(
          "Email is required."
        );
      }
  
      if (
        password.length < 6
      ) {
        throw new Error(
          "Password must contain at least 6 characters."
        );
      }
  
      const newUser: AuthUser =
        {
          id:
            crypto.randomUUID(),
  
          name:
            name.trim(),
  
          email:
            email
              .trim()
              .toLowerCase(),
  
          role:
            "Administrator",
        };
  
      setUser(
        newUser
      );
  
      localStorage.setItem(
        STORAGE_KEY,
  
        JSON.stringify(
          newUser
        )
      );
    }
  
    function logout() {
      setUser(null);
  
      localStorage.removeItem(
        STORAGE_KEY
      );
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
  
  function getNameFromEmail(
    email: string
  ) {
    const username =
      email
        .trim()
        .split("@")[0];
  
    if (!username) {
      return "Developer";
    }
  
    return username
      .split(/[._-]/)
      .filter(Boolean)
      .map(
        (word) =>
          word
            .charAt(0)
            .toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }