import { Router } from "express";

import {
  getRateLimitController,
  updateRateLimitController,
} from "../controllers/rateLimit.controller";

import {
  requireAuth,
} from "../middleware/auth";

import {
  requireProjectOwnership,
} from "../middleware/resourceOwnership";


const router = Router();


router.get(
  "/projects/:projectId/rate-limit",
  requireAuth,
  requireProjectOwnership,
  getRateLimitController
);


router.patch(
  "/projects/:projectId/rate-limit",
  requireAuth,
  requireProjectOwnership,
  updateRateLimitController
);


export default router;