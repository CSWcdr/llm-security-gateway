import type {
    AppliedFinding,
  } from "./policyEngine";
  
  export function maskSensitiveData(
    text: string,
    findings: AppliedFinding[]
  ) {
    let maskedText = text;
  
    for (const finding of findings) {
      if (
        !finding.detected ||
        finding.action !== "MASK"
      ) {
        continue;
      }
  
      for (
        const match
        of finding.matches
      ) {
        maskedText =
          maskedText.replaceAll(
            match,
            "[MASKED]"
          );
      }
    }
  
    return maskedText;
  }