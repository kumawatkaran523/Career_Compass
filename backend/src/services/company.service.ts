// backend/src/services/company.service.ts
import prisma from "../lib/prisma";

interface CreateCompanyData {
  name: string;
  logo?: string;
  website?: string;
  industry: string;
  description?: string;
  headquarters?: string;
  employeeCount?: string;
}

class CompanyService {
  async getAllCompanies() {
    return await prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            experiences: true,
            popularQuestions: true,
          },
        },
        experiences: {
          select: {
            collegeId: true,
          },
        },
      },
    });
  }

  async getCompanyById(id: string) {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            experiences: true,
            popularQuestions: true,
            companyVisits: true,
          },
        },
      },
    });
  }

  async getCompanyByName(name: string) {
    return await prisma.company.findUnique({
      where: { name },
    });
  }

  async createCompany(data: CreateCompanyData) {
    const existing = await this.getCompanyByName(data.name);
    if (existing) {
      return existing;
    }

    return await prisma.company.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        industry: data.industry,
        description: data.description,
        headquarters: data.headquarters,
        employeeCount: data.employeeCount,
      },
    });
  }

  async searchCompanies(query: string) {
    return await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { industry: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
      take: 20,
    });
  }

  async getCompaniesByIndustry(industry: string) {
    return await prisma.company.findMany({
      where: { industry },
      orderBy: { name: "asc" },
    });
  }

  async getCompanyInsights(companyId: string, collegeId?: string) {
    const experiences = await prisma.companyExperience.findMany({
      where: { companyId },
      include: {
        college: true,
      },
    });

    if (experiences.length === 0) {
      return {
        hasData: false,
        collegeInsights: null,
        globalInsights: null,
      };
    }

    const collegeExperiences = collegeId
      ? experiences.filter((exp) => exp.collegeId === collegeId)
      : [];

    const collegeInsights =
      collegeExperiences.length > 0
        ? {
            totalExperiences: collegeExperiences.length,
            avgDifficulty: this.calculateAvgDifficulty(collegeExperiences),
            avgRating: this.calculateAvgRating(collegeExperiences),
            successRate: this.calculateSuccessRate(collegeExperiences),
            avgSalary: this.calculateAvgSalary(collegeExperiences),
            commonRoles: this.getCommonRoles(collegeExperiences),
            lastVisit: this.getLastVisit(collegeExperiences),
            yearsVisited: this.getYearsVisited(collegeExperiences),
          }
        : null;

    const globalInsights = {
      totalExperiences: experiences.length,
      avgDifficulty: this.calculateAvgDifficulty(experiences),
      avgRating: this.calculateAvgRating(experiences),
      avgSalary: this.calculateAvgSalary(experiences),
      topColleges: this.getTopColleges(experiences),
      commonRoles: this.getCommonRoles(experiences),
    };

    return {
      hasData: true,
      collegeInsights,
      globalInsights,
    };
  }

  private calculateAvgDifficulty(experiences: any[]): string {
    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 };
    const avg =
      experiences.reduce(
        (sum, exp) =>
          sum +
          (difficultyMap[exp.overallDifficulty as keyof typeof difficultyMap] ||
            2),
        0
      ) / experiences.length;

    if (avg < 1.5) return "Easy";
    if (avg < 2.5) return "Medium";
    return "Hard";
  }

  private calculateAvgRating(experiences: any[]): number {
    const sum = experiences.reduce((sum, exp) => sum + exp.overallRating, 0);
    return Math.round((sum / experiences.length) * 10) / 10;
  }

  private calculateSuccessRate(experiences: any[]): number {
    const selected = experiences.filter(
      (exp) => exp.outcome === "SELECTED"
    ).length;
    return Math.round((selected / experiences.length) * 100);
  }

  private calculateAvgSalary(experiences: any[]): number {
    const salaries = experiences
      .filter((exp) => exp.salaryOffered)
      .map((exp) => exp.salaryOffered);

    if (salaries.length === 0) return 0;

    const sum = salaries.reduce((sum: number, sal: number) => sum + sal, 0);
    return Math.round((sum / salaries.length) * 10) / 10;
  }

  private getCommonRoles(experiences: any[]): string[] {
    const roleCounts: Record<string, number> = {};

    experiences.forEach((exp) => {
      roleCounts[exp.role] = (roleCounts[exp.role] || 0) + 1;
    });

    return Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([role]) => role);
  }

  private getLastVisit(experiences: any[]): string {
    const dates = experiences.map((exp) => new Date(exp.interviewDate));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
    return latest.toISOString();
  }

  private getYearsVisited(experiences: any[]): number[] {
    const years = experiences.map((exp) =>
      new Date(exp.interviewDate).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a);
  }

  private getTopColleges(experiences: any[]): string[] {
    const collegeCounts: Record<string, number> = {};

    experiences.forEach((exp) => {
      if (exp.college) {
        collegeCounts[exp.college.name] =
          (collegeCounts[exp.college.name] || 0) + 1;
      }
    });

    return Object.entries(collegeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }

  async getSalaryInsights(companyId: string, collegeId?: string) {
    const experiences = await prisma.companyExperience.findMany({
      where: {
        companyId,
        salaryOffered: { not: null },
      },
      select: {
        role: true,
        salaryOffered: true,
        collegeId: true,
      },
    });

    if (experiences.length === 0) {
      return null;
    }

    const collegeExperiences = collegeId
      ? experiences.filter((exp) => exp.collegeId === collegeId)
      : [];

    const collegeData =
      collegeExperiences.length > 0
        ? {
            avgSalary: this.calculateAvgSalaryOnly(collegeExperiences),
            minSalary: this.calculateMinSalary(collegeExperiences),
            maxSalary: this.calculateMaxSalary(collegeExperiences),
            totalOffers: collegeExperiences.length,
            roleBreakdown: this.getRoleSalaryBreakdown(collegeExperiences),
          }
        : undefined;

    const globalData = {
      avgSalary: this.calculateAvgSalaryOnly(experiences),
      minSalary: this.calculateMinSalary(experiences),
      maxSalary: this.calculateMaxSalary(experiences),
      totalOffers: experiences.length,
      roleBreakdown: this.getRoleSalaryBreakdown(experiences),
    };

    return {
      collegeData,
      globalData,
    };
  }

  private calculateAvgSalaryOnly(experiences: any[]): number {
    const sum = experiences.reduce(
      (sum, exp) => sum + (exp.salaryOffered || 0),
      0
    );
    return Math.round((sum / experiences.length) * 10) / 10;
  }

  private calculateMinSalary(experiences: any[]): number {
    const salaries = experiences.map((exp) => exp.salaryOffered);
    return Math.min(...salaries);
  }

  private calculateMaxSalary(experiences: any[]): number {
    const salaries = experiences.map((exp) => exp.salaryOffered);
    return Math.max(...salaries);
  }

  private getRoleSalaryBreakdown(experiences: any[]): any[] {
    const roleMap: Record<string, number[]> = {};

    experiences.forEach((exp) => {
      if (!roleMap[exp.role]) {
        roleMap[exp.role] = [];
      }
      roleMap[exp.role].push(exp.salaryOffered);
    });

    return Object.entries(roleMap)
      .map(([role, salaries]) => ({
        role,
        avgSalary:
          Math.round(
            (salaries.reduce((a, b) => a + b, 0) / salaries.length) * 10
          ) / 10,
        minSalary: Math.min(...salaries),
        maxSalary: Math.max(...salaries),
        count: salaries.length,
      }))
      .sort((a, b) => b.avgSalary - a.avgSalary);
  }
}

export default new CompanyService();
