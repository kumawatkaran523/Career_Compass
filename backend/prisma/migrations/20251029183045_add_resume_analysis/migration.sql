-- CreateTable
CREATE TABLE "ResumeAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "candidateName" TEXT,
    "candidateEmail" TEXT,
    "candidatePhone" TEXT,
    "organizations" JSONB NOT NULL,
    "locations" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "careerRecommendations" JSONB NOT NULL,
    "atsScore" INTEGER NOT NULL,
    "atsFeedback" TEXT NOT NULL,
    "missingSkills" JSONB NOT NULL,
    "quickWins" JSONB NOT NULL,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "summary" TEXT NOT NULL,
    "processingTime" DOUBLE PRECISION NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResumeAnalysis_userId_idx" ON "ResumeAnalysis"("userId");

-- CreateIndex
CREATE INDEX "ResumeAnalysis_candidateEmail_idx" ON "ResumeAnalysis"("candidateEmail");

-- CreateIndex
CREATE INDEX "ResumeAnalysis_analyzedAt_idx" ON "ResumeAnalysis"("analyzedAt");

-- AddForeignKey
ALTER TABLE "ResumeAnalysis" ADD CONSTRAINT "ResumeAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
