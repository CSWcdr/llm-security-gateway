import { Router } from "express";

import {
  createApiKeyController,
  deleteApiKeyController,
  getApiKeysController,
  revokeApiKeyController,
} from "../controllers/apiKey.controller";

import {
  requireAuth,
} from "../middleware/auth";

import {
  requireApiKeyOwnership,
  requireProjectOwnership,
} from "../middleware/resourceOwnership";

const router =
  Router();

router.post(
  "/projects/:projectId/api-keys",
  requireAuth,
  requireProjectOwnership,
  createApiKeyController
);

router.get(
  "/projects/:projectId/api-keys",
  requireAuth,
  requireProjectOwnership,
  getApiKeysController
);

router.patch(
  "/api-keys/:id/revoke",
  requireAuth,
  requireApiKeyOwnership,
  revokeApiKeyController
);

router.delete(
  "/api-keys/:id",
  requireAuth,
  requireApiKeyOwnership,
  deleteApiKeyController
);

export default router;