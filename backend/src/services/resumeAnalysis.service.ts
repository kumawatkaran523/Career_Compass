import prisma from "../lib/prisma";

interface AnalysisData {
  status: string;
  processing_time: number;
  extracted_info: {
    name: string;
    email: string;
    phone: string;
    organizations: string[];
    locations: string[];
  };
  skills: Array<{
    skill: string;
    confidence: number;
    context: string;
  }>;
  analysis: {
    career_recommendations: Array<{
      role: string;
      match_score: number;
      reasoning: string;
    }>;
    ats_score: number;
    ats_feedback: string;
    missing_skills: string[];
    quick_wins: string[];
    salary_prediction: {
      min: number;
      max: number;
      currency: string;
    };
    summary: string;
  };
}

class AnalysisService {
  async saveAnalysis(userId: string, data: AnalysisData) {
    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId,
        candidateName: data.extracted_info.name,
        candidateEmail: data.extracted_info.email,
        candidatePhone: data.extracted_info.phone,
        organizations: data.extracted_info.organizations,
        locations: data.extracted_info.locations,
        skills: data.skills,
        careerRecommendations: data.analysis.career_recommendations,
        atsScore: data.analysis.ats_score,
        atsFeedback: data.analysis.ats_feedback,
        missingSkills: data.analysis.missing_skills,
        quickWins: data.analysis.quick_wins,
        salaryMin: data.analysis.salary_prediction.min,
        salaryMax: data.analysis.salary_prediction.max,
        salaryCurrency: data.analysis.salary_prediction.currency,
        summary: data.analysis.summary,
        processingTime: data.processing_time,
      },
    });

    console.log("✅ Resume analysis saved:", analysis.id);
    return analysis;
  }

  async getAnalysisByUserId(userId: string, limit = 10) {
    const analyses = await prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { analyzedAt: "desc" },
      take: limit,
    });

    return analyses;
  }

  async getAnalysisById(id: string, userId: string) {
    const analysis = await prisma.resumeAnalysis.findFirst({
      where: { id, userId },
    });

    return analysis;
  }

  async deleteAnalysis(id: string, userId: string) {
    const deleted = await prisma.resumeAnalysis.deleteMany({
      where: { id, userId },
    });

    console.log("🗑  Resume analysis deleted:", id);
    return deleted;
  }

  async getAllAnalysesByEmail(email: string) {
    const analyses = await prisma.resumeAnalysis.findMany({
      where: { candidateEmail: email },
      orderBy: { analyzedAt: "desc" },
    });

    return analyses;
  }
}

export default new AnalysisService();