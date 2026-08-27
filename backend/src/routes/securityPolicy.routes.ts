import { Router } from "express";

import {
  getSecurityPolicyController,
  updateSecurityPolicyController,
} from "../controllers/securityPolicy.controller";

import {
  requireAuth,
} from "../middleware/auth";

import {
  requireProjectOwnership,
} from "../middleware/resourceOwnership";


const router = Router();


router.get(
  "/projects/:projectId/security-policy",
  requireAuth,
  requireProjectOwnership,
  getSecurityPolicyController
);


router.patch(
  "/projects/:projectId/security-policy",
  requireAuth,
  requireProjectOwnership,
  updateSecurityPolicyController
);


export default router;