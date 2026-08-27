import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    loginSchema,
    registerSchema,
  } from "../validators/auth.validator";
  
  import {
    comparePassword,
    createUser,
    findUserByEmail,
    findUserById,
    hashPassword,
  } from "../services/auth.service";
  
  import {
    generateAccessToken,
  } from "../utils/jwt";
  
  
  export async function registerController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        registerSchema.safeParse(
          req.body
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid registration data.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const {
        name,
        email,
        password,
      } =
        validation.data;
  
      const existingUser =
        await findUserByEmail(
          email
        );
  
      if (existingUser) {
        return res.status(409).json({
          success: false,
  
          message:
            "An account with this email already exists.",
        });
      }
  
      const passwordHash =
        await hashPassword(
          password
        );
  
      const user =
        await createUser({
          name,
          email,
          passwordHash,
        });
  
      const token =
        generateAccessToken({
          userId:
            user.id,
  
          email:
            user.email,
  
          role:
            user.role,
        });
  
      return res.status(201).json({
        success: true,
  
        message:
          "User registered successfully.",
  
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function loginController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        loginSchema.safeParse(
          req.body
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid login data.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const {
        email,
        password,
      } =
        validation.data;
  
      const user =
        await findUserByEmail(
          email
        );
  
      if (!user) {
        return res.status(401).json({
          success: false,
  
          message:
            "Invalid email or password.",
        });
      }
  
      const passwordMatches =
        await comparePassword(
          password,
          user.passwordHash
        );
  
      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
  
          message:
            "Invalid email or password.",
        });
      }
  
      const token =
        generateAccessToken({
          userId:
            user.id,
  
          email:
            user.email,
  
          role:
            user.role,
        });
  
      return res.status(200).json({
        success: true,
  
        message:
          "Login successful.",
  
        data: {
          user: {
            id:
              user.id,
  
            name:
              user.name,
  
            email:
              user.email,
  
            role:
              user.role,
  
            createdAt:
              user.createdAt,
  
            updatedAt:
              user.updatedAt,
          },
  
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function getCurrentUserController(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authUser =
        res.locals.authUser;
  
      const user =
        await findUserById(
          authUser.userId
        );
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
  
        message:
          "Current user fetched successfully.",
  
        data: {
          user: {
            id:
              user.id,
  
            name:
              user.name,
  
            email:
              user.email,
  
            role:
              user.role,
  
            createdAt:
              user.createdAt,
  
            updatedAt:
              user.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }