// backend/src/routes/question.routes.ts
import { Router } from "express";
import {
  createQuestion,
  getQuestionsByCompany,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  downvoteQuestion,
  incrementAskedCount,
  getVoteStatus, 
} from "../controllers/question.controller";
const router = Router();

router.post("/", createQuestion);
router.get("/company/:companyId", getQuestionsByCompany);
router.get("/:id", getQuestionById);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
router.post("/:id/upvote", upvoteQuestion);
router.post("/:id/downvote", downvoteQuestion);
router.post("/:id/increment-asked", incrementAskedCount);
router.get("/:id/vote-status", getVoteStatus); 
export default router;
