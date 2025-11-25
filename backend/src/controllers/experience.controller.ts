// backend/src/controllers/experience.controller.ts
import { Request, Response, NextFunction } from "express";
import experienceService from "../services/experience.service";
import { sendSuccess, sendError } from "../utils/response.util";
import prisma from "../lib/prisma";

export const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      companyId,
      collegeId,
      role,
      interviewType,
      interviewDate,
      outcome,
      rounds,
      salaryOffered,
      joiningBonus,
      otherBenefits,
      overallDifficulty,
      overallRating,
      reviewTitle,
      reviewText,
      applicationProcess,
      preparationTips,
      interviewerBehavior,
      isAnonymous,
    } = req.body;

    // Validation
    if (
      !userId ||
      !companyId ||
      !collegeId ||
      !role ||
      !interviewDate ||
      !outcome
    ) {
      sendError(res, "Missing required fields", 400);
      return;
    }

    // Validate companyId exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      sendError(
        res,
        "Company not found. Please make sure the company exists.",
        404
      );
      return;
    }

    // Validate collegeId exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      sendError(res, "College not found", 404);
      return;
    }

    // Validate userId exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
      sendError(res, "At least one interview round is required", 400);
      return;
    }

    if (!reviewTitle || !reviewText || reviewText.length < 100) {
      sendError(
        res,
        "Review title and detailed review (min 100 chars) are required",
        400
      );
      return;
    }

    const experience = await experienceService.createExperience({
      userId,
      companyId,
      collegeId,
      role,
      interviewType,
      interviewDate: new Date(interviewDate),
      outcome,
      rounds,
      salaryOffered: salaryOffered ? parseFloat(salaryOffered) : undefined,
      joiningBonus: joiningBonus ? parseFloat(joiningBonus) : undefined,
      otherBenefits,
      overallDifficulty,
      overallRating: parseFloat(overallRating),
      reviewTitle,
      reviewText,
      applicationProcess,
      preparationTips,
      interviewerBehavior,
      isAnonymous: Boolean(isAnonymous),
    });

    sendSuccess(res, experience, "Experience created successfully", 201);
  } catch (error: any) {
    console.error("Create experience error:", error);
    next(error);
  }
};

export const getExperiencesByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { companyId } = req.params;
    const experiences = await experienceService.getExperiencesByCompany(
      companyId
    );
    sendSuccess(res, experiences, "Experiences retrieved successfully");
  } catch (error: any) {
    console.error("Get experiences error:", error);
    next(error);
  }
};

export const getExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const experience = await experienceService.getExperienceById(id);

    if (!experience) {
      sendError(res, "Experience not found", 404);
      return;
    }

    sendSuccess(res, experience, "Experience retrieved successfully");
  } catch (error: any) {
    console.error("Get experience error:", error);
    next(error);
  }
};

export const getExperiencesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const experiences = await experienceService.getExperiencesByUser(userId);
    sendSuccess(res, experiences, "User experiences retrieved successfully");
  } catch (error: any) {
    console.error("Get user experiences error:", error);
    next(error);
  }
};

export const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId, salaryOffered, joiningBonus, overallRating } = req.body;

    const updateData = {
      ...req.body,
      salaryOffered: salaryOffered ? parseFloat(salaryOffered) : undefined,
      joiningBonus: joiningBonus ? parseFloat(joiningBonus) : undefined,
      overallRating: overallRating ? parseFloat(overallRating) : undefined,
    };

    const experience = await experienceService.updateExperience(
      id,
      userId,
      updateData
    );
    sendSuccess(res, experience, "Experience updated successfully");
  } catch (error: any) {
    console.error("Update experience error:", error);
    if (error.message === "Unauthorized or experience not found") {
      sendError(res, error.message, 403);
    } else {
      next(error);
    }
  }
};

export const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await experienceService.deleteExperience(id, userId);
    sendSuccess(res, null, "Experience deleted successfully");
  } catch (error: any) {
    console.error("Delete experience error:", error);
    if (error.message === "Unauthorized or experience not found") {
      sendError(res, error.message, 403);
    } else {
      next(error);
    }
  }
};

export const upvoteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const experience = await experienceService.upvoteExperience(id, userId);
    sendSuccess(res, experience, "Vote registered successfully");
  } catch (error: any) {
    console.error("Upvote experience error:", error);
    next(error);
  }
};

export const downvoteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const experience = await experienceService.downvoteExperience(id, userId);
    sendSuccess(res, experience, "Vote registered successfully");
  } catch (error: any) {
    console.error("Downvote experience error:", error);
    next(error);
  }
};
