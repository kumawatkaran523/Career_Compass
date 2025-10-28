import { Router } from "express";
import { generateRoadmap } from "../controllers/roadmap.controller";
import { validateRoadmapRequest } from "../middleware/validation.middleware";
const router = Router();

router.post("/generate", validateRoadmapRequest, generateRoadmap);

export default router;
