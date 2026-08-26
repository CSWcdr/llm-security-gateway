import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";

import healthRoutes from "./routes/health.routes";
import databaseRoutes from "./routes/database.routes";
import projectRoutes from "./routes/project.routes";
import apiKeyRoutes from "./routes/apiKey.routes";
import gatewayRoutes from "./routes/gateway.routes";
import securityPolicyRoutes from "./routes/securityPolicy.routes";

import {
  errorHandler,
} from "./middleware/errorHandler";
import rateLimitRoutes from "./routes/rateLimit.routes";
import requestLogRoutes from "./routes/requestLog.routes";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();

app.use(
  helmet()
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

/*
 * Health
 */

app.use(
  "/api/health",
  healthRoutes
);

app.use(
  "/api/health/database",
  databaseRoutes
);

/*
 * Projects
 */

app.use(
  "/api/projects",
  projectRoutes
);

/*
 * API Key Management
 */

app.use(
  "/api",
  apiKeyRoutes
);

/*
 * Security Policies
 */

app.use(
  "/api",
  securityPolicyRoutes
);

/*
 * Protected Gateway
 */


app.use(
    "/api",
    rateLimitRoutes
  );

  app.use(
    "/api",
    requestLogRoutes
  );

  app.use(
    "/api",
    analyticsRoutes
  );

app.use(
  "/api/gateway",
  gatewayRoutes
);

/*
 * 404
 */

app.use(
  (_req, res) => {
    res.status(404).json({
      success: false,
      message:
        "Route not found.",
    });
  }
);

/*
 * Central Error Handler
 */

app.use(
  errorHandler
);

export default app;