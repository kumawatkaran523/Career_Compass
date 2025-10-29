import prisma from "../lib/prisma";

class ProgressService {
  async updateProgress(
    userId: string,
    roadmapId: string,
    topicId: string,
    completed: boolean
  ) {
    const progress = await prisma.progress.upsert({
      where: {
        userId_roadmapId_topicId: {
          userId,
          roadmapId,
          topicId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        roadmapId,
        topicId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    console.log(`Progress updated: ${topicId} - ${completed}`);
    return progress;
  }

  async getUserProgress(userId: string, roadmapId: string) {
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        roadmapId,
      },
    });

    return progress;
  }

  async bulkUpdateProgress(
    userId: string,
    roadmapId: string,
    updates: { topicId: string; completed: boolean }[]
  ) {
    const operations = updates.map((update) =>
      prisma.progress.upsert({
        where: {
          userId_roadmapId_topicId: {
            userId,
            roadmapId,
            topicId: update.topicId,
          },
        },
        update: {
          completed: update.completed,
          completedAt: update.completed ? new Date() : null,
        },
        create: {
          userId,
          roadmapId,
          topicId: update.topicId,
          completed: update.completed,
          completedAt: update.completed ? new Date() : null,
        },
      })
    );

    const results = await prisma.$transaction(operations);
    console.log(`Bulk progress update: ${results.length} topics`);
    return results;
  }

  async getProgressStats(userId: string, roadmapId: string) {
    const allProgress = await prisma.progress.findMany({
      where: { userId, roadmapId },
    });

    const completed = allProgress.filter((p) => p.completed).length;
    const total = allProgress.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completed,
      total,
      percentage,
    };
  }
}

export default new ProgressService();
