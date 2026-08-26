import {
    Router,
  } from "express";
  
  import {
    getAnalyticsDetailsController,
    getAnalyticsSummaryController,
  } from "../controllers/analytics.controller";
  
  const router =
    Router();
  
  router.get(
    "/projects/:projectId/analytics/summary",
    getAnalyticsSummaryController
  );
  
  router.get(
    "/projects/:projectId/analytics/details",
    getAnalyticsDetailsController
  );
  
  export default router;