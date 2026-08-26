import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller";

const router = Router();

router.post(
  "/",
  createProjectController
);

router.get(
  "/",
  getProjectsController
);

router.get(
  "/:id",
  getProjectByIdController
);

router.patch(
  "/:id",
  updateProjectController
);

router.delete(
  "/:id",
  deleteProjectController
);

export default router;