// backend/src/services/experience.service.ts
import prisma from "../lib/prisma";

interface CreateExperienceData {
  userId: string;
  companyId: string;
  collegeId: string;
  role: string;
  interviewType: "ON_CAMPUS" | "OFF_CAMPUS" | "REFERRAL";
  interviewDate: Date;
  outcome: "SELECTED" | "REJECTED" | "WAITING";

  rounds: Array<{
    roundNumber: number;
    name: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    duration?: string;
    description?: string;
  }>;

  salaryOffered?: number;
  joiningBonus?: number;
  otherBenefits?: string;

  overallDifficulty: "EASY" | "MEDIUM" | "HARD";
  overallRating: number;
  reviewTitle: string;
  reviewText: string;
  applicationProcess?: string;
  preparationTips?: string;
  interviewerBehavior?: string;

  isAnonymous: boolean;
}

class ExperienceService {
  async createExperience(data: CreateExperienceData) {
    const experience = await prisma.companyExperience.create({
      data: {
        userId: data.userId,
        companyId: data.companyId,
        collegeId: data.collegeId,
        role: data.role,
        interviewType: data.interviewType,
        interviewDate: data.interviewDate,
        outcome: data.outcome,

        rounds: data.rounds, // ← Store as JSON

        salaryOffered: data.salaryOffered,
        joiningBonus: data.joiningBonus,
        otherBenefits: data.otherBenefits,

        overallDifficulty: data.overallDifficulty,
        overallRating: data.overallRating,
        reviewTitle: data.reviewTitle,
        reviewText: data.reviewText,
        applicationProcess: data.applicationProcess,
        preparationTips: data.preparationTips,
        interviewerBehavior: data.interviewerBehavior,

        isAnonymous: data.isAnonymous,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            graduationYear: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
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
            location: true,
          },
        },
      },
    });

    console.log("Experience created:", experience.id);
    return experience;
  }

  async getExperiencesByCompany(companyId: string) {
    return await prisma.companyExperience.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            graduationYear: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
        college: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getExperienceById(id: string) {
    return await prisma.companyExperience.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            graduationYear: true,
            imageUrl: true,
            college: {
              select: {
                name: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            industry: true,
            headquarters: true,
          },
        },
        college: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });
  }

  async getExperiencesByUser(userId: string) {
    return await prisma.companyExperience.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
            name: true,
          },
        },
      },
    });
  }

  async updateExperience(
    id: string,
    userId: string,
    data: Partial<CreateExperienceData>
  ) {
    // Verify ownership
    const experience = await prisma.companyExperience.findUnique({
      where: { id },
    });

    if (!experience || experience.userId !== userId) {
      throw new Error("Unauthorized or experience not found");
    }

    return await prisma.companyExperience.update({
      where: { id },
      data: {
        role: data.role,
        interviewType: data.interviewType,
        interviewDate: data.interviewDate,
        outcome: data.outcome,
        rounds: data.rounds, // ← Update JSON
        salaryOffered: data.salaryOffered,
        joiningBonus: data.joiningBonus,
        otherBenefits: data.otherBenefits,
        overallDifficulty: data.overallDifficulty,
        overallRating: data.overallRating,
        reviewTitle: data.reviewTitle,
        reviewText: data.reviewText,
        applicationProcess: data.applicationProcess,
        preparationTips: data.preparationTips,
        interviewerBehavior: data.interviewerBehavior,
        isAnonymous: data.isAnonymous,
      },
      include: {
        user: true,
        company: true,
        college: true,
      },
    });
  }

  async deleteExperience(id: string, userId: string) {
    // Verify ownership
    const experience = await prisma.companyExperience.findUnique({
      where: { id },
    });

    if (!experience || experience.userId !== userId) {
      throw new Error("Unauthorized or experience not found");
    }

    return await prisma.companyExperience.delete({
      where: { id },
    });
  }

  // Additional helper methods
  async upvoteExperience(experienceId: string, userId: string) {
    // Check if already voted
    const existingVote = await prisma.experienceVote.findUnique({
      where: {
        userId_experienceId: {
          userId,
          experienceId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === "UPVOTE") {
        // Remove upvote
        await prisma.experienceVote.delete({
          where: { id: existingVote.id },
        });
        await prisma.companyExperience.update({
          where: { id: experienceId },
          data: { upvotes: { decrement: 1 } },
        });
      } else {
        // Change downvote to upvote
        await prisma.experienceVote.update({
          where: { id: existingVote.id },
          data: { voteType: "UPVOTE" },
        });
        await prisma.companyExperience.update({
          where: { id: experienceId },
          data: {
            upvotes: { increment: 1 },
            downvotes: { decrement: 1 },
          },
        });
      }
    } else {
      // New upvote
      await prisma.experienceVote.create({
        data: {
          userId,
          experienceId,
          voteType: "UPVOTE",
        },
      });
      await prisma.companyExperience.update({
        where: { id: experienceId },
        data: { upvotes: { increment: 1 } },
      });
    }

    return await this.getExperienceById(experienceId);
  }

  async downvoteExperience(experienceId: string, userId: string) {
    // Similar logic to upvote but for downvotes
    const existingVote = await prisma.experienceVote.findUnique({
      where: {
        userId_experienceId: {
          userId,
          experienceId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.voteType === "DOWNVOTE") {
        await prisma.experienceVote.delete({
          where: { id: existingVote.id },
        });
        await prisma.companyExperience.update({
          where: { id: experienceId },
          data: { downvotes: { decrement: 1 } },
        });
      } else {
        await prisma.experienceVote.update({
          where: { id: existingVote.id },
          data: { voteType: "DOWNVOTE" },
        });
        await prisma.companyExperience.update({
          where: { id: experienceId },
          data: {
            downvotes: { increment: 1 },
            upvotes: { decrement: 1 },
          },
        });
      }
    } else {
      await prisma.experienceVote.create({
        data: {
          userId,
          experienceId,
          voteType: "DOWNVOTE",
        },
      });
      await prisma.companyExperience.update({
        where: { id: experienceId },
        data: { downvotes: { increment: 1 } },
      });
    }

    return await this.getExperienceById(experienceId);
  }
}

export default new ExperienceService();
