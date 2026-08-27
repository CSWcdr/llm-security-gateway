import { Router } from "express";

import {
  getAnalyticsDetailsController,
  getAnalyticsSummaryController,
} from "../controllers/analytics.controller";

import {
  requireAuth,
} from "../middleware/auth";

import {
  requireProjectOwnership,
} from "../middleware/resourceOwnership";


const router = Router();


router.get(
  "/projects/:projectId/analytics/summary",
  requireAuth,
  requireProjectOwnership,
  getAnalyticsSummaryController
);


router.get(
  "/projects/:projectId/analytics/details",
  requireAuth,
  requireProjectOwnership,
  getAnalyticsDetailsController
);


export default router;