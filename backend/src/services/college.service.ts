// backend/src/services/college.service.ts
import prisma from "../lib/prisma";

interface CreateCollegeData {
  name: string;
  location?: string;
}

class CollegeService {
  async getAllColleges() {
    return await prisma.college.findMany({
      orderBy: { name: "asc" },
    });
  }

  async createCollege(data: CreateCollegeData) {
    const existing = await prisma.college.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return existing;
    }

    return await prisma.college.create({
      data: {
        name: data.name,
        location: data.location,
      },
    });
  }
}

export default new CollegeService();
