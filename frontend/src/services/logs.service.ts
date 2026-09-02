import {
    api,
  } from "../lib/api";
  
  import type {
    GatewayRequestLog,
    RequestStatus,
    SecurityFinding,
    SecuritySeverity,
  } from "../types";
  
  
  type BackendDecision =
    | "ALLOWED"
    | "BLOCKED"
    | "ERROR";
  
  
  type BackendStage =
    | "AUTH"
    | "RATE_LIMIT"
    | "INPUT_SECURITY"
    | "LLM"
    | "OUTPUT_SECURITY"
    | "COMPLETED";
  
  
  type BackendSecurityAction =
    | "BLOCK"
    | "WARN"
    | "MASK"
    | "ALLOW";
  
  
  type BackendFinding = {
    type?: string;
    detected?: boolean;
    matches?: string[];
    action?: BackendSecurityAction;
  };
  
  
  type BackendRequestLog = {
    id: string;
  
    projectId: string;
    apiKeyId: string | null;
  
    decision: BackendDecision;
    stage: BackendStage;
  
    model: string | null;
  
    processedPrompt: string | null;
    responsePreview: string | null;
  
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  
    latencyMs: number | null;
  
    estimatedCostUsd: number;
  
    inputFindings:
      | BackendFinding[]
      | null;
  
    outputFindings:
      | BackendFinding[]
      | null;
  
    createdAt: string;
  
    project?: {
      id: string;
      name: string;
    };
  
    apiKey?: {
      id: string;
      name: string;
      keyPrefix: string;
    } | null;
  };
  
  
  type BackendLogsResponse = {
    success: true;
  
    message: string;
  
    data: BackendRequestLog[];
  };
  
  
  type BackendLogResponse = {
    success: true;
  
    message: string;
  
    data: BackendRequestLog;
  };
  
  
  function mapDecision(
    decision: BackendDecision
  ): RequestStatus {
    if (decision === "ALLOWED") {
      return "Allowed";
    }
  
    if (decision === "BLOCKED") {
      return "Blocked";
    }
  
    /*
     * Existing frontend type has:
     * Allowed | Blocked | Warning.
     *
     * Backend ERROR is represented as
     * Warning in the current UI.
     */
    return "Warning";
  }
  
  
  function getSeverity(
    action?: BackendSecurityAction
  ): SecuritySeverity {
    if (action === "BLOCK") {
      return "High";
    }
  
    if (
      action === "WARN" ||
      action === "MASK"
    ) {
      return "Medium";
    }
  
    return "Low";
  }
  
  
  function formatFindingType(
    type?: string
  ) {
    if (!type) {
      return "Security Finding";
    }
  
    switch (type) {
      case "PROMPT_INJECTION":
        return "Prompt Injection";
  
      case "PII":
        return "PII Detection";
  
      case "SECRET":
        return "Secret Detection";
  
      default:
        return type
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(
            /\b\w/g,
            (character) =>
              character.toUpperCase()
          );
    }
  }
  
  
  function normalizeFindings(
    value: unknown
  ): BackendFinding[] {
    if (!Array.isArray(value)) {
      return [];
    }
  
    return value.filter(
      (finding): finding is BackendFinding =>
        typeof finding === "object" &&
        finding !== null
    );
  }
  
  
  function convertFindings(
    inputFindings: unknown,
    outputFindings: unknown
  ): SecurityFinding[] {
    const findings:
      SecurityFinding[] = [];
  
    const input =
      normalizeFindings(
        inputFindings
      );
  
    const output =
      normalizeFindings(
        outputFindings
      );
  
  
    input.forEach(
      (finding, index) => {
        if (!finding.detected) {
          return;
        }
  
        const matchCount =
          finding.matches?.length ?? 0;
  
        const action =
          finding.action ?? "ALLOW";
  
        findings.push({
          id:
            `input-${index}-${finding.type ?? "finding"}`,
  
          type:
            formatFindingType(
              finding.type
            ),
  
          severity:
            getSeverity(action),
  
          message:
            `Detected during input security processing. ` +
            `Policy action: ${action}. ` +
            `${matchCount} match${
              matchCount === 1
                ? ""
                : "es"
            } detected.`,
        });
      }
    );
  
  
    output.forEach(
      (finding, index) => {
        if (!finding.detected) {
          return;
        }
  
        const matchCount =
          finding.matches?.length ?? 0;
  
        const action =
          finding.action ?? "ALLOW";
  
        findings.push({
          id:
            `output-${index}-${finding.type ?? "finding"}`,
  
          type:
            `Output ${formatFindingType(
              finding.type
            )}`,
  
          severity:
            getSeverity(action),
  
          message:
            `Detected during output security processing. ` +
            `Policy action: ${action}. ` +
            `${matchCount} match${
              matchCount === 1
                ? ""
                : "es"
            } detected.`,
        });
      }
    );
  
  
    return findings;
  }
  
  
  function mapRequestLog(
    log: BackendRequestLog
  ): GatewayRequestLog {
    return {
      id:
        log.id,
  
      projectId:
        log.projectId,
  
      projectName:
        log.project?.name ??
        "Unknown Project",
  
      apiKeyName:
        log.apiKey?.name ??
        "Unavailable API Key",
  
      model:
        log.model ??
        "Not called",
  
      status:
        mapDecision(
          log.decision
        ),
  
      promptPreview:
        log.processedPrompt ??
        "Prompt unavailable",
  
      responsePreview:
        log.responsePreview,
  
      latencyMs:
        log.latencyMs ?? 0,
  
      inputTokens:
        log.inputTokens,
  
      outputTokens:
        log.outputTokens,
  
      estimatedCost:
        log.estimatedCostUsd,
  
      /*
       * Current backend schema does not
       * store client IP addresses.
       */
      ipAddress:
        "Not captured",
  
      createdAt:
        log.createdAt,
  
      securityFindings:
        convertFindings(
          log.inputFindings,
          log.outputFindings
        ),
    };
  }
  
  
  export async function getRequestLogs(
    projectId: string
  ): Promise<GatewayRequestLog[]> {
    const response =
      await api.get<BackendLogsResponse>(
        `/projects/${projectId}/logs`
      );
  
    return response.data.data.map(
      mapRequestLog
    );
  }
  
  
  export async function getRequestLogById(
    requestId: string
  ): Promise<GatewayRequestLog> {
    const response =
      await api.get<BackendLogResponse>(
        `/logs/${requestId}`
      );
  
    return mapRequestLog(
      response.data.data
    );
  }