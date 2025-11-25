// backend/src/routes/experience.routes.ts
import { Router } from "express";
import {
  createExperience,
  getExperiencesByCompany,
  getExperienceById,
  getExperiencesByUser,
  updateExperience,
  deleteExperience,
  upvoteExperience,
  downvoteExperience,
} from "../controllers/experience.controller";

const router = Router();

router.post("/", createExperience);
router.get("/company/:companyId", getExperiencesByCompany);
router.get("/user/:userId", getExperiencesByUser);
router.get("/:id", getExperienceById);
router.put("/:id", updateExperience);
router.delete("/:id", deleteExperience);
router.post("/:id/upvote", upvoteExperience);
router.post("/:id/downvote", downvoteExperience);

export default router;
