import { Request, Response, NextFunction } from "express";
import geminiService from "../services/gemini.service";
import roadmapService from "../services/roadmap.service";
import progressService from "../services/progress.service";
import { sendSuccess, sendError } from "../utils/response.util";
import { RoadmapRequest } from "../types/roadmap.types";
import { roadmapCacheService } from "../utils/cache.util";

export const generateRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { technology, duration, difficulty, userId }: RoadmapRequest = req.body;

    if (!technology || !duration || !difficulty) {
      sendError(res, "Missing required fields: technology, duration, difficulty", 400);
      return;
    }

    const cachedRoadmap = roadmapCacheService.get(technology, duration, difficulty);

    let roadmapData;
    let fromCache = false;

    if (cachedRoadmap) {
      console.log("Serving from backend cache");
      roadmapData = cachedRoadmap;
      fromCache = true;
    } else {
      console.log("No cache found, generating new roadmap...");
      roadmapData = await geminiService.generateRoadmap(
        technology,
        duration,
        difficulty
      );
      roadmapCacheService.set(technology, duration, difficulty, roadmapData);
    }

    if (userId) {
      const existingRoadmap = await roadmapService.checkDuplicateRoadmap(
        userId,
        technology,
        duration,
        difficulty
      );

      if (!existingRoadmap) {
        const saved = await roadmapService.saveRoadmap(
          userId,
          technology,
          duration,
          difficulty,
          roadmapData
        );
        roadmapData.roadmapId = saved.id;
      } else {
        roadmapData.roadmapId = existingRoadmap.id;
      }
    }

    sendSuccess(
      res,
      { ...roadmapData, fromCache },
      fromCache ? "Roadmap retrieved from cache" : "Roadmap generated successfully"
    );
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    next(error);
  }
};

export const getUserRoadmaps = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    const roadmaps = await roadmapService.getUserRoadmaps(userId);

    sendSuccess(res, roadmaps, "User roadmaps retrieved successfully");
  } catch (error: any) {
    console.error("Get user roadmaps error:", error);
    next(error);
  }
};

export const getRoadmapById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roadmapId } = req.params;
    const { userId } = req.query;

    if (!roadmapId || !userId) {
      sendError(res, "Roadmap ID and User ID are required", 400);
      return;
    }

    const roadmap = await roadmapService.getRoadmapById(roadmapId, userId as string);

    if (!roadmap) {
      sendError(res, "Roadmap not found", 404);
      return;
    }

    sendSuccess(res, roadmap, "Roadmap retrieved successfully");
  } catch (error: any) {
    console.error("Get roadmap error:", error);
    next(error);
  }
};

export const deleteRoadmap = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { roadmapId } = req.params;
    const { userId } = req.body;

    if (!roadmapId || !userId) {
      sendError(res, "Roadmap ID and User ID are required", 400);
      return;
    }

    const deleted = await roadmapService.deleteRoadmap(roadmapId, userId);

    if (!deleted) {
      sendError(res, "Roadmap not found or already deleted", 404);
      return;
    }

    sendSuccess(res, null, "Roadmap deleted successfully");
  } catch (error: any) {
    console.error("Delete roadmap error:", error);
    next(error);
  }
};

export const updateProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, roadmapId, topicId, completed } = req.body;

    if (!userId || !roadmapId || !topicId || typeof completed !== 'boolean') {
      sendError(res, "Missing required fields", 400);
      return;
    }

    const progress = await progressService.updateProgress(
      userId,
      roadmapId,
      topicId,
      completed
    );

    sendSuccess(res, progress, "Progress updated successfully");
  } catch (error: any) {
    console.error("Update progress error:", error);
    next(error);
  }
};

export const getProgress = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, roadmapId } = req.params;

    if (!userId || !roadmapId) {
      sendError(res, "User ID and Roadmap ID are required", 400);
      return;
    }

    const progress = await progressService.getUserProgress(userId, roadmapId);
    const stats = await progressService.getProgressStats(userId, roadmapId);

    sendSuccess(res, { progress, stats }, "Progress retrieved successfully");
  } catch (error: any) {
    console.error("Get progress error:", error);
    next(error);
  }
};
