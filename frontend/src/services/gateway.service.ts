import axios from "axios";

import { api } from "../lib/api";

import type {
  GatewayRequestResult,
  GatewaySecurityCheck,
} from "../types";

type SendGatewayRequestInput = {
  apiKey: string;
  prompt: string;
};

type BackendFindingType =
  | "PROMPT_INJECTION"
  | "PII"
  | "SECRET";

type BackendFindingAction =
  | "BLOCK"
  | "WARN"
  | "MASK"
  | "ALLOW";

type BackendFinding = {
  type: BackendFindingType;
  detected: boolean;
  action: BackendFindingAction;
  matches: string[];
};

type BackendUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

type GatewaySuccessResponse = {
  success: true;
  message: string;

  data: {
    requestId: string;

    decision: "ALLOWED";

    processedPrompt: string;

    response: string;

    model: string;

    usage: BackendUsage;

    latencyMs: number;

    estimatedCostUsd: number;

    security: {
      inputFindings: BackendFinding[];
      outputFindings: BackendFinding[];
    };
  };
};

type GatewayBlockedData = {
  decision: "BLOCKED";

  stage?: "INPUT" | "OUTPUT";

  findings?: BackendFinding[];

  model?: string;

  usage?: BackendUsage;

  latencyMs?: number;

  estimatedCostUsd?: number;

  security?: {
    inputFindings?: BackendFinding[];
    outputFindings?: BackendFinding[];
  };
};

type GatewayErrorResponse = {
  success?: false;

  message?: string;

  data?: GatewayBlockedData;

  errors?: unknown;
};

function getFindingName(
  type: BackendFindingType
) {
  switch (type) {
    case "PROMPT_INJECTION":
      return "Prompt Injection";

    case "PII":
      return "PII Detection";

    case "SECRET":
      return "Secret Detection";
  }
}

function getFindingStatus(
  finding: BackendFinding
): GatewaySecurityCheck["status"] {
  if (!finding.detected) {
    return "passed";
  }

  if (finding.action === "BLOCK") {
    return "blocked";
  }

  return "warning";
}

function convertFindingToCheck(
  finding: BackendFinding,
  stage: "input" | "output"
): GatewaySecurityCheck {
  const name = getFindingName(
    finding.type
  );

  const prefix =
    stage === "output"
      ? "Output "
      : "";

  if (!finding.detected) {
    return {
      id: `${stage}-${finding.type.toLowerCase()}`,

      name: `${prefix}${name}`,

      description:
        stage === "input"
          ? `No ${name.toLowerCase()} issue detected in the request.`
          : `No ${name.toLowerCase()} issue detected in the LLM response.`,

      status: "passed",
    };
  }

  const matchCount =
    finding.matches.length;

  let description =
    `${name} detected. ` +
    `Security policy action: ${finding.action}.`;

  if (matchCount > 0) {
    description +=
      ` ${matchCount} match` +
      `${matchCount === 1 ? "" : "es"} found.`;
  }

  return {
    id: `${stage}-${finding.type.toLowerCase()}`,

    name: `${prefix}${name}`,

    description,

    status:
      getFindingStatus(finding),
  };
}

function buildBaseChecks(): GatewaySecurityCheck[] {
  return [
    {
      id: "authentication",

      name: "Authentication",

      description:
        "Gateway API key authenticated successfully.",

      status: "passed",
    },

    {
      id: "rate-limit",

      name: "Rate Limit",

      description:
        "Request passed the configured rate-limit policy.",

      status: "passed",
    },
  ];
}

function buildSecurityChecks(
  inputFindings: BackendFinding[] = [],
  outputFindings: BackendFinding[] = []
): GatewaySecurityCheck[] {
  return [
    ...buildBaseChecks(),

    ...inputFindings.map(
      (finding) =>
        convertFindingToCheck(
          finding,
          "input"
        )
    ),

    ...outputFindings.map(
      (finding) =>
        convertFindingToCheck(
          finding,
          "output"
        )
    ),
  ];
}

function createBlockedResult(
  data: GatewayBlockedData
): GatewayRequestResult {
  const inputFindings =
    data.security?.inputFindings ??
    data.findings ??
    [];

  const outputFindings =
    data.security?.outputFindings ??
    [];

  const inputTokens =
    data.usage?.inputTokens ?? 0;

  const outputTokens =
    data.usage?.outputTokens ?? 0;

  const model =
    data.stage === "INPUT"
      ? "Not called"
      : data.model ??
        "Backend configured model";

  return {
    requestId:
      "Blocked request — see Request Logs",

    status: "blocked",

    response: null,

    securityChecks:
      buildSecurityChecks(
        inputFindings,
        outputFindings
      ),

    model,

    latencyMs:
      data.latencyMs ?? 0,

    inputTokens,

    outputTokens,

    estimatedCost:
      data.estimatedCostUsd ?? 0,

    timestamp:
      new Date().toISOString(),
  };
}

export async function sendGatewayRequest(
  input: SendGatewayRequestInput
): Promise<GatewayRequestResult> {
  try {
    const response =
      await api.post<GatewaySuccessResponse>(
        "/gateway/chat",

        {
          prompt: input.prompt,
        },

        {
          headers: {
            "x-api-key":
              input.apiKey,
          },
        }
      );

    const data =
      response.data.data;

    return {
      requestId:
        data.requestId,

      status: "allowed",

      response:
        data.response,

      securityChecks:
        buildSecurityChecks(
          data.security
            .inputFindings,

          data.security
            .outputFindings
        ),

      model:
        data.model,

      latencyMs:
        data.latencyMs,

      inputTokens:
        data.usage.inputTokens,

      outputTokens:
        data.usage.outputTokens,

      estimatedCost:
        data.estimatedCostUsd,

      timestamp:
        new Date().toISOString(),
    };
  } catch (error) {
    if (
      !axios.isAxiosError<GatewayErrorResponse>(
        error
      )
    ) {
      throw new Error(
        "Unexpected gateway error."
      );
    }

    const statusCode =
      error.response?.status;

    const payload =
      error.response?.data;

    /*
     * Security-policy block.
     *
     * Both input-security blocks and
     * output-security blocks return 403.
     */
    if (
      statusCode === 403 &&
      payload?.data?.decision ===
        "BLOCKED"
    ) {
      return createBlockedResult(
        payload.data
      );
    }

    /*
     * Invalid, missing, expired or
     * otherwise rejected API key.
     */
    if (statusCode === 401) {
      throw new Error(
        payload?.message ??
          "Invalid Gateway API key."
      );
    }

    /*
     * Redis-backed gateway
     * rate limiter.
     */
    if (statusCode === 429) {
      throw new Error(
        payload?.message ??
          "Rate limit exceeded. Try again later."
      );
    }

    /*
     * Invalid prompt/body.
     */
    if (statusCode === 400) {
      throw new Error(
        payload?.message ??
          "Invalid gateway request."
      );
    }

    if (statusCode === 403) {
      throw new Error(
        payload?.message ??
          "Gateway request forbidden."
      );
    }

    if (
      statusCode &&
      statusCode >= 500
    ) {
      throw new Error(
        payload?.message ??
          "Gateway server error."
      );
    }

    throw new Error(
      payload?.message ??
        "Gateway request failed."
    );
  }
}