import { Request, Response } from "express";
import analysisService from "../services/resumeAnalysis.service";

export const saveAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // From Clerk auth
    const analysisData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User ID required",
      });
    }

    const savedAnalysis = await analysisService.saveAnalysis(
      userId,
      analysisData
    );

    res.status(201).json({
      success: true,
      data: savedAnalysis,
    });
  } catch (error: any) {
    console.error("Error saving analysis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to save analysis",
    });
  }
};

export const getUserAnalyses = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const analyses = await analysisService.getAnalysisByUserId(userId, limit);

    res.status(200).json({
      success: true,
      data: analyses,
      count: analyses.length,
    });
  } catch (error: any) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch analyses",
    });
  }
};

export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId; // ✅ This now works with POST

    const analysis = await analysisService.getAnalysisById(id, userId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch analysis",
    });
  }
};


export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId; // From auth

    const deleted = await analysisService.deleteAnalysis(id, userId);

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        error: "Analysis not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting analysis:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete analysis",
    });
  }
};
