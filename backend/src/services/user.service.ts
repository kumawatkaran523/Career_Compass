// backend/src/services/user.service.ts
import prisma from "../lib/prisma";

interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  collegeId?: string;
  graduationYear?: number;
}

class UserService {
  async createOrUpdateUser(userData: ClerkUserData) {
    const user = await prisma.user.upsert({
      where: { clerkId: userData.clerkId },
      update: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        collegeId: userData.collegeId,
        graduationYear: userData.graduationYear,
      },
      create: {
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        collegeId: userData.collegeId,
        graduationYear: userData.graduationYear,
      },
      include: {
        college: true,
      },
    });

    return user;
  }

  async getUserByClerkId(clerkId: string) {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        college: true,
        roadmaps: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: { college: true },
    });
  }

  async deleteUser(clerkId: string) {
    return await prisma.user.delete({
      where: { clerkId },
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        college: true,
        roadmaps: true,
      },
    });
  }

  async getUserStats(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        resumeAnalyses: {
          orderBy: { analyzedAt: "desc" },
          take: 1,
        },
        roadmaps: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
        progress: {
          where: { completed: true },
        },
        companyExperiences: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    if (!user) {
      return null;
    }

    // Calculate stats
    const skillsAnalyzed = user.resumeAnalyses.length;
    const careerPaths = user.roadmaps.length;
    const problemsSolved = user.progress.length;

    // Count certifications from resume skills
    const certifications = user.resumeAnalyses.reduce((acc, analysis) => {
      const skills = analysis.skills as any[];
      return (
        acc + (skills?.filter((s) => s.type === "certification").length || 0)
      );
    }, 0);

    // Build recent activity
    const recentActivity = [];

    // Add recent resume analysis
    if (user.resumeAnalyses.length > 0) {
      const latest = user.resumeAnalyses[0];
      recentActivity.push({
        type: "resume",
        title: "Resume Analyzed",
        description: `ATS Score: ${latest.atsScore}/100 • ${new Date(
          latest.analyzedAt
        ).toLocaleDateString()}`,
        link: "/dashboard/resume-analyze",
        iconColor: "bg-primary/10",
        date: latest.analyzedAt,
      });
    }

    // Add recent roadmaps
    user.roadmaps.forEach((roadmap) => {
      recentActivity.push({
        type: "roadmap",
        title: `${roadmap.technology} Roadmap`,
        description: `${roadmap.duration} • ${roadmap.difficulty} • ${new Date(
          roadmap.createdAt
        ).toLocaleDateString()}`,
        link: "/dashboard/careerPaths",
        iconColor: "bg-blue-400/10",
        date: roadmap.createdAt,
      });
    });

    // Add recent experiences
    user.companyExperiences.forEach((exp) => {
      recentActivity.push({
        type: "experience",
        title: `Interview Experience Shared`,
        description: `${exp.role} • ${exp.outcome} • ${new Date(
          exp.createdAt
        ).toLocaleDateString()}`,
        link: "/dashboard/interview-questions",
        iconColor: "bg-yellow-400/10",
        date: exp.createdAt,
      });
    });

    // Sort by date and take top 5
    recentActivity.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      skillsAnalyzed,
      careerPaths,
      problemsSolved,
      certifications,
      recentActivity: recentActivity.slice(0, 5),
    };
  }
}

export default new UserService();
