import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import roadmapRoutes from "./routes/roadmap.routes";
import analysisRoutes from "./routes/resumeAnalysis.routes";
import collegeRoutes from "./routes/college.routes"; 
import companyRoutes from "./routes/company.routes";
import experienceRoutes from "./routes/experience.routes";
import questionRoutes from "./routes/question.routes";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/analysis", analysisRoutes); 
app.use("/api/colleges", collegeRoutes); 
app.use("/api/companies", companyRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/questions", questionRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "Career Path API"
  });
});

// Error handling 
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});