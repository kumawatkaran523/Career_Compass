import { Router } from "express";
import {
  generateRoadmap,
  getUserRoadmaps,
  getRoadmapById,
  deleteRoadmap,
  updateProgress,
  getProgress,
} from "../controllers/roadmap.controller";
import { validateRoadmapRequest } from "../middleware/validation.middleware";
import { roadmapCacheService } from "../utils/cache.util";

const router = Router();

router.post("/generate", validateRoadmapRequest, generateRoadmap);

router.get("/user/:userId", getUserRoadmaps);

router.get("/:roadmapId", getRoadmapById);

router.delete("/:roadmapId", deleteRoadmap);

router.post("/progress", updateProgress);

router.get("/progress/:userId/:roadmapId", getProgress);

router.get("/cache/stats", (req, res) => {
  res.json({
    size: roadmapCacheService.getCacheSize(),
    message: "Cache statistics"
  });
});

router.delete("/cache/clear", (req, res) => {
  roadmapCacheService.clear();
  res.json({ message: "Cache cleared successfully" });
});

export default router;
