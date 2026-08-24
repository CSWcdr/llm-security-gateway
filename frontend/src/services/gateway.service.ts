import type {
    GatewayRequestResult,
    GatewaySecurityCheck,
  } from "../types";
  
  type SendGatewayRequestInput = {
    projectId: string;
    prompt: string;
    model: string;
  };
  
  function delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
  
  function containsPromptInjection(
    prompt: string
  ) {
    const suspiciousPatterns = [
      "ignore previous instructions",
      "ignore all previous",
      "system prompt",
      "developer message",
      "reveal your instructions",
      "bypass security",
      "jailbreak",
    ];
  
    const normalizedPrompt =
      prompt.toLowerCase();
  
    return suspiciousPatterns.some(
      (pattern) =>
        normalizedPrompt.includes(pattern)
    );
  }
  
  function containsPII(prompt: string) {
    const emailPattern =
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  
    const phonePattern =
      /\b\d{10}\b/;
  
    return (
      emailPattern.test(prompt) ||
      phonePattern.test(prompt)
    );
  }
  
  function containsPossibleSecret(
    prompt: string
  ) {
    const normalizedPrompt =
      prompt.toLowerCase();
  
    return (
      normalizedPrompt.includes("api_key=") ||
      normalizedPrompt.includes("password=") ||
      normalizedPrompt.includes("secret=") ||
      normalizedPrompt.includes("sk-")
    );
  }
  
  export async function sendGatewayRequest(
    input: SendGatewayRequestInput
  ): Promise<GatewayRequestResult> {
    const startedAt = performance.now();
  
    /*
     * Simulate network + security
     * processing latency.
     */
    await delay(900);
  
    const promptInjection =
      containsPromptInjection(
        input.prompt
      );
  
    const piiDetected =
      containsPII(input.prompt);
  
    const secretDetected =
      containsPossibleSecret(
        input.prompt
      );
  
    const securityChecks: GatewaySecurityCheck[] =
      [
        {
          id: "auth",
          name: "Authentication",
          description:
            "Project and API credential verified.",
          status: "passed",
        },
  
        {
          id: "rate-limit",
          name: "Rate Limit",
          description:
            "Request is within the configured quota.",
          status: "passed",
        },
  
        {
          id: "prompt-injection",
          name: "Prompt Injection",
          description: promptInjection
            ? "Potential instruction override attack detected."
            : "No prompt injection patterns detected.",
          status: promptInjection
            ? "blocked"
            : "passed",
        },
  
        {
          id: "pii",
          name: "PII Detection",
          description: piiDetected
            ? "Potential personal information detected."
            : "No obvious personal information detected.",
          status: piiDetected
            ? "warning"
            : "passed",
        },
  
        {
          id: "secret",
          name: "Secret Detection",
          description: secretDetected
            ? "Potential credential or secret detected."
            : "No obvious secrets detected.",
          status: secretDetected
            ? "warning"
            : "passed",
        },
      ];
  
    /*
     * For the mock gateway,
     * prompt injection is our only
     * hard blocking condition.
     */
    const blocked =
      promptInjection;
  
    const latencyMs = Math.round(
      performance.now() - startedAt
    );
  
    if (blocked) {
      return {
        requestId:
          crypto.randomUUID(),
  
        status: "blocked",
  
        response: null,
  
        securityChecks,
  
        model: input.model,
  
        latencyMs,
  
        inputTokens:
          Math.max(
            1,
            Math.round(
              input.prompt.length / 4
            )
          ),
  
        outputTokens: 0,
  
        estimatedCost: 0,
  
        timestamp:
          new Date().toISOString(),
      };
    }
  
    /*
     * Mock LLM response.
     *
     * Later this entire section
     * will be replaced by a real
     * backend + Gemini/OpenAI call.
     */
    const response =
      `Gateway request accepted successfully.\n\n` +
      `Your prompt was processed securely for project ${input.projectId}.\n\n` +
      `Mock LLM Response:\n` +
      `This is a simulated response from ${input.model}. ` +
      `Once the backend is connected, the real model response will appear here.`;
  
    const inputTokens =
      Math.max(
        1,
        Math.round(
          input.prompt.length / 4
        )
      );
  
    const outputTokens =
      Math.round(
        response.length / 4
      );
  
    return {
      requestId:
        crypto.randomUUID(),
  
      status: "allowed",
  
      response,
  
      securityChecks,
  
      model: input.model,
  
      latencyMs,
  
      inputTokens,
  
      outputTokens,
  
      estimatedCost: 0.0014,
  
      timestamp:
        new Date().toISOString(),
    };
  }