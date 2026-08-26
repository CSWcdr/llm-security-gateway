import type {
    SecurityFinding,
  } from "./promptScanner";
  
  type SecurityAction =
    | "BLOCK"
    | "WARN"
    | "MASK"
    | "ALLOW";
  
  type SecurityPolicyInput = {
    promptInjectionEnabled: boolean;
    promptInjectionAction: SecurityAction;
  
    piiDetectionEnabled: boolean;
    piiDetectionAction: SecurityAction;
  
    secretDetectionEnabled: boolean;
    secretDetectionAction: SecurityAction;
  };
  
  export type AppliedFinding = {
    type: SecurityFinding["type"];
    detected: boolean;
    action: SecurityAction;
    matches: string[];
  };
  
  export function applySecurityPolicy(
    findings: SecurityFinding[],
    policy: SecurityPolicyInput
  ) {
    const appliedFindings: AppliedFinding[] =
      findings.map(
        (finding) => {
          switch (finding.type) {
            case "PROMPT_INJECTION":
              return {
                ...finding,
  
                action:
                  policy
                    .promptInjectionEnabled
                    ? policy
                        .promptInjectionAction
                    : "ALLOW",
              };
  
            case "PII":
              return {
                ...finding,
  
                action:
                  policy
                    .piiDetectionEnabled
                    ? policy
                        .piiDetectionAction
                    : "ALLOW",
              };
  
            case "SECRET":
              return {
                ...finding,
  
                action:
                  policy
                    .secretDetectionEnabled
                    ? policy
                        .secretDetectionAction
                    : "ALLOW",
              };
          }
        }
      );
  
    const shouldBlock =
      appliedFindings.some(
        (finding) =>
          finding.detected &&
          finding.action === "BLOCK"
      );
  
    return {
      shouldBlock,
      findings:
        appliedFindings,
    };
  }