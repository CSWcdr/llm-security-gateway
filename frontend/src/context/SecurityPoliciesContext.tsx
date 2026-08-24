import {
    createContext,
    useState,
    type ReactNode,
  } from "react";
  
  import {
    mockSecurityPolicies,
  } from "../data/mockData";
  
  import type {
    ProjectSecurityPolicy,
    SecurityRuleAction,
  } from "../types";
  
  type SecurityPoliciesContextType = {
    policies: ProjectSecurityPolicy[];
  
    getPolicyByProjectId: (
      projectId: string
    ) => ProjectSecurityPolicy | undefined;
  
    toggleRule: (
      projectId: string,
      ruleId: string
    ) => void;
  
    updateRuleAction: (
      projectId: string,
      ruleId: string,
      action: SecurityRuleAction
    ) => void;
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
    const [policies, setPolicies] =
      useState<ProjectSecurityPolicy[]>(
        mockSecurityPolicies
      );
  
    function getPolicyByProjectId(
      projectId: string
    ) {
      return policies.find(
        (policy) =>
          policy.projectId === projectId
      );
    }
  
    function toggleRule(
      projectId: string,
      ruleId: string
    ) {
      setPolicies((currentPolicies) =>
        currentPolicies.map((policy) => {
          if (
            policy.projectId !== projectId
          ) {
            return policy;
          }
  
          return {
            ...policy,
  
            updatedAt:
              new Date().toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }
              ),
  
            rules: policy.rules.map(
              (rule) =>
                rule.id === ruleId
                  ? {
                      ...rule,
                      enabled:
                        !rule.enabled,
                    }
                  : rule
            ),
          };
        })
      );
    }
  
    function updateRuleAction(
      projectId: string,
      ruleId: string,
      action: SecurityRuleAction
    ) {
      setPolicies((currentPolicies) =>
        currentPolicies.map((policy) => {
          if (
            policy.projectId !== projectId
          ) {
            return policy;
          }
  
          return {
            ...policy,
  
            updatedAt:
              new Date().toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }
              ),
  
            rules: policy.rules.map(
              (rule) =>
                rule.id === ruleId
                  ? {
                      ...rule,
                      action,
                    }
                  : rule
            ),
          };
        })
      );
    }
  
    return (
      <SecurityPoliciesContext.Provider
        value={{
          policies,
          getPolicyByProjectId,
          toggleRule,
          updateRuleAction,
        }}
      >
        {children}
      </SecurityPoliciesContext.Provider>
    );
  }