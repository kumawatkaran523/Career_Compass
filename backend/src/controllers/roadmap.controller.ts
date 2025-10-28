import { Request, Response, NextFunction } from "express";
import geminiService from "../services/gemini.service";
import { RoadmapRequest } from "../types/roadmap.types";
import { sendError, sendSuccess } from "../utils/response.util";

export const generateRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { technology, duration, difficulty }: RoadmapRequest = req.body;

    // Validation
    if (!technology || !duration || !difficulty) {
      sendError(res, "Missing required fields: technology, duration, difficulty", 400);
      return;
    }

    // Generate roadmap using Gemini service
    const roadmap = await geminiService.generateRoadmap(
      technology,
      duration,
      difficulty
    );

    sendSuccess(res, roadmap, "Roadmap generated successfully");
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    next(error);
  }
};