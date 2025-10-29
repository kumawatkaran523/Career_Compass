import prisma from "../lib/prisma";
import { Roadmap } from "../types/roadmap.types";

class RoadmapService {
  async saveRoadmap(
    userId: string,
    technology: string,
    duration: string,
    difficulty: string,
    roadmapData: Roadmap
  ) {
    const totalWeeks = roadmapData.totalWeeks;
    const estimatedHours = roadmapData.estimatedHours;

    const savedRoadmap = await prisma.roadmap.create({
      data: {
        userId,
        technology,
        duration,
        difficulty,
        totalWeeks,
        estimatedHours,
        content: roadmapData as any,
      },
    });

    console.log("Roadmap saved to database:", savedRoadmap.id);
    return savedRoadmap;
  }

  async getUserRoadmaps(userId: string) {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        progress: true,
      },
    });

    return roadmaps;
  }

  async getRoadmapById(roadmapId: string, userId: string) {
    const roadmap = await prisma.roadmap.findFirst({
      where: {
        id: roadmapId,
        userId,
      },
      include: {
        progress: true,
      },
    });

    return roadmap;
  }

  async deleteRoadmap(roadmapId: string, userId: string) {
    const deleted = await prisma.roadmap.deleteMany({
      where: {
        id: roadmapId,
        userId,
      },
    });

    return deleted.count > 0;
  }

  async checkDuplicateRoadmap(
    userId: string,
    technology: string,
    duration: string,
    difficulty: string
  ) {
    const existing = await prisma.roadmap.findFirst({
      where: {
        userId,
        technology,
        duration,
        difficulty,
      },
    });

    return existing;
  }
}

export default new RoadmapService();
