export type SecurityFindingType =
  | "PROMPT_INJECTION"
  | "PII"
  | "SECRET";

export type SecurityFinding = {
  type: SecurityFindingType;
  detected: boolean;
  matches: string[];
};

function findMatches(
  text: string,
  patterns: RegExp[]
) {
  const matches: string[] = [];

  for (const pattern of patterns) {
    const result =
      text.match(pattern);

    if (result) {
      matches.push(...result);
    }
  }

  return [
    ...new Set(matches),
  ];
}

export function detectPromptInjection(
  prompt: string
): SecurityFinding {
  const patterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
    /disregard\s+(all\s+)?(previous|prior)\s+instructions/gi,
    /reveal\s+(your\s+)?system\s+prompt/gi,
    /show\s+(me\s+)?(your\s+)?system\s+prompt/gi,
    /developer\s+message/gi,
    /jailbreak/gi,
  ];

  const matches =
    findMatches(
      prompt,
      patterns
    );

  return {
    type: "PROMPT_INJECTION",
    detected:
      matches.length > 0,
    matches,
  };
}

export function detectPII(
  prompt: string
): SecurityFinding {
  const patterns = [
    /*
     * Email
     */
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,

    /*
     * Indian / common 10-digit phone
     */
    /\b(?:\+91[\s-]?)?[6-9]\d{9}\b/g,
  ];

  const matches =
    findMatches(
      prompt,
      patterns
    );

  return {
    type: "PII",
    detected:
      matches.length > 0,
    matches,
  };
}

export function detectSecrets(
  prompt: string
): SecurityFinding {
  const patterns = [
    /*
     * Our gateway API keys
     */
    /\blsg_live_[a-f0-9]{40,}\b/gi,

    /*
     * Common secret assignment patterns
     */
    /\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["']?[A-Za-z0-9_\-.]{8,}["']?/gi,
  ];

  const matches =
    findMatches(
      prompt,
      patterns
    );

  return {
    type: "SECRET",
    detected:
      matches.length > 0,
    matches,
  };
}

export function scanPrompt(
  prompt: string
) {
  return [
    detectPromptInjection(
      prompt
    ),

    detectPII(
      prompt
    ),

    detectSecrets(
      prompt
    ),
  ];
}