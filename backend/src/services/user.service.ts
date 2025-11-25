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
}

export default new UserService();
