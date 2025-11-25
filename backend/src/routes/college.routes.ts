// backend/src/routes/college.routes.ts
import { Router } from "express";
import {
  getAllColleges,
  createCollege,
} from "../controllers/college.controller";

const router = Router();

router.get("/", getAllColleges); // Get all colleges
router.post("/", createCollege); // Add new college

export default router;
