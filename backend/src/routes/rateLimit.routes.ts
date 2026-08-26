import { Router } from "express";

import {
  getRateLimitController,
  updateRateLimitController,
} from "../controllers/rateLimit.controller";

const router = Router();

router.get(
  "/projects/:projectId/rate-limit",
  getRateLimitController
);

router.patch(
  "/projects/:projectId/rate-limit",
  updateRateLimitController
);

export default router;