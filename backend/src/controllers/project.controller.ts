import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    createProjectSchema,
    projectIdSchema,
    updateProjectSchema,
  } from "../validators/project.validator";
  
  import {
    createProject,
    deleteProject,
    getProjectByIdForOwner,
    getProjectsByOwner,
    updateProject,
  } from "../services/project.service";
  
  
  export async function createProjectController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        createProjectSchema.safeParse(
          req.body
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project data.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const ownerId =
        res.locals.authUser.userId;
  
      const project =
        await createProject({
          ...validation.data,
          ownerId,
        });
  
      return res.status(201).json({
        success: true,
  
        message:
          "Project created successfully.",
  
        data:
          project,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function getProjectsController(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ownerId =
        res.locals.authUser.userId;
  
      const projects =
        await getProjectsByOwner(
          ownerId
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Projects fetched successfully.",
  
        data:
          projects,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function getProjectByIdController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        projectIdSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project ID.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const ownerId =
        res.locals.authUser.userId;
  
      const project =
        await getProjectByIdForOwner(
          validation.data.id,
          ownerId
        );
  
      if (!project) {
        return res.status(404).json({
          success: false,
  
          message:
            "Project not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
  
        message:
          "Project fetched successfully.",
  
        data:
          project,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function updateProjectController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idValidation =
        projectIdSchema.safeParse(
          req.params
        );
  
      if (!idValidation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project ID.",
  
          errors:
            idValidation.error.flatten(),
        });
      }
  
      const bodyValidation =
        updateProjectSchema.safeParse(
          req.body
        );
  
      if (!bodyValidation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project data.",
  
          errors:
            bodyValidation.error.flatten(),
        });
      }
  
      const ownerId =
        res.locals.authUser.userId;
  
      const existingProject =
        await getProjectByIdForOwner(
          idValidation.data.id,
          ownerId
        );
  
      if (!existingProject) {
        return res.status(404).json({
          success: false,
  
          message:
            "Project not found.",
        });
      }
  
      const project =
        await updateProject(
          idValidation.data.id,
          bodyValidation.data
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Project updated successfully.",
  
        data:
          project,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function deleteProjectController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        projectIdSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project ID.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const ownerId =
        res.locals.authUser.userId;
  
      const existingProject =
        await getProjectByIdForOwner(
          validation.data.id,
          ownerId
        );
  
      if (!existingProject) {
        return res.status(404).json({
          success: false,
  
          message:
            "Project not found.",
        });
      }
  
      await deleteProject(
        validation.data.id
      );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Project deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }