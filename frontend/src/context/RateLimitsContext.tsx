import {
    createContext,
    useState,
    type ReactNode,
  } from "react";
  
  import { mockRateLimitPolicies } from "../data/mockData";
  
  import type {
    RateLimitPolicy,
  } from "../types";
  
  type EditableRateLimitFields =
    | "requestsPerMinute"
    | "requestsPerHour"
    | "requestsPerDay"
    | "burstLimit";
  
  type RateLimitsContextType = {
    policies: RateLimitPolicy[];
  
    getPolicyByProjectId: (
      projectId: string
    ) => RateLimitPolicy | undefined;
  
    toggleRateLimit: (
      projectId: string
    ) => void;
  
    updateLimit: (
      projectId: string,
      field: EditableRateLimitFields,
      value: number
    ) => void;
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
    const [policies, setPolicies] =
      useState<RateLimitPolicy[]>(
        mockRateLimitPolicies
      );
  
    function getPolicyByProjectId(
      projectId: string
    ) {
      return policies.find(
        (policy) =>
          policy.projectId === projectId
      );
    }
  
    function toggleRateLimit(
      projectId: string
    ) {
      setPolicies((current) =>
        current.map((policy) =>
          policy.projectId === projectId
            ? {
                ...policy,
                enabled: !policy.enabled,
                updatedAt:
                  new Date().toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  ),
              }
            : policy
        )
      );
    }
  
    function updateLimit(
      projectId: string,
      field: EditableRateLimitFields,
      value: number
    ) {
      setPolicies((current) =>
        current.map((policy) =>
          policy.projectId === projectId
            ? {
                ...policy,
                [field]: value,
                updatedAt:
                  new Date().toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }
                  ),
              }
            : policy
        )
      );
    }
  
    return (
      <RateLimitsContext.Provider
        value={{
          policies,
          getPolicyByProjectId,
          toggleRateLimit,
          updateLimit,
        }}
      >
        {children}
      </RateLimitsContext.Provider>
    );
  }