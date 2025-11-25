// backend/src/controllers/question.controller.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { sendSuccess, sendError } from "../utils/response.util";

const prisma = new PrismaClient();

// Create a new question
export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      companyId,
      collegeId,
      questionText,
      questionType,
      difficulty,
      round,
      topic,
      sampleAnswer,
      approach,
      questionLink,
    } = req.body;

    // Validation - only check required fields
    if (!companyId || !questionText || !questionType || !difficulty || !round) {
      sendError(res, "Missing required fields", 400);
      return;
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      sendError(res, "Company not found", 404);
      return;
    }

    // Verify college exists if provided
    if (collegeId) {
      const college = await prisma.college.findUnique({
        where: { id: collegeId },
      });

      if (!college) {
        sendError(res, "College not found", 404);
        return;
      }
    }

    // REMOVE THIS BLOCK - Don't verify user exists
    // if (userId) {
    //   const user = await prisma.user.findUnique({
    //     where: { id: userId },
    //   });
    //   if (!user) {
    //     sendError(res, "User not found", 404);
    //     return;
    //   }
    // }

    const question = await prisma.popularQuestion.create({
      data: {
        companyId,
        collegeId: collegeId || null,
        userId: userId || null, // Can be null
        questionText,
        questionType,
        difficulty,
        round,
        topic: topic || null,
        sampleAnswer: sampleAnswer || null,
        approach: approach || null,
        questionLink: questionLink || null,
        lastAskedDate: new Date(),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            graduationYear: true,
          },
        },
      },
    });

    sendSuccess(res, question, "Question created successfully", 201);
  } catch (error: any) {
    console.error("Create question error:", error);
    next(error);
  }
};

// Get questions by company
export const getQuestionsByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyId } = req.params;
    const { collegeId, questionType, difficulty, round, topic } = req.query;

    const where: any = {
      companyId,
      isApproved: true,
    };

    if (collegeId) where.collegeId = collegeId as string;
    if (questionType) where.questionType = questionType as string;
    if (difficulty) where.difficulty = difficulty as string;
    if (round) where.round = round as string;
    if (topic) where.topic = { contains: topic as string, mode: "insensitive" };

    const questions = await prisma.popularQuestion.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: [
        { askedCount: "desc" },
        { upvotes: "desc" },
        { createdAt: "desc" },
      ],
    });

    sendSuccess(res, questions, "Questions retrieved successfully");
  } catch (error: any) {
    console.error("Get questions by company error:", error);
    next(error);
  }
};

export const getVoteStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    const vote = await prisma.questionVote.findUnique({
      where: {
        userId_questionId: {
          userId: userId as string,
          questionId: id,
        },
      },
    });

    sendSuccess(
      res,
      {
        hasUpvoted: vote?.voteType === "UPVOTE",
        hasDownvoted: vote?.voteType === "DOWNVOTE",
      },
      "Vote status retrieved"
    );
  } catch (error: any) {
    console.error("Get vote status error:", error);
    next(error);
  }
};
// Get question by ID
export const getQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await prisma.popularQuestion.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            graduationYear: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!question) {
      sendError(res, "Question not found", 404);
      return;
    }

    sendSuccess(res, question, "Question retrieved successfully");
  } catch (error: any) {
    console.error("Get question by ID error:", error);
    next(error);
  }
};

// Update question
export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await prisma.popularQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      sendError(res, "Question not found", 404);
      return;
    }

    const updatedQuestion = await prisma.popularQuestion.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        college: true,
        user: true,
      },
    });

    sendSuccess(res, updatedQuestion, "Question updated successfully");
  } catch (error: any) {
    console.error("Update question error:", error);
    next(error);
  }
};

// Delete question
export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await prisma.popularQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      sendError(res, "Question not found", 404);
      return;
    }

    await prisma.popularQuestion.delete({
      where: { id },
    });

    sendSuccess(res, null, "Question deleted successfully");
  } catch (error: any) {
    console.error("Delete question error:", error);
    next(error);
  }
};

// Upvote question
export const upvoteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    // Check if user already voted
    const existingVote = await prisma.questionVote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: id,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === "UPVOTE") {
        // Remove upvote
        await prisma.questionVote.delete({
          where: { id: existingVote.id },
        });

        await prisma.popularQuestion.update({
          where: { id },
          data: { upvotes: { decrement: 1 } },
        });

        sendSuccess(res, null, "Upvote removed");
        return;
      } else {
        // Change from downvote to upvote
        await prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { voteType: "UPVOTE" },
        });

        await prisma.popularQuestion.update({
          where: { id },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        });

        sendSuccess(res, null, "Changed to upvote");
        return;
      }
    }

    // Create new upvote
    await prisma.questionVote.create({
      data: {
        userId,
        questionId: id,
        voteType: "UPVOTE",
      },
    });

    const question = await prisma.popularQuestion.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });

    sendSuccess(res, question, "Question upvoted successfully");
  } catch (error: any) {
    console.error("Upvote question error:", error);
    next(error);
  }
};

// Downvote question
export const downvoteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      sendError(res, "User ID is required", 400);
      return;
    }

    // Check if user already voted
    const existingVote = await prisma.questionVote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: id,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === "DOWNVOTE") {
        // Remove downvote
        await prisma.questionVote.delete({
          where: { id: existingVote.id },
        });

        await prisma.popularQuestion.update({
          where: { id },
          data: { downvotes: { decrement: 1 } },
        });

        sendSuccess(res, null, "Downvote removed");
        return;
      } else {
        // Change from upvote to downvote
        await prisma.questionVote.update({
          where: { id: existingVote.id },
          data: { voteType: "DOWNVOTE" },
        });

        await prisma.popularQuestion.update({
          where: { id },
          data: {
            downvotes: { increment: 1 },
            upvotes: { decrement: 1 },
          },
        });

        sendSuccess(res, null, "Changed to downvote");
        return;
      }
    }

    // Create new downvote
    await prisma.questionVote.create({
      data: {
        userId,
        questionId: id,
        voteType: "DOWNVOTE",
      },
    });

    const question = await prisma.popularQuestion.update({
      where: { id },
      data: { downvotes: { increment: 1 } },
    });

    sendSuccess(res, question, "Question downvoted successfully");
  } catch (error: any) {
    console.error("Downvote question error:", error);
    next(error);
  }
};

// Increment asked count
export const incrementAskedCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await prisma.popularQuestion.update({
      where: { id },
      data: {
        askedCount: { increment: 1 },
        lastAskedDate: new Date(),
      },
    });

    sendSuccess(res, question, "Asked count incremented");
  } catch (error: any) {
    console.error("Increment asked count error:", error);
    next(error);
  }
};
