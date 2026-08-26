import {
    Router,
  } from "express";
  
  import {
    createApiKeyController,
    deleteApiKeyController,
    getApiKeysController,
    revokeApiKeyController,
  } from "../controllers/apiKey.controller";
  
  const router = Router();
  
  /*
   * Project API Keys
   */
  
  router.post(
    "/projects/:projectId/api-keys",
    createApiKeyController
  );
  
  router.get(
    "/projects/:projectId/api-keys",
    getApiKeysController
  );
  
  /*
   * Individual API Key actions
   */
  
  router.patch(
    "/api-keys/:id/revoke",
    revokeApiKeyController
  );
  
  router.delete(
    "/api-keys/:id",
    deleteApiKeyController
  );
  
  export default router;