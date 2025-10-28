import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { sendError, sendSuccess } from "../utils/response.util";
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fname, email } = req.body;

    if (!fname || !email) {
      sendError(res, "Missing required fields: fname, email", 400);
      return;
    }

    const user = await prisma.user.create({
      data: {
        fname,
        email,
      },
    });

    sendSuccess(res, user, "User created successfully", 201);
  } catch (error: any) {
    console.error("User creation error:", error);
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    sendSuccess(res, users);
  } catch (error: any) {
    console.error("Get users error:", error);
    next(error);
  }
};
