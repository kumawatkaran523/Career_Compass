import { Router } from "express";
import {
  saveAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/resumeAnalysis.controller";

const router = Router();

// Save new analysis
router.post("/", saveAnalysis);

// Get all analyses for a user
router.get("/user/:userId", getUserAnalyses);

// Get specific analysis
router.post("/:id/view", getAnalysisById);

// Delete analysis
router.delete("/:id", deleteAnalysis);

export default router;