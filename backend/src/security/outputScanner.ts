import {
    detectPII,
    detectSecrets,
    type SecurityFinding,
  } from "./promptScanner";
  
  type SecurityAction =
    | "BLOCK"
    | "WARN"
    | "MASK"
    | "ALLOW";
  
  export type OutputFinding = {
    type: SecurityFinding["type"];
    detected: boolean;
    matches: string[];
    action: SecurityAction;
  };
  
  export function scanOutput(
    output: string,
    enabled: boolean,
    action: SecurityAction
  ) {
    const rawFindings = [
      detectPII(output),
      detectSecrets(output),
    ];
  
    const findings: OutputFinding[] =
      rawFindings.map(
        (finding) => ({
          ...finding,
  
          action:
            enabled
              ? action
              : "ALLOW",
        })
      );
  
    const shouldBlock =
      findings.some(
        (finding) =>
          finding.detected &&
          finding.action === "BLOCK"
      );
  
    return {
      shouldBlock,
      findings,
    };
  }