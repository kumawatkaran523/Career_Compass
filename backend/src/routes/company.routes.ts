// backend/src/routes/company.routes.ts
import { Router } from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  searchCompanies,
  getCompaniesByIndustry,
  getCompanyInsights,
  getSalaryInsights,
} from "../controllers/company.controller";

const router = Router();

router.get("/", getAllCompanies);
router.get("/search", searchCompanies);
router.post("/", createCompany);
router.get("/industry/:industry", getCompaniesByIndustry);
router.get("/:id/insights", getCompanyInsights);
router.get("/:id/salary-insights", getSalaryInsights);
router.get("/:id", getCompanyById);

export default router;
