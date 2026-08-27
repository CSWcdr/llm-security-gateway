import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  import axios from "axios";
  
  import { api } from "../lib/api";
  import { useAuth } from "../hooks/useAuth";
  import { useProjects } from "../hooks/useProjects";
  
  
  export type RateLimitConfig = {
    id: string;
    projectId: string;
  
    enabled: boolean;
  
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  
    burstLimit: number;
  
    createdAt: string;
    updatedAt: string;
  };
  
  
  type UpdateRateLimitInput =
    Partial<
      Pick<
        RateLimitConfig,
        | "enabled"
        | "requestsPerMinute"
        | "requestsPerHour"
        | "requestsPerDay"
        | "burstLimit"
      >
    >;
  
  
  type RateLimitResponse = {
    success: boolean;
    message: string;
    data: RateLimitConfig;
  };
  
  
  type ErrorResponse = {
    success?: boolean;
    message?: string;
  };
  
  
  type RateLimitsContextType = {
    rateLimits: Record<
      string,
      RateLimitConfig
    >;
  
    loading: boolean;
  
    getRateLimit: (
      projectId: string
    ) =>
      | RateLimitConfig
      | undefined;
  
    updateRateLimit: (
      projectId: string,
      input: UpdateRateLimitInput
    ) => Promise<RateLimitConfig>;
  
    refreshRateLimits:
      () => Promise<void>;
  };
  
  
  export const RateLimitsContext =
    createContext<
      RateLimitsContextType | undefined
    >(undefined);
  
  
  type RateLimitsProviderProps = {
    children: ReactNode;
  };
  
  
  export function RateLimitsProvider({
    children,
  }: RateLimitsProviderProps) {
    const {
      isAuthenticated,
      loading: authLoading,
    } = useAuth();
  
    const {
      projects,
    } = useProjects();
  
  
    const [
      rateLimits,
      setRateLimits,
    ] = useState<
      Record<
        string,
        RateLimitConfig
      >
    >({});
  
  
    const [
      loading,
      setLoading,
    ] = useState(false);
  
  
    const refreshRateLimits =
      useCallback(
        async () => {
          if (
            !isAuthenticated ||
            projects.length === 0
          ) {
            setRateLimits({});
            return;
          }
  
          try {
            setLoading(true);
  
            const responses =
              await Promise.all(
                projects.map(
                  (project) =>
                    api.get<RateLimitResponse>(
                      `/projects/${project.id}/rate-limit`
                    )
                )
              );
  
            const nextRateLimits:
              Record<
                string,
                RateLimitConfig
              > = {};
  
            responses.forEach(
              (response) => {
                const config =
                  response.data.data;
  
                nextRateLimits[
                  config.projectId
                ] = config;
              }
            );
  
            setRateLimits(
              nextRateLimits
            );
          } catch (error) {
            console.error(
              getApiErrorMessage(
                error,
                "Failed to fetch rate limits."
              )
            );
          } finally {
            setLoading(false);
          }
        },
        [
          isAuthenticated,
          projects,
        ]
      );
  
  
    useEffect(() => {
      if (authLoading) {
        return;
      }
  
      refreshRateLimits();
    }, [
      authLoading,
      refreshRateLimits,
    ]);
  
  
    function getRateLimit(
      projectId: string
    ) {
      return rateLimits[
        projectId
      ];
    }
  
  
    async function updateRateLimit(
      projectId: string,
      input:
        UpdateRateLimitInput
    ) {
      try {
        const response =
          await api.patch<RateLimitResponse>(
            `/projects/${projectId}/rate-limit`,
            input
          );
  
        const updatedConfig =
          response.data.data;
  
        setRateLimits(
          (
            currentRateLimits
          ) => ({
            ...currentRateLimits,
  
            [projectId]:
              updatedConfig,
          })
        );
  
        return updatedConfig;
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Failed to update rate limit."
          )
        );
      }
    }
  
  
    return (
      <RateLimitsContext.Provider
        value={{
          rateLimits,
          loading,
          getRateLimit,
          updateRateLimit,
          refreshRateLimits,
        }}
      >
        {children}
      </RateLimitsContext.Provider>
    );
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