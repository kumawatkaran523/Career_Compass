import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util";

export const validateRoadmapRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { technology, duration, difficulty } = req.body;

  const validDurations = ["1 Week", "2 Weeks", "1 Month", "3 Months", "6 Months"];
  const validDifficulties = ["Beginner", "Intermediate", "Advanced"];

  if (!technology || typeof technology !== "string") {
    sendError(res, "Invalid or missing technology field", 400);
    return;
  }

  if (!validDurations.includes(duration)) {
    sendError(res, `Invalid duration. Must be one of: ${validDurations.join(", ")}`, 400);
    return;
  }

  if (!validDifficulties.includes(difficulty)) {
    sendError(res, `Invalid difficulty. Must be one of: ${validDifficulties.join(", ")}`, 400);
    return;
  }

  next();
};
