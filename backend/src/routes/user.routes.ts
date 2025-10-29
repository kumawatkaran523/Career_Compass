import { Router } from "express";
import { 
  syncUser, 
  getUserByClerkId, 
  deleteUser,
  getAllUsers 
} from "../controllers/user.controller";

const router = Router();

router.post("/sync", syncUser);

router.get("/clerk/:clerkId", getUserByClerkId);

router.delete("/clerk/:clerkId", deleteUser);

router.get("/", getAllUsers);

export default router;
