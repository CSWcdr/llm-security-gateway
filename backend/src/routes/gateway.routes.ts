import {
    Router,
  } from "express";
  
  import {
    apiKeyAuth,
  } from "../middleware/apiKeyAuth";
  
  import {
    gatewayRateLimiter,
  } from "../middleware/rateLimiter";
  
  import {
    gatewayAuthTestController,
    gatewayChatController,
    gatewayScanController,
  } from "../controllers/gateway.controller";
  
  const router = Router();
  
  router.get(
    "/auth-test",
    apiKeyAuth,
    gatewayRateLimiter,
    gatewayAuthTestController
  );
  
  router.post(
    "/scan",
    apiKeyAuth,
    gatewayRateLimiter,
    gatewayScanController
  );
  
  router.post(
    "/chat",
    apiKeyAuth,
    gatewayRateLimiter,
    gatewayChatController
  );
  
  export default router;