// backend/src/routes/user.routes.ts
import { Router } from "express";
import {
  syncUser,
  getUserByClerkId,
  deleteUser,
  getAllUsers,
  getUserStats, // Add this
} from "../controllers/user.controller";

const router = Router();

router.post("/sync", syncUser);

router.get("/clerk/:clerkId", getUserByClerkId);

router.get("/clerk/:clerkId/stats", getUserStats); // Add this route

router.delete("/clerk/:clerkId", deleteUser);

router.get("/", getAllUsers);

export default router;
