import { Router } from "express";

import {
  getSecurityPolicyController,
  updateSecurityPolicyController,
} from "../controllers/securityPolicy.controller";

const router = Router();

router.get(
  "/projects/:projectId/security-policy",
  getSecurityPolicyController
);

router.patch(
  "/projects/:projectId/security-policy",
  updateSecurityPolicyController
);

export default router;