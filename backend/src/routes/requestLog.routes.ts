import { Router } from "express";

import {
  getRequestLogByIdController,
  getRequestLogsController,
} from "../controllers/requestLog.controller";

import {
  requireAuth,
} from "../middleware/auth";

import {
  requireProjectOwnership,
  requireRequestLogOwnership,
} from "../middleware/resourceOwnership";


const router = Router();


router.get(
  "/projects/:projectId/logs",
  requireAuth,
  requireProjectOwnership,
  getRequestLogsController
);


router.get(
  "/logs/:id",
  requireAuth,
  requireRequestLogOwnership,
  getRequestLogByIdController
);


export default router;