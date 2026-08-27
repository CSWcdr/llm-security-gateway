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
  
  
  export type SecurityAction =
    | "BLOCK"
    | "WARN"
    | "MASK"
    | "ALLOW";
  
  
  export type SecurityPolicy = {
    id: string;
    projectId: string;
  
    promptInjectionEnabled: boolean;
    promptInjectionAction: SecurityAction;
  
    piiDetectionEnabled: boolean;
    piiDetectionAction: SecurityAction;
  
    secretDetectionEnabled: boolean;
    secretDetectionAction: SecurityAction;
  
    outputScanningEnabled: boolean;
    outputScanningAction: SecurityAction;
  
    createdAt: string;
    updatedAt: string;
  };
  
  
  type UpdateSecurityPolicyInput =
    Partial<
      Pick<
        SecurityPolicy,
        | "promptInjectionEnabled"
        | "promptInjectionAction"
        | "piiDetectionEnabled"
        | "piiDetectionAction"
        | "secretDetectionEnabled"
        | "secretDetectionAction"
        | "outputScanningEnabled"
        | "outputScanningAction"
      >
    >;
  
  
  type SecurityPolicyResponse = {
    success: boolean;
    message: string;
    data: SecurityPolicy;
  };
  
  
  type ErrorResponse = {
    success?: boolean;
    message?: string;
  };
  
  
  type SecurityPoliciesContextType = {
    policies: Record<
      string,
      SecurityPolicy
    >;
  
    loading: boolean;
  
    getSecurityPolicy: (
      projectId: string
    ) => SecurityPolicy | undefined;
  
    updateSecurityPolicy: (
      projectId: string,
      input: UpdateSecurityPolicyInput
    ) => Promise<SecurityPolicy>;
  
    refreshSecurityPolicies:
      () => Promise<void>;
  };
  
  
  export const SecurityPoliciesContext =
    createContext<
      SecurityPoliciesContextType | undefined
    >(undefined);
  
  
  type SecurityPoliciesProviderProps = {
    children: ReactNode;
  };
  
  
  export function SecurityPoliciesProvider({
    children,
  }: SecurityPoliciesProviderProps) {
    const {
      isAuthenticated,
      loading: authLoading,
    } = useAuth();
  
    const {
      projects,
    } = useProjects();
  
  
    const [
      policies,
      setPolicies,
    ] = useState<
      Record<string, SecurityPolicy>
    >({});
  
  
    const [
      loading,
      setLoading,
    ] = useState(false);
  
  
    const refreshSecurityPolicies =
      useCallback(
        async () => {
          if (
            !isAuthenticated ||
            projects.length === 0
          ) {
            setPolicies({});
            return;
          }
  
          try {
            setLoading(true);
  
            const responses =
              await Promise.all(
                projects.map(
                  (project) =>
                    api.get<SecurityPolicyResponse>(
                      `/projects/${project.id}/security-policy`
                    )
                )
              );
  
            const nextPolicies:
              Record<
                string,
                SecurityPolicy
              > = {};
  
            responses.forEach(
              (response) => {
                const policy =
                  response.data.data;
  
                nextPolicies[
                  policy.projectId
                ] = policy;
              }
            );
  
            setPolicies(
              nextPolicies
            );
          } catch (error) {
            console.error(
              getApiErrorMessage(
                error,
                "Failed to fetch security policies."
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
  
      refreshSecurityPolicies();
    }, [
      authLoading,
      refreshSecurityPolicies,
    ]);
  
  
    function getSecurityPolicy(
      projectId: string
    ) {
      return policies[
        projectId
      ];
    }
  
  
    async function updateSecurityPolicy(
      projectId: string,
      input:
        UpdateSecurityPolicyInput
    ) {
      try {
        const response =
          await api.patch<SecurityPolicyResponse>(
            `/projects/${projectId}/security-policy`,
            input
          );
  
        const updatedPolicy =
          response.data.data;
  
        setPolicies(
          (
            currentPolicies
          ) => ({
            ...currentPolicies,
  
            [projectId]:
              updatedPolicy,
          })
        );
  
        return updatedPolicy;
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Failed to update security policy."
          )
        );
      }
    }
  
  
    return (
      <SecurityPoliciesContext.Provider
        value={{
          policies,
          loading,
          getSecurityPolicy,
          updateSecurityPolicy,
          refreshSecurityPolicies,
        }}
      >
        {children}
      </SecurityPoliciesContext.Provider>
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