// backend/src/controllers/college.controller.ts
import { Request, Response, NextFunction } from "express";
import collegeService from "../services/college.service";
import { sendSuccess, sendError } from "../utils/response.util";

export const getAllColleges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const colleges = await collegeService.getAllColleges();
    sendSuccess(res, colleges, "Colleges retrieved successfully");
  } catch (error: any) {
    console.error("Get colleges error:", error);
    next(error);
  }
};

export const createCollege = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, location } = req.body;

    if (!name) {
      sendError(res, "College name is required", 400);
      return;
    }

    const college = await collegeService.createCollege({ name, location });
    sendSuccess(res, college, "College created successfully", 201);
  } catch (error: any) {
    console.error("Create college error:", error);
    next(error);
  }
};
