import prisma from "../lib/prisma";

interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
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
      },
      create: {
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
      },
    });

    console.log("User synced:", user.id);
    return user;
  }

  async getUserByClerkId(clerkId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        roadmaps: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async deleteUser(clerkId: string) {
    const deleted = await prisma.user.delete({
      where: { clerkId },
    });

    console.log("User deleted:", deleted.id);
    return deleted;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        roadmaps: true,
      },
    });

    return users;
  }
}

export default new UserService();
