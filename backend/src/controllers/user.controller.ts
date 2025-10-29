import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response.util";

export const syncUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clerkId, email, firstName, lastName, imageUrl } = req.body;

    if (!clerkId || !email) {
      sendError(res, "clerkId and email are required", 400);
      return;
    }

    const user = await userService.createOrUpdateUser({
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
    });

    sendSuccess(res, user, "User synced successfully", 201);
  } catch (error: any) {
    console.error("User sync error:", error);
    next(error);
  }
};

export const getUserByClerkId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      sendError(res, "clerkId is required", 400);
      return;
    }

    const user = await userService.getUserByClerkId(clerkId);

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, user, "User retrieved successfully");
  } catch (error: any) {
    console.error("Get user error:", error);
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      sendError(res, "clerkId is required", 400);
      return;
    }

    const deleted = await userService.deleteUser(clerkId);

    sendSuccess(res, deleted, "User deleted successfully");
  } catch (error: any) {
    console.error("Delete user error:", error);
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, users, "Users retrieved successfully");
  } catch (error: any) {
    console.error("Get all users error:", error);
    next(error);
  }
};
