export type ProjectStatus = "Active" | "Paused";

export type Project = {
  id: string;
  name: string;
  description: string;
  environment: "Production" | "Development";
  status: ProjectStatus;

  requests: number;
  blockedRequests: number;
  apiKeys: number;

  createdAt: string;
};

export type ApiKeyStatus =
  | "Active"
  | "Revoked";

export type ApiKeyEnvironment =
  | "Production"
  | "Development";

export type ApiKey = {
  id: string;

  name: string;

  projectId: string;
  projectName: string;

  environment: ApiKeyEnvironment;

  prefix: string;
  lastFour: string;

  status: ApiKeyStatus;

  createdAt: string;

  lastUsedAt: string | null;

  requestCount: number;
};

export type GatewayCheckStatus =
  | "passed"
  | "blocked"
  | "warning";

export type GatewaySecurityCheck = {
  id: string;
  name: string;
  description: string;
  status: GatewayCheckStatus;
};

export type GatewayRequestResult = {
  requestId: string;

  status: "allowed" | "blocked";

  response: string | null;

  securityChecks: GatewaySecurityCheck[];

  model: string;

  latencyMs: number;

  inputTokens: number;

  outputTokens: number;

  estimatedCost: number;

  timestamp: string;
};

export type RequestStatus =
  | "Allowed"
  | "Blocked"
  | "Warning";

export type SecuritySeverity =
  | "Low"
  | "Medium"
  | "High";

export type SecurityFinding = {
  id: string;
  type: string;
  severity: SecuritySeverity;
  message: string;
};

export type GatewayRequestLog = {
  id: string;

  projectId: string;
  projectName: string;

  apiKeyName: string;

  model: string;

  status: RequestStatus;

  promptPreview: string;
  responsePreview: string | null;

  latencyMs: number;

  inputTokens: number;
  outputTokens: number;

  estimatedCost: number;

  ipAddress: string;

  createdAt: string;

  securityFindings: SecurityFinding[];
};

export type SecurityRuleAction =
  | "Block"
  | "Warn"
  | "Mask"
  | "Allow";

export type SecurityRuleType =
  | "prompt_injection"
  | "pii_detection"
  | "secret_detection"
  | "output_scanning";

export type SecurityRule = {
  id: string;

  type: SecurityRuleType;

  name: string;

  description: string;

  enabled: boolean;

  action: SecurityRuleAction;
};

export type ProjectSecurityPolicy = {
  projectId: string;

  projectName: string;

  rules: SecurityRule[];

  updatedAt: string;
};

export type RateLimitPolicy = {
    projectId: string;
    projectName: string;
  
    enabled: boolean;
  
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  
    burstLimit: number;
  
    currentMinuteUsage: number;
    currentHourUsage: number;
    currentDayUsage: number;
  
    updatedAt: string;
  };

  export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: "Administrator" | "Developer";
  };