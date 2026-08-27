import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  import axios from "axios";
  
  import {
    api,
  } from "../lib/api";
  
  import {
    useAuth,
  } from "../hooks/useAuth";
  
  import {
    useProjects,
  } from "../hooks/useProjects";
  
  import type {
    ApiKey,
    ApiKeyEnvironment,
  } from "../types";
  
  
  type CreateApiKeyInput = {
    name: string;
  
    projectId: string;
    projectName: string;
  
    environment: ApiKeyEnvironment;
  };
  
  
  type CreateApiKeyResult = {
    apiKey: ApiKey;
    secret: string;
  };
  
  
  type BackendApiKey = {
    id: string;
  
    name: string;
  
    keyPrefix: string;
  
    status:
      | "ACTIVE"
      | "REVOKED";
  
    projectId: string;
  
    lastUsedAt:
      | string
      | null;
  
    revokedAt:
      | string
      | null;
  
    createdAt: string;
  
    updatedAt: string;
  };
  
  
  type ApiKeysResponse = {
    success: boolean;
  
    message: string;
  
    data: BackendApiKey[];
  };
  
  
  type CreateApiKeyResponse = {
    success: boolean;
  
    message: string;
  
    data: BackendApiKey & {
      key: string;
    };
  
    warning?: string;
  };
  
  
  type RevokeApiKeyResponse = {
    success: boolean;
  
    message: string;
  
    data?: BackendApiKey;
  };
  
  
  type ErrorResponse = {
    success?: boolean;
    message?: string;
  };
  
  
  type ApiKeysContextType = {
    apiKeys: ApiKey[];
  
    loading: boolean;
  
    createApiKey: (
      input: CreateApiKeyInput
    ) => Promise<CreateApiKeyResult>;
  
    revokeApiKey: (
      apiKeyId: string
    ) => Promise<void>;
  
    refreshApiKeys: () =>
      Promise<void>;
  };
  
  
  export const ApiKeysContext =
    createContext<
      ApiKeysContextType | undefined
    >(undefined);
  
  
  type ApiKeysProviderProps = {
    children: ReactNode;
  };
  
  
  export function ApiKeysProvider({
    children,
  }: ApiKeysProviderProps) {
    const {
      isAuthenticated,
      loading: authLoading,
    } =
      useAuth();
  
    const {
      projects,
    } =
      useProjects();
  
  
    const [
      apiKeys,
      setApiKeys,
    ] =
      useState<ApiKey[]>([]);
  
  
    const [
      loading,
      setLoading,
    ] =
      useState(false);
  
  
    /*
     * We currently have:
     *
     * GET /projects/:projectId/api-keys
     *
     * instead of one global:
     *
     * GET /api-keys
     *
     * So we fetch the keys for each
     * project owned by the user.
     */
    const refreshApiKeys =
      useCallback(
        async () => {
          if (
            !isAuthenticated
          ) {
            setApiKeys([]);
            return;
          }
  
          if (
            projects.length === 0
          ) {
            setApiKeys([]);
            return;
          }
  
          try {
            setLoading(true);
  
            const responses =
              await Promise.all(
                projects.map(
                  (project) =>
                    api.get<ApiKeysResponse>(
                      `/projects/${project.id}/api-keys`
                    )
                )
              );
  
  
            const mappedApiKeys =
              responses.flatMap(
                (
                  response,
                  index
                ) => {
                  const project =
                    projects[index];
  
                  return response.data.data.map(
                    (backendApiKey) =>
                      mapBackendApiKey(
                        backendApiKey,
                        project.name,
                        project.environment
                      )
                  );
                }
              );
  
  
            mappedApiKeys.sort(
              (
                first,
                second
              ) =>
                new Date(
                  second.createdAt
                ).getTime() -
                new Date(
                  first.createdAt
                ).getTime()
            );
  
  
            setApiKeys(
              mappedApiKeys
            );
          } catch (error) {
            throw new Error(
              getApiErrorMessage(
                error,
                "Failed to fetch API keys."
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
  
      if (
        !isAuthenticated
      ) {
        setApiKeys([]);
        return;
      }
  
      refreshApiKeys().catch(
        (error) => {
          console.error(
            error
          );
        }
      );
    }, [
      authLoading,
      isAuthenticated,
      refreshApiKeys,
    ]);
  
  
    async function createApiKey(
      input: CreateApiKeyInput
    ): Promise<CreateApiKeyResult> {
      try {
        const response =
          await api.post<CreateApiKeyResponse>(
            `/projects/${input.projectId}/api-keys`,
            {
              name:
                input.name.trim(),
            }
          );
  
  
        const backendApiKey =
          response.data.data;
  
  
        const newApiKey =
          mapBackendApiKey(
            backendApiKey,
            input.projectName,
            input.environment
          );
  
  
        setApiKeys(
          (currentApiKeys) => [
            newApiKey,
            ...currentApiKeys,
          ]
        );
  
  
        return {
          apiKey:
            newApiKey,
  
          /*
           * Backend returns this
           * only during creation.
           *
           * We display it once and
           * never store it in state
           * after the modal closes.
           */
          secret:
            backendApiKey.key,
        };
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Failed to create API key."
          )
        );
      }
    }
  
  
    async function revokeApiKey(
      apiKeyId: string
    ) {
      try {
        await api.patch<RevokeApiKeyResponse>(
          `/api-keys/${apiKeyId}/revoke`
        );
  
  
        setApiKeys(
          (currentApiKeys) =>
            currentApiKeys.map(
              (apiKey) =>
                apiKey.id ===
                apiKeyId
                  ? {
                      ...apiKey,
  
                      status:
                        "Revoked",
                    }
                  : apiKey
            )
        );
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Failed to revoke API key."
          )
        );
      }
    }
  
  
    return (
      <ApiKeysContext.Provider
        value={{
          apiKeys,
  
          loading,
  
          createApiKey,
  
          revokeApiKey,
  
          refreshApiKeys,
        }}
      >
        {children}
      </ApiKeysContext.Provider>
    );
  }
  
  
  function mapBackendApiKey(
    apiKey: BackendApiKey,
    projectName: string,
    environment:
      | "Production"
      | "Development"
  ): ApiKey {
    return {
      id:
        apiKey.id,
  
      name:
        apiKey.name,
  
      projectId:
        apiKey.projectId,
  
      projectName,
  
      environment,
  
      /*
       * Backend stores only the
       * safe visible prefix/hash,
       * never the complete secret.
       */
      prefix:
        apiKey.keyPrefix,
  
      lastFour:
        apiKey.keyPrefix.slice(
          -4
        ),
  
      status:
        apiKey.status ===
        "ACTIVE"
          ? "Active"
          : "Revoked",
  
      createdAt:
        new Date(
          apiKey.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),
  
      lastUsedAt:
        apiKey.lastUsedAt
          ? new Date(
              apiKey.lastUsedAt
            ).toLocaleString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          : null,
  
      /*
       * We do not yet return a
       * per-key request count from
       * the backend list endpoint.
       */
      requestCount: 0,
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