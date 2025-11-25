// backend/src/controllers/company.controller.ts
import { Request, Response, NextFunction } from "express";
import companyService from "../services/company.service";
import { sendSuccess, sendError } from "../utils/response.util";

export const getAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companies = await companyService.getAllCompanies();
    sendSuccess(res, companies, "Companies retrieved successfully");
  } catch (error: any) {
    console.error("Get companies error:", error);
    next(error);
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const company = await companyService.getCompanyById(id);

    if (!company) {
      sendError(res, "Company not found", 404);
      return;
    }

    sendSuccess(res, company, "Company retrieved successfully");
  } catch (error: any) {
    console.error("Get company error:", error);
    next(error);
  }
};

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      logo,
      website,
      industry,
      description,
      headquarters,
      employeeCount,
    } = req.body;

    if (!name || !industry) {
      sendError(res, "Company name and industry are required", 400);
      return;
    }

    const company = await companyService.createCompany({
      name,
      logo,
      website,
      industry,
      description,
      headquarters,
      employeeCount,
    });

    sendSuccess(res, company, "Company created successfully", 201);
  } catch (error: any) {
    console.error("Create company error:", error);
    next(error);
  }
};

export const searchCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      sendError(res, "Search query is required", 400);
      return;
    }

    const companies = await companyService.searchCompanies(q);
    sendSuccess(res, companies, "Companies found");
  } catch (error: any) {
    console.error("Search companies error:", error);
    next(error);
  }
};

export const getCompaniesByIndustry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { industry } = req.params;
    const companies = await companyService.getCompaniesByIndustry(industry);
    sendSuccess(res, companies, "Companies retrieved successfully");
  } catch (error: any) {
    console.error("Get companies by industry error:", error);
    next(error);
  }
};

export const getCompanyInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { collegeId } = req.query;

    const insights = await companyService.getCompanyInsights(
      id,
      collegeId as string | undefined
    );

    sendSuccess(res, insights, "Insights retrieved successfully");
  } catch (error: any) {
    console.error("Get company insights error:", error);
    next(error);
  }
};

export const getSalaryInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { collegeId } = req.query;

    const insights = await companyService.getSalaryInsights(
      id,
      collegeId as string | undefined
    );

    sendSuccess(res, insights, "Salary insights retrieved successfully");
  } catch (error: any) {
    console.error("Get salary insights error:", error);
    next(error);
  }
};